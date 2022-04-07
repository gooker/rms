import React, { memo, useEffect, useState } from 'react';
import { throttle } from 'lodash';
import TabButton from '@/components/TabsBar/TabButton';
import styles from './tabsBar.module.less';

const TabsBar = (props) => {
  const { tabInfo } = props;
  const [width, setWidth] = useState(0);

  useEffect(() => {
    // 监听容器Resize事件
    const layoutContentDOM = document.getElementById('layoutContent');
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        const { width } = layoutContentDOM.getBoundingClientRect();
        // Tab栏不能遮挡右上方工具栏; 200为该工具栏的宽度
        let _width = width * 0.8;
        if (_width + 200 > width) {
          _width = width - 200;
        }
        setWidth(_width);
      }, 500),
    );
    resizeObserver.observe(layoutContentDOM);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className={styles.tabsContainer} style={{ width: width }}>
      <div style={{ maxWidth: width ? width - 70 : 0, whiteSpace: 'nowrap', overflow: 'auto' }}>
        {tabInfo
          .map(({ path, title }, index) => {
            if (path !== '/') {
              return <TabButton key={path} index={index} menuKey={path} label={title} />;
            }
          })
          .filter(Boolean)}
      </div>
    </div>
  );
};
export default memo(TabsBar);
