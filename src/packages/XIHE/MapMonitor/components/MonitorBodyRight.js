import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { isNull } from '@/utils/utils';
import { connect } from '@/utils/dva';
import { MonitorRightTools } from '../enums';
import commonStyles from '@/common.module.less';
import styles from '../monitorLayout.module.less';
import classnames from 'classnames';

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
      return <img alt={icon} src={require(`../svg/${icon}`).default} style={style} />;
    } else {
      return <span style={style}>{icon}</span>;
    }
  }

  function renderPanelContent() {
    //
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
