import React, { memo, useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import { Category, ViewCategoryTools, ResourceCategoryTools } from '../enums';
import styles from '../monitorLayout.module.less';

const ViewCategorySecondaryPanel = (props) => {
  const { type, height, offsetTop, pixHeight } = props;

  const [categoryTools, setCategoryTools] = useState([]);
  const [top, setTop] = useState(5);

  useEffect(() => {
    let _top = 5;
    if (offsetTop) {
      _top = offsetTop - height / 2;
      const _height = _top + height - pixHeight;
      if (_height > 0) {
        _top = _top - _height;
      }
      if (_top < 5) {
        _top = 5;
      }
    }
    setTop(_top);
    if (type === Category.View) {
      setCategoryTools(ViewCategoryTools);
    }
    if (type === Category.Resource) {
      setCategoryTools(ResourceCategoryTools);
    }
  }, [height, offsetTop, pixHeight, type]);

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
    <div style={{ height, width: 60, top: top }} className={styles.popoverPanel}>
      {categoryTools
        .map(({ label, icon, value, style }) => {
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
        })
        .filter(Boolean)}
    </div>
  );
};
export default memo(ViewCategorySecondaryPanel);
