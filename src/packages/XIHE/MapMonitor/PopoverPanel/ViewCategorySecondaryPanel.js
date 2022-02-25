import React, { memo, useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import {
  Category,
  EmergencyCategoryTools,
  ViewCategoryTools,
  ResourceCategoryTools,
} from '../enums';
import styles from '../monitorLayout.module.less';

const defaultTop = 95;

const ViewCategorySecondaryPanel = (props) => {
  const { dispatch, height, offsetTop, type } = props;
  const [categoryTools, setCategoryTools] = useState([]);
  const [top, setTop] = useState(5);

  useEffect(() => {
    let _top = 5;
    if (offsetTop) {
      _top = offsetTop - defaultTop - height / 2;
      if (_top < 5) {
        _top = 5;
      }
    }
    setTop(_top);

    if (type === Category.View) {
      setCategoryTools(ViewCategoryTools);
    }
    if (type === Category.Emergency) {
      setCategoryTools(EmergencyCategoryTools);
    }
    if (type === Category.Resource) {
      setCategoryTools(ResourceCategoryTools);
    }
  }, [height, offsetTop, type]);

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
