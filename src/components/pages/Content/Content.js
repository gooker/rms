// 所有模块的路由全在此注册
import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Detail from '@/components/TaskDetail/Detail';
import Loadable from '@/utils/Loadable';
import allMouduleRouter from '@/config/router';
export default class Content extends React.PureComponent {
  createRoutesByRequire = () => {
    const result = [];
    Object.values(allMouduleRouter).forEach((item) => {
      item.forEach(({ routes, path, component }) => {
        if (routes) {
          routes.forEach(({ path, component }) => {
            result.push({ path, component });
          });
        } else {
          result.push({ path, component });
        }
      });
    });
    return result;
  };

  render() {
    const routesData = this.createRoutesByRequire();
    return (
      <div id={'layoutContent'} style={{ height: '100%', width: '100%' }}>
        <Switch>
          {routesData.map(({ path, component }) => (
            <Route
              exact
              key={path}
              path={path}
              // TIP: Loadable 参数不支持变量, 只支持字符串或者字符串模板
              component={Loadable(() => import(`@/packages${component}`))}
            />
          ))}
           <Route path="/login">登录</Route>
          <Route path="*">404</Route>
          
        </Switch>
        <Detail />
      </div>
    );
  }
}
