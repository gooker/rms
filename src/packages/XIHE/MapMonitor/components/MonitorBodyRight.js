import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { throttle } from 'lodash';
import { isNull, dealResponse } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { AGVType, AppCode } from '@/config/config';
import { Category, MonitorRightTools } from '../enums';
import { useMount } from '@umijs/hooks';
import { hasAppPermission } from '@/utils/Permission';
import { fetchWorkStationPods } from '@/services/monitor';
import Property from '../PopoverPanel/Property';
import AgvCategorySecondaryPanel from '../PopoverPanel/AgvCategorySecondaryPanel';
import ViewCategorySecondaryPanel from '../PopoverPanel/ViewCategorySecondaryPanel';
import MessageCategorySecondaryPanel from '../PopoverPanel/MessageCategorySecondaryPanel';
import MonitorSelectionPanel from '../PopoverPanel/MonitorSelectionPanel';
import EmergencyStopPanel from '../PopoverPanel/EmergencyStopPanel';
import SimulatorPanel from '../PopoverPanel/SimulatorPanel';
import styles from '../monitorLayout.module.less';

const MonitorBodyRight = (props) => {
  const { dispatch, selections, categoryPanel, podToWorkstationInfo, latentStopMessageList } =
    props;

  const [height, setHeight] = useState(0);
  const [top, setTop] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);

  useEffect(() => {
    const htmlDOM = document.getElementById('monitorPixi');
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const { height, top } = htmlDOM.getBoundingClientRect();
        setHeight(height);
        setTop(top);
      }, 500),
    );
    resizeObserver.observe(htmlDOM);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useMount(() => {
    // 获取潜伏车到站信息和暂停消息
    if (hasAppPermission(AppCode.LatentLifting)) {
      dispatch({ type: 'monitor/fetchLatentStopMessageList' });
      fetchWorkStationPods().then((res) => {
        if (!dealResponse(res)) {
          dispatch({
            type: 'monitor/savePodToWorkStation',
            payload: res,
          });
        }
      });
    }
  });

  function updateEditPanelFlag(category) {
    if (categoryPanel === category) {
      dispatch({ type: 'monitor/saveCategoryPanel', payload: null });
    } else {
      dispatch({ type: 'monitor/saveCategoryPanel', payload: category });
    }
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  function renderIcon(icon, style) {
    if (typeof icon === 'string') {
      return <img alt={icon} src={require(`../category/${icon}`).default} style={style} />;
    } else {
      return <span style={style}>{icon}</span>;
    }
  }

  function renderPanelContent() {
    switch (categoryPanel) {
      case Category.Prop:
        return <Property height={height - 10} />;
      case Category.LatentAGV:
        return <AgvCategorySecondaryPanel agvType={AGVType.LatentLifting} height={450} />;
      case Category.ToteAGV:
        return <AgvCategorySecondaryPanel agvType={AGVType.Tote} height={350} />;
      case Category.SorterAGV:
        return <AgvCategorySecondaryPanel agvType={AGVType.Sorter} height={450} />;
      case Category.Select:
        return <MonitorSelectionPanel height={height - 10} />;
      case Category.Simulator:
        return <SimulatorPanel height={height - 10} />;
      case Category.Emergency:
        return <EmergencyStopPanel height={160} pixHeight={height} offsetTop={offsetTop} />;
      case Category.View:
        return (
          <ViewCategorySecondaryPanel
            type={Category.View}
            height={300}
            pixHeight={height}
            offsetTop={offsetTop}
          />
        );
      case Category.Resource:
        return (
          <ViewCategorySecondaryPanel
            type={Category.Resource}
            height={210}
            pixHeight={height}
            offsetTop={offsetTop}
          />
        );
      case Category.Message:
        return (
          <MessageCategorySecondaryPanel
            type={Category.Message}
            height={110}
            pixHeight={height}
            offsetTop={offsetTop}
          />
        );
      default:
        return null;
    }
  }

  function renderBadge(type) {
    switch (type) {
      case Category.Message: {
        const total = podToWorkstationInfo.length + latentStopMessageList.length;
        if (total > 0) {
          return (
            <div className={styles.categoryBadge} style={{ background: '#1870bd' }}>
              {total > 99 ? '99+' : total}
            </div>
          );
        }
        return null;
      }
      case Category.Select: {
        if (selections.length > 0) {
          return (
            <div className={styles.categoryBadge} style={{ background: '#1870bd' }}>
              {selections.length > 99 ? '99+' : selections.length}
            </div>
          );
        }
        return null;
      }
      default:
        return null;
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.bodyRightSide} style={{ height }}>
        {MonitorRightTools.map(({ label, value, icon, style }) => {
          return (
            <Tooltip key={value} placement="right" title={label}>
              <div
                role={'category'}
                style={{ position: 'relative' }}
                className={categoryPanel === value ? styles.categoryActive : undefined}
                onClick={(e) => {
                  const { top: categoryTop } = e?.target?.getBoundingClientRect();
                  setOffsetTop(categoryTop - top);
                  if (value !== Category.Prop || categoryPanel === Category.Prop) {
                    updateEditPanelFlag(value);
                  }
                }}
              >
                {renderIcon(icon, style)}
                {renderBadge(value)}
              </div>
            </Tooltip>
          );
        })}
      </div>
      {!isNull(categoryPanel) ? renderPanelContent() : null}
    </div>
  );
};
export default connect(({ monitor }) => ({
  selections: monitor.selections,
  categoryPanel: monitor.categoryPanel,
  podToWorkstationInfo: monitor.podToWorkstationInfo || [],
  latentStopMessageList: monitor.latentStopMessageList || [],
}))(memo(MonitorBodyRight));
