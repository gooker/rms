import React, { memo, useEffect, useRef, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { throttle } from 'lodash';
import { connect } from '@/utils/RmsDva';
import TabButton from '@/components/TabsBar/TabButton';
import styles from './tabsBar.module.less';

const TabsBar = (props) => {
  const { dispatch, tabInfo, tabs, activeTab } = props;
  const [width, setWidth] = useState();
  const [leftDisabled, setLeftDisabled] = useState(); // 左按钮禁用
  const [rightDisabled, setRightDisabled] = useState(); // 右按钮禁用
  const domRef = useRef();

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
        onScroll();
      }, 500),
    );
    resizeObserver.observe(layoutContentDOM);

    // 监听Scroll事件
    domRef.current.onscroll = throttle(onScroll, 200);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    onScroll();
  }, [tabs]);

  function onScroll() {
    const scrollLeft = domRef.current.scrollLeft;
    const clientWidth = domRef.current.clientWidth;
    const scrollWidth = domRef.current.scrollWidth;

    setLeftDisabled(scrollLeft === 0);
    setRightDisabled(clientWidth === scrollWidth || scrollWidth - clientWidth === scrollLeft);
  }

  function leftScroll() {
    domRef.current.scrollTo(0, 0);
  }

  function rightScroll() {
    const clientWidth = domRef.current.clientWidth;
    const scrollWidth = domRef.current.scrollWidth;
    domRef.current.scrollTo(scrollWidth - clientWidth, 0);
  }

  return (
    <div className={styles.tabsContainer} style={{ width: width }}>
      <div
        className={styles.tabScroller}
        onClick={leftScroll}
        style={{
          marginRight: 3,
          background: !leftDisabled ? '#fff' : '#9f9f9f',
          cursor: !leftDisabled ? 'pointer' : 'not-allowed',
        }}
      >
        <LeftOutlined />
      </div>
      <div
        ref={domRef}
        style={{ maxWidth: width ? width - 70 : 0, whiteSpace: 'nowrap', overflow: 'auto' }}
      >
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
          background: !rightDisabled ? '#fff' : '#9f9f9f',
          cursor: !rightDisabled ? 'pointer' : 'not-allowed',
        }}
      >
        <RightOutlined />
      </div>
    </div>
  );
};
export default connect(({ menu }) => ({
  tabs: menu.tabs,
  activeTab: menu.activeTab,
}))(memo(TabsBar));
