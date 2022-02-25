import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { throttle } from 'lodash';
import { isNull } from '@/utils/util';
import { connect } from '@/utils/RmsDva';
import { AGVType } from '@/config/config';
import {
  Category,
  MonitorRightTools,
  EmergencyCategoryTools,
  ViewCategoryTools,
  ResourceCategoryTools,
} from '../enums';
import ElementProp from '../PopoverPanel/ElementProp';
import AgvCategorySecondaryPanel from '../PopoverPanel/AgvCategorySecondaryPanel';
import ViewCategorySecondaryPanel from '../PopoverPanel/ViewCategorySecondaryPanel';
import SimulatorPanel from '../PopoverPanel/SimulatorPanel';
import styles from '../monitorLayout.module.less';

const MonitorBodyRight = (props) => {
  const { dispatch, categoryPanel } = props;

  const [height, setHeight] = useState(0);
  const [offsetTop, setOffsetTop] = useState(0);

  useEffect(() => {
    const htmlDOM = document.getElementById('monitorPixi');
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const { height } = htmlDOM.getBoundingClientRect();
        setHeight(height);
      }, 500),
    );
    resizeObserver.observe(htmlDOM);

    return () => {
      resizeObserver.disconnect();
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
        return <ElementProp height={height - 10} />;
      case Category.LatentAGV:
        return (
          <AgvCategorySecondaryPanel
            agvType={AGVType.LatentLifting}
            dispatch={dispatch}
            height={450}
          />
        );
      case Category.ToteAGV:
        return (
          <AgvCategorySecondaryPanel agvType={AGVType.Tote} dispatch={dispatch} height={350} />
        );
      case Category.SorterAGV:
        return (
          <AgvCategorySecondaryPanel agvType={AGVType.Sorter} dispatch={dispatch} height={350} />
        );
      case Category.View:
        return (
          <ViewCategorySecondaryPanel
            type={Category.View}
            categoryTools={ViewCategoryTools}
            dispatch={dispatch}
            height={350}
            offsetTop={offsetTop}
          />
        );
      case Category.Simulator:
        return <SimulatorPanel dispatch={dispatch} height={height - 10} />;
      case Category.Emergency:
        return (
          <ViewCategorySecondaryPanel
          type={Category.Emergency}
            categoryTools={EmergencyCategoryTools}
            dispatch={dispatch}
            height={170}
            offsetTop={offsetTop}
          />
        );
      case Category.Resource:
        return (
          <ViewCategorySecondaryPanel
          type={Category.Resource}
            categoryTools={ResourceCategoryTools}
            dispatch={dispatch}
            height={210}
            offsetTop={offsetTop + 20}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.bodyRightSide} style={{ height }}>
        {MonitorRightTools.map(({ label, value, icon, style }) => (
          <Tooltip key={value} placement="right" title={label}>
            <div
              role={'category'}
              className={categoryPanel === value ? styles.categoryActive : undefined}
              onClick={(e) => {
                const { top } = e?.target?.getBoundingClientRect();
                setOffsetTop(top);
                if (value !== Category.Prop || categoryPanel === Category.Prop) {
                  updateEditPanelFlag(value);
                }
              }}
            >
              {renderIcon(icon, style)}
            </div>
          </Tooltip>
        ))}
      </div>
      {!isNull(categoryPanel) ? renderPanelContent() : null}
    </div>
  );
};
export default connect(({ monitor }) => ({
  categoryPanel: monitor.categoryPanel,
}))(memo(MonitorBodyRight));
