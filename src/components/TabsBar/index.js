import React, { memo, useEffect, useState } from 'react';
import { throttle } from 'lodash';
import { connect } from '@/utils/RmsDva';
import TabButton from '@/components/TabsBar/TabButton';
import styles from './tabsBar.module.less';

const Index = (props) => {
  const { dispatch, tabs, activeTab } = props;
  const [width, setWidth] = useState();

  console.log(tabs);

  useEffect(() => {
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

  function onChange(menuKey) {
    dispatch({ type: 'menu/saveActiveTab', payload: menuKey });
  }

  function onRemove(menuKey) {
    dispatch({ type: 'menu/removeTab', payload: menuKey });
  }

  return (
    <div className={styles.tabsContainer} style={{ width: width }}>
      {tabs.map(({ path, title }) => (
        <TabButton
          key={path}
          active={path === activeTab}
          menuKey={path}
          label={title}
          onClick={onChange}
          onDelete={onRemove}
        />
      ))}
    </div>
  );
};
export default connect(({ menu }) => ({
  activeTab: menu.activeTab,
}))(memo(Index));
