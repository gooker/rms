import React from 'react';
import * as core from 'dva-core';
import { Provider, connect } from 'react-redux';
import createLoading from 'dva-loading';

// https://github.com/dvajs/dva/tree/master/packages/dva-core/src
function getPureProvider(store) {
  // eslint-disable-next-line react/display-name
  return (props) => <Provider store={store}>{props.children}</Provider>;
}

function createRmsDva(opts = {}, models) {
  const app = core.create(opts);
  models.forEach((model) => app.model(model));
  app.use(createLoading());
  app.start();

  window.g_app = app;
  window.__g_state__ = window.g_app._store.getState;

  return getPureProvider(app._store);
}

export { connect };
export default createRmsDva;
