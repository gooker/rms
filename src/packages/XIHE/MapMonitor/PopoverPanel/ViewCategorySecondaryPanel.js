import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { ViewCategoryTools } from '../enums';
import styles from '../monitorLayout.module.less';

const ViewCategorySecondaryPanel = (props) => {
  const { dispatch, height } = props;

  function renderIcon(icon, style) {
    if (typeof icon === 'string') {
      return <img alt={icon} src={require(`../category/${icon}`).default} style={style} />;
    } else {
      return <span style={style}>{icon}</span>;
    }
  }

  function onClick(category) {
    dispatch({ type: 'monitor/saveCategoryModal', payload: category });
  }

  return (
    <div style={{ height, width: 60, top: 80 }} className={styles.popoverPanel}>
      {ViewCategoryTools.map(({ label, icon, value, style, module }) => {
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
export default memo(ViewCategorySecondaryPanel);
