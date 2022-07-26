import React, { memo, useEffect, useRef } from 'react';
import { Tabs } from 'antd';
import { debounce } from 'lodash';
import { Route, useHistory } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import EventManager from '@/utils/EventManager';
import { formatMessage, getSortedAppList, isStrictNull } from '@/utils/util';
import TabsBar from '@/components/TabsBar';
import TaskDetail from '@/components/TaskDetail';
import style from '@/layout/homeLayout.module.less';
import I18nEditor from '@/components/I18nEditor';

const { TabPane } = Tabs;

const Content = (props) => {
  const { dispatch, grantedAPP, currentApp, currentUser } = props;
  const { tabs, activeTab, routeLocaleKeyMap } = props;

  const domRef = useRef();
  const history = useHistory();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(
      debounce((entries) => {
        const { contentRect } = entries[0];
        EventManager.dispatch('resize', contentRect);
      }, 200),
    );
    resizeObserver.observe(domRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!isStrictNull(activeTab)) {
      history.push(activeTab);
      // 首页状态下默认显示的APP菜单
      if (activeTab === '/') {
        const sortedAppList = getSortedAppList(grantedAPP, currentUser.username === 'admin');
        dispatch({
          type: 'global/saveCurrentApp',
          payload: sortedAppList[0],
        });
      } else {
        const _currentApp = activeTab.split('/')[1];
        // 如果是切换了APP，那么Menu会主动更新openKeys
        if (currentApp !== _currentApp) {
          dispatch({ type: 'global/saveCurrentApp', payload: _currentApp });
        } else {
          // 如果不是切换APP只是单纯在某个APP级别切换Tab, 那就需要手动触发Menu更新openKeys
          dispatch({ type: 'menu/forceUpdateOpenKeys' });
          dispatch({ type: 'menu/saveSelectedKeys', payload: [activeTab] });
        }
      }
    }
  }, [activeTab]);

  function renderTabBar(props) {
    // 提取tab信息
    const tabInfo = [];
    props.panes.forEach((item) => {
      tabInfo.push({ path: item.key, title: item.props.tab });
    });

    // 不显示"首页"Tab
    if (props.panes.length <= 1) {
      return null;
    }
    return <TabsBar tabInfo={tabInfo} />;
  }

  return (
    <div ref={domRef} id={'layoutContent'} className={style.layoutContent}>
      <Tabs activeKey={activeTab} renderTabBar={renderTabBar}>
        {tabs.map((item) => {
          return (
            <TabPane
              key={item.path}
              closable={item.path !== '/'}
              tab={formatMessage({ id: routeLocaleKeyMap[item.path] })}
            >
              <Route exact key={item.path} component={item.$$component} />
            </TabPane>
          );
        })}
      </Tabs>

      {/* 国际化编辑 */}
      <I18nEditor />

      {/* 任务详情全局组件 */}
      <TaskDetail />
    </div>
  );
};
export default connect(({ global, menu, user }) => ({
  currentUser: user.currentUser,
  currentApp: global.currentApp,
  grantedAPP: global.grantedAPP,
  tabs: menu.tabs,
  activeTab: menu.activeTab,
  routeLocaleKeyMap: menu.routeLocaleKeyMap,
}))(memo(Content));
