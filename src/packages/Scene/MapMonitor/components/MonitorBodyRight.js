import React, { memo, useEffect, useState } from 'react';
import { getRandomString, isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { Category, MonitorRightTools, RightToolBarWidth } from '../enums';
import Property from '../PopoverPanel/Property';
import VehicleCategorySecondaryPanel from '../PopoverPanel/VehicleCategorySecondaryPanel';
import ViewCategorySecondaryPanel from '../PopoverPanel/ViewCategorySecondaryPanel';
import MessageCategorySecondaryPanel from '../PopoverPanel/MessageCategorySecondaryPanel';
import MonitorSelectionPanel from '../PopoverPanel/MonitorSelectionPanel';
import EmergencyStopPanel from '../PopoverPanel/EmergencyStopPanel';
import SimulatorPanel from '../PopoverPanel/SimulatorPanel';
import styles from '../monitorLayout.module.less';
import EventManager from '@/utils/EventManager';

const functionId = getRandomString(6);
const MonitorBodyRight = (props) => {
  const { dispatch, selections, categoryPanel } = props;
  const { podToWorkstationInfo, latentStopMessageList } = props;

  const [pixHeight, setPixHeight] = useState(0); // 地图区域高度
  const [offsetTop, setOffsetTop] = useState(0);

  useEffect(() => {
    // TODO: 获取潜伏车到站信息和暂停消息
    // if (hasAppPermission(AppCode.LatentPod)) {
    //   dispatch({ type: 'monitor/fetchLatentStopMessageList' });
    //   fetchWorkStationPods().then((res) => {
    //     if (!dealResponse(res)) {
    //       dispatch({
    //         type: 'monitor/savePodToWorkStation',
    //         payload: res,
    //       });
    //     }
    //   });
    // }

    // 初始化高度
    const { height } = document.getElementById('monitorPixi').getBoundingClientRect();
    setPixHeight(height);

    // 动态计算pixHeight 和 offsetTop
    function calculate({ height }) {
      setPixHeight(height - 35);
    }

    EventManager.subscribe('resize', calculate, functionId);

    return () => {
      EventManager.unsubscribe('resize', functionId);
    };
  }, []);

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
      case Category.Control:
        return <VehicleCategorySecondaryPanel />;
      case Category.View: {
        return (
          <ViewCategorySecondaryPanel
            type={Category.View}
            height={150} // 面板实际高度
            pixHeight={pixHeight}
            offsetTop={offsetTop}
          />
        );
      }
      case Category.Select:
        return <MonitorSelectionPanel />;
      case Category.Simulator:
        return <SimulatorPanel />;
      case Category.Emergency:
        return (
          <EmergencyStopPanel height={160} pixHeight={pixHeight - 115} offsetTop={offsetTop} />
        );

      case Category.Resource: {
        return (
          <ViewCategorySecondaryPanel
            type={Category.Resource}
            height={210}
            pixHeight={pixHeight}
            offsetTop={offsetTop}
          />
        );
      }
      case Category.Message: {
        return (
          <MessageCategorySecondaryPanel
            type={Category.Message}
            height={110}
            pixHeight={pixHeight}
            offsetTop={offsetTop}
          />
        );
      }
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
            <div
              key={value}
              role={'category'}
              style={{ position: 'relative' }}
              className={categoryPanel === value ? styles.categoryActive : undefined}
              onClick={(e) => {
                let top;
                if (e.target.tagName === 'IMG') {
                  top = e.target.parentElement.getBoundingClientRect().top;
                } else if (e.target.tagName === 'svg') {
                  top =
                    e.target.parentElement.parentElement.parentElement.getBoundingClientRect().top;
                } else {
                  top = e.target.getBoundingClientRect().top;
                }
                setOffsetTop(top);
                if (value === Category.Prop) {
                  if (selections.length === 1) {
                    updateEditPanelFlag(value);
                  }
                } else {
                  updateEditPanelFlag(value);
                }
              }}
            >
              {renderIcon(icon, style)}
              {renderBadge(value)}
            </div>
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
