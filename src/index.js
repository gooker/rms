import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import createRcsDva from '@/utils/RcsDva';
import App from '@/pages/App';
import models from '@/models';
import './global.less';

// 全局错误处理(尝试版)
// window.onerror = function (message, source, lineno, colno, error) {
//   console.log('捕获到[onError]异常：', { message, source, lineno, colno, error });
// };
//
// window.addEventListener('error', (error) => {
//   console.log('捕获到[Error]异常：', error);
// });
//
// window.addEventListener('unhandledrejection', (error) => {
//   console.log('捕获到[unhandledrejection]异常：', error);
// });

// 1. 初始化Dva对象(包含dva层统一错误处理)
const app = createRcsDva({
  onError(e, dispatch) {
    console.log(e.message);
  },
});
window.g_app = app;
window.__g_state__ = window.g_app._store.getState;

// 2. 注册 Model
models.forEach((model) => app.model(model));

// 3. 启动
const DvaProvider = app.create();

ReactDOM.render(
  <DvaProvider>
    <Router>
      <App />
    </Router>
  </DvaProvider>,
  document.getElementById('root'),
);
