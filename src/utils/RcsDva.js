// 基于 dva-core 封装 dva 模块
import React from 'react';
import * as core from 'dva-core';
import { Provider } from 'react-redux';
import createLoading from 'dva-loading';

// https://github.com/dvajs/dva/tree/master/packages/dva-core/src
function getPureProvider(store) {
  // eslint-disable-next-line react/display-name
  return (props) => <Provider store={store}>{props.children}</Provider>;
}

function createRcsDva(opts = {}) {
  const app = core.create(opts);
  const oldAppStart = app.start;

  if (!app._store) {
    oldAppStart.call(app);
  }

  app.create = () => getPureProvider(app._store);
  app.use(createLoading());
  return app;
}

export default createRcsDva;
export { connect } from 'react-redux';
