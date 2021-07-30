// 所有模块的路由全在此注册
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Detail from '@/components/TaskDetail/Detail';
import Loadable from '@/utils/Loadable';
import { Sorter } from '@/config/router';

export default class Content extends React.PureComponent {
  createRoutesByRequire = () => {
    const result = [];
    Sorter.forEach(({ routes }) => {
      routes.forEach(({ path, component }) => {
        result.push({ path, component });
      });
    });
    return result;
  };

  render() {
    const routesData = this.createRoutesByRequire();
    return (
      <div id={'layoutContent'} style={{ height: '100%', width: '100%' }}>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/sorter/center/executionQueue" />} />
          {routesData.map(({ path, component }) => (
            <Route
              exact
              key={path}
              path={path}
              // TIP: Loadable 参数不支持变量, 只支持字符串或者字符串模板
              component={Loadable(() => import(`@/packages${component}`))}
            />
          ))}
          <Route path="*">404</Route>
        </Switch>
        <Detail />
      </div>
    );
  }
}
