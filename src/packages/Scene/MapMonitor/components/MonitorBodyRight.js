import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { throttle } from 'lodash';
import { isNull, dealResponse } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { AGVType, AppCode } from '@/config/config';
import { Category, MonitorRightTools, RightToolBarWidth } from '../enums';
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
  const { dispatch, selections, categoryPanel } = props;
  const { podToWorkstationInfo, latentStopMessageList } = props;

  const [offsetTop, setOffsetTop] = useState(0);

  useMount(() => {
    // 获取潜伏车到站信息和暂停消息
    if (hasAppPermission(AppCode.LatentPod)) {
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
        return <Property />;
      case Category.LatentAGV:
        return <AgvCategorySecondaryPanel agvType={AGVType.LatentLifting} height={450} />;
      case Category.ToteAGV:
        return <AgvCategorySecondaryPanel agvType={AGVType.Tote} height={350} />;
      case Category.SorterAGV:
        return <AgvCategorySecondaryPanel agvType={AGVType.Sorter} height={450} />;
      case Category.View:
        return (
          <ViewCategorySecondaryPanel
            type={Category.View}
            height={250}
            pixHeight={100}
            offsetTop={offsetTop}
          />
        );
      case Category.Select:
        return <MonitorSelectionPanel />;
      case Category.Simulator:
        return <SimulatorPanel />;
      case Category.Emergency:
        return <EmergencyStopPanel height={160} pixHeight={100} offsetTop={offsetTop} />;
      case Category.Resource:
        return (
          <ViewCategorySecondaryPanel
            type={Category.Resource}
            height={210}
            pixHeight={100}
            offsetTop={offsetTop}
          />
        );
      case Category.Message:
        return (
          <MessageCategorySecondaryPanel
            type={Category.Message}
            height={110}
            pixHeight={100}
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
    <div className={styles.bodyRightSideContainer} style={{ width: `${RightToolBarWidth}px` }}>
      <div className={styles.bodyRightSide}>
        {MonitorRightTools.map(({ label, value, icon, style }) => {
          return (
            <Tooltip key={value} placement="right" title={label}>
              <div
                role={'category'}
                style={{ position: 'relative' }}
                className={categoryPanel === value ? styles.categoryActive : undefined}
                onClick={(e) => {
                  const { top: categoryTop } = e?.target?.getBoundingClientRect();
                  setOffsetTop(categoryTop);
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
