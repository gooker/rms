// 所有模块的路由全在此注册
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from '@/utils/dva';
import Detail from '@/components/TaskDetail/Detail';
import Loadable from '@/utils/Loadable';

@connect(({ global }) => ({
  currentApp: global?.currentApp,
  allMenuData: global?.allMenuData,
}))
class Content extends React.PureComponent {
  createRoutesByRequire = () => {
    const result = [];
    //  TODO: 点击的时候 根据code拿到对应的route;
    const { currentApp, allMenuData } = this.props;
    let currentModuleRouter = [];
    currentModuleRouter = allMenuData
      .filter(({ appCode }) => appCode === currentApp)
      .map(({ menu }) => menu);
    currentModuleRouter = currentModuleRouter.length > 0 ? currentModuleRouter[0] : [];
    currentModuleRouter.forEach(({ routes, path, component }) => {
      if (routes) {
        routes.forEach(({ path, component }) => {
          result.push({ path, component });
        });
      } else {
        result.push({ path, component });
      }
    });
    return result;
  };

  render() {
    const routesData = this.createRoutesByRequire();
    return (
      <div id={'layoutContent'} style={{ height: '100%', width: '100%' }}>
        <Switch>
          <Route exact path="/" component={Loadable(() => import('@/packages/Portal/Welcome'))} />

          {routesData.map(({ path, component }) => (
            <Route
              exact
              key={path}
              path={path}
              // TIP: Loadable 参数不支持变量, 只支持字符串或者字符串模板
              component={Loadable(() => import(`@/packages${component}`))}
            />
          ))}

          <Route component={Loadable(() => import('@/packages/Portal/NoFound'))} />
        </Switch>

        <Detail />
      </div>
    );
  }
}
export default Content;
