import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { isNull } from '@/utils/utils';
import { connect } from '@/utils/dva';
import { Category, MonitorRightTools } from '../enums';
import AgvCategorySecondaryPanel from '../PopoverPanel/AgvCategorySecondaryPanel';
import { AGVType } from '@/config/config';
import styles from '../monitorLayout.module.less';

const MonitorBodyRight = (props) => {
  const { dispatch, categoryPanel } = props;

  const [height, setHeight] = useState(0);

  useEffect(() => {
    const htmlDOM = document.getElementById('monitorPixi');
    const { height } = htmlDOM.getBoundingClientRect();
    setHeight(height - 10);
  }, []);

  function updateEditPanelFlag(category) {
    if (categoryPanel === category) {
      dispatch({ type: 'monitor/saveCategoryPanel', payload: null });
    } else {
      dispatch({ type: 'monitor/saveCategoryPanel', payload: category });
    }
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
      default:
        return null;
    }
  }

  return (
    <div className={styles.bodyRightSide}>
      {MonitorRightTools.map(({ label, value, icon, style }) => (
        <Tooltip key={value} placement="right" title={label}>
          <div
            role={'category'}
            className={categoryPanel === value ? styles.categoryActive : undefined}
            onClick={() => {
              updateEditPanelFlag(value);
            }}
          >
            {renderIcon(icon, style)}
          </div>
        </Tooltip>
      ))}
      {!isNull(categoryPanel) ? renderPanelContent() : null}
    </div>
  );
};
export default connect(({ monitor }) => ({
  categoryPanel: monitor.categoryPanel,
}))(memo(MonitorBodyRight));
