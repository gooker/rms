import React from 'react';
import ReactDOM from 'react-dom';
import createRcsDva from '@/utils/RmsDva';
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
const DvaProvider = createRcsDva(
  {
    onError(e, dispatch) {
      console.log(e.message);
    },
  },
  models,
);

ReactDOM.render(
  <DvaProvider>
    <App />
  </DvaProvider>,
  document.getElementById('root'),
);
