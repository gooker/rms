import React, { memo, useEffect, useRef, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { throttle, findIndex } from 'lodash';
import { connect } from '@/utils/RmsDva';
import TabButton from '@/components/TabsBar/TabButton';
import styles from './tabsBar.module.less';

const TabsBar = (props) => {
  const { dispatch, tabInfo, tabs, activeTab, currentActiveTabIndex } = props;
  const [width, setWidth] = useState();
  const domRef = useRef();

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

  function leftScroll() {
    if (currentActiveTabIndex !== 0) {
      const currentIndex = currentActiveTabIndex - 1;
      dispatch({ type: 'menu/saveActiveTab', payload: tabs[currentIndex].path });
      scrollToActiveTab(currentIndex);
    }
  }

  function rightScroll() {
    if (currentActiveTabIndex !== tabs.length - 1) {
      const currentIndex = currentActiveTabIndex + 1;
      dispatch({ type: 'menu/saveActiveTab', payload: tabs[currentIndex].path });
      scrollToActiveTab(currentIndex);
    }
  }

  function scrollToActiveTab(currentIndex) {
    const currentActiveTabDOM = domRef.current.children[currentIndex];
    currentActiveTabDOM.scrollIntoView({
      behavior: 'smooth',
    });
  }

  return (
    <div className={styles.tabsContainer} style={{ width: width }}>
      <div
        className={styles.tabScroller}
        onClick={leftScroll}
        style={{
          marginRight: 3,
          background: currentActiveTabIndex !== 0 ? '#fff' : '#9f9f9f',
          cursor: currentActiveTabIndex !== 0 ? 'pointer' : 'not-allowed',
        }}
      >
        <LeftOutlined />
      </div>
      <div ref={domRef} style={{ maxWidth: width - 70, whiteSpace: 'nowrap', overflow: 'auto' }}>
        {tabInfo.map(({ path, title }, index) => (
          <TabButton
            key={path}
            index={index}
            tabCount={tabInfo.length}
            active={path === activeTab}
            menuKey={path}
            label={title}
            dispatch={dispatch}
          />
        ))}
      </div>
      <div
        className={styles.tabScroller}
        onClick={rightScroll}
        style={{
          marginLeft: 3,
          background: currentActiveTabIndex !== tabs.length - 1 ? '#fff' : '#9f9f9f',
          cursor: currentActiveTabIndex !== tabs.length - 1 ? 'pointer' : 'not-allowed',
        }}
      >
        <RightOutlined />
      </div>
    </div>
  );
};
export default connect(({ menu }) => {
  const { tabs, activeTab } = menu;
  return {
    tabs,
    activeTab,
    currentActiveTabIndex: findIndex(tabs, { path: activeTab }),
  };
})(memo(TabsBar));
