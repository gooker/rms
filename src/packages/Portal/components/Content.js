import React, { memo, useEffect } from 'react';
import { Tabs } from 'antd';
import { Route, useHistory } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import { formatMessage, isStrictNull } from '@/utils/util';
import Detail from '@/components/TaskDetail/Detail';
import style from '@/layout/homeLayout.module.less';
import { AppCode } from '@/config/config';

const { TabPane } = Tabs;

const Content = (props) => {
  const { dispatch, tabs, activeTab, currentApp, routeLocaleKeyMap } = props;
  const history = useHistory();

  useEffect(() => {
    if (!isStrictNull(activeTab)) {
      history.push(activeTab);
      if (activeTab === '/') {
        dispatch({ type: 'global/saveCurrentApp', payload: AppCode.XIHE });
        // dispatch({
        //   type: 'menu/saveState',
        //   payload: { openKeys: [], selectedKeys: [] },
        // });
      } else {
        const _currentApp = activeTab.split('/')[1];
        // 如果是切换了APP，那么Menu会主动更新openKeys；如果不是切换APP只是单纯在某个APP级别切换Tab，那就需要手动触发更新openKeys
        if (currentApp !== _currentApp) {
          dispatch({ type: 'global/saveCurrentApp', payload: _currentApp });
        } else {
          dispatch({ type: 'menu/forceUpdateOpenKeys' });
          dispatch({ type: 'menu/saveSelectedKeys', payload: [activeTab] });
        }
      }
    }
  }, [activeTab]);

  function onChange(menuKey) {
    dispatch({ type: 'menu/saveActiveTab', payload: menuKey });
  }

  function onRemove(menuKey) {
    dispatch({ type: 'menu/removeTab', payload: menuKey });
  }

  return (
    <div id={'layoutContent'} className={style.layoutContent}>
      <Tabs
        hideAdd
        type="editable-card"
        tabBarStyle={{ background: '#fff' }}
        activeKey={activeTab}
        onChange={onChange}
        onEdit={onRemove}
        // renderTabBar={() => <span style={{ position: 'absolute' }}>111</span>}
      >
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
export default connect(({ global, menu }) => ({
  currentApp: global.currentApp,
  tabs: menu.tabs,
  activeTab: menu.activeTab,
  routeLocaleKeyMap: menu.routeLocaleKeyMap,
}))(memo(Content));
