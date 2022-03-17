import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { AgvCategoryTools } from '../enums';
import styles from '../monitorLayout.module.less';

const AgvCategorySecondaryPanel = (props) => {
  const { agvType, height } = props;

  function renderIcon(icon, style) {
    if (typeof icon === 'string') {
      return <img alt={icon} src={require(`../category/${icon}`).default} style={style} />;
    } else {
      return <span style={style}>{icon}</span>;
    }
  }

  function onClick(category) {
    window.$$dispatch({ type: 'monitor/saveCategoryModal', payload: category });
  }

  return (
    <div style={{ height, width: 60, overflow: 'auto' }} className={styles.popoverPanel}>
      {AgvCategoryTools.map(({ label, icon, value, style, module }) => {
        if (module.includes(agvType)) {
          const title = typeof label === 'function' ? label(agvType) : label;
          return (
            <Tooltip key={value} placement="left" title={title}>
              <div
                role={'category'}
                onClick={() => {
                  onClick(value);
                }}
              >
                {renderIcon(icon, style)}
              </div>
            </Tooltip>
          );
        }
      }).filter(Boolean)}
    </div>
  );
};
export default memo(AgvCategorySecondaryPanel);
