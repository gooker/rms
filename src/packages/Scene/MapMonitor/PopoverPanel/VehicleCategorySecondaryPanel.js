import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { VehicleCategoryTools } from '../enums';
import styles from '../monitorLayout.module.less';

const VehicleCategorySecondaryPanel = () => {
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
    <div style={{ height: 450, width: 60, overflow: 'auto' }} className={styles.popoverPanel}>
      {VehicleCategoryTools.map(({ label, icon, value, style }) => {
        return (
          <Tooltip key={value} placement="left" title={label}>
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
      }).filter(Boolean)}
    </div>
  );
};
export default memo(VehicleCategorySecondaryPanel);
