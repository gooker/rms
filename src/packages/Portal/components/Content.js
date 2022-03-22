import React, { memo, useEffect } from 'react';
import { Tabs } from 'antd';
import { Route, useHistory } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import { formatMessage, isStrictNull } from '@/utils/util';
import Detail from '@/components/TaskDetail/Detail';
import { AppCode } from '@/config/config';
import TabsBar from '@/components/TabsBar';
import style from '@/layout/homeLayout.module.less';

const { TabPane } = Tabs;

const Content = (props) => {
  const { dispatch, tabs, activeTab, grantedAPP, currentApp, routeLocaleKeyMap, currentUser } =
    props;
  const history = useHistory();

  useEffect(() => {
    if (!isStrictNull(activeTab)) {
      history.push(activeTab);
      if (activeTab === '/') {
        dispatch({
          type: 'global/saveCurrentApp',
          payload: currentUser.username === 'admin' ? AppCode.SSO : currentApp ?? grantedAPP[0],
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
    if (props.panes.length <= 1) {
      return null;
    }
    return <TabsBar tabInfo={tabInfo} />;
  }

  return (
    <div id={'layoutContent'} className={style.layoutContent}>
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

      {/* 任务详情全局组件 */}
      <Detail />
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
