// 所有模块的路由全在此注册
import React, { memo } from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from '@/utils/dva';
import Detail from '@/components/TaskDetail/Detail';
import Loadable from '@/utils/Loadable';

const Content = (props) => {
  const { currentApp, allMenuData } = props;

  function createRoutesByRequire() {
    const result = [];
    let currentModuleRouter = allMenuData
      .filter(({ appCode }) => appCode === currentApp)
      .map(({ menu }) => menu);
    currentModuleRouter = currentModuleRouter.length > 0 ? currentModuleRouter[0] : [];
    flatMenuData(currentModuleRouter, result);
    return result;
  }

  function flatMenuData(currentModuleRouter, result) {
    currentModuleRouter.forEach(({ path, component, routes }) => {
      if (Array.isArray(routes)) {
        flatMenuData(routes, result);
      } else {
        result.push({ path, component });
      }
    });
  }

  const routesData = createRoutesByRequire();
  return (
    <div id={'layoutContent'} style={{ height: '100%', width: '100%', overflow: 'auto' }}>
      <Switch>
        <Route exact path="/" component={Loadable(() => import('@/packages/Portal/Welcome'))} />

        {/* 模块页面路由 */}
        {routesData.map(({ path, component }) => (
          <Route
            exact
            key={path}
            path={path}
            component={Loadable(() => import(`@/packages${component}`))}
          />
        ))}

        <Route component={Loadable(() => import('@/packages/Portal/NoFound'))} />
      </Switch>

      {/* 任务详情全局组件 */}
      <Detail />
    </div>
  );
};
export default connect(({ global }) => ({
  currentApp: global?.currentApp,
  allMenuData: global?.allMenuData,
}))(memo(Content));
