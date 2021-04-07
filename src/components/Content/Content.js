// 所有模块的路由全在此注册
import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import PageRouteData from '@/config/router';

export default class Content extends React.PureComponent {
  createRoutesByRequire = () => {
    const result = [];
    PageRouteData.forEach(({ routes }) => {
      routes.forEach(({ path, component }) => {
        result.push({ path, component });
      });
    });
    return result;
  };

  render() {
    const routesData = this.createRoutesByRequire();
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/sorter/center/executionQueue" />} />
        {routesData.map(({ path, component }) => (
          <Route key={path} exact path={path} component={component} />
        ))}
        <Route path="*">404</Route>
      </Switch>
    );
  }
}
