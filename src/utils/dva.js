// 基于 dva-core 封装 dva 模块
import { Provider } from 'react-redux';
import * as core from 'dva-core';

function getPureProvider(store) {
  return (props) => <Provider store={store}>{props.children}</Provider>;
}

export default (opts = {}) => {
  const app = core.create(opts);
  const oldAppStart = app.start;

  if (!app._store) {
    oldAppStart.call(app);
  }

  app.create = () => getPureProvider(app._store);
  return app;
};

export const connect = require('react-redux').connect;
