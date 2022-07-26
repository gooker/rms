import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { Category, ResourceCategoryTools, ViewCategoryTools } from '../enums';
import styles from '../monitorLayout.module.less';

const ViewCategorySecondaryPanel = (props) => {
  const { type, height, offsetTop, pixHeight } = props;

  const [categoryTools, setCategoryTools] = useState([]);
  const [top, setTop] = useState(5);

  useEffect(() => {
    // TIP: 该部分逻辑在多个地方使用到, 需要优化
    // EmergencyStopPanel.js, ViewCategorySecondaryPanel.js，MessageCategorySecondaryPanel.js
    let _top = 5;
    if (offsetTop) {
      _top = offsetTop;
      // _top - 115 + height 表示弹窗在地图范围由上而下占据总高度
      const _height = pixHeight - (_top - 115 + height);
      if (_height <= 0) {
        _top = 5;
      } else {
        _top = _top - 115;
      }
    }
    setTop(_top);
    // ----------

    if (type === Category.View) {
      setCategoryTools(ViewCategoryTools);
    }
    if (type === Category.Resource) {
      setCategoryTools(ResourceCategoryTools);
    }
  }, [type, height, pixHeight, offsetTop]);

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
    <div style={{ width: 60, top }} className={styles.popoverPanel}>
      {categoryTools
        .map(({ label, icon, value, style }) => {
          return (
            <Tooltip key={value} placement='left' title={label}>
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
