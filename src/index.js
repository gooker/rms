import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import dva from '@/utils/dva';
import App from '@/pages/App';
import globalModel from '@/models/global';
import taskModel from '@/models/task';
import userModel from '@/models/user';
import editorModel from '@/models/editor';
import monitorModel from '@/models/monitor';
import simulatorModel from '@/models/simulator';
import taskTriger from '@/packages/XIHE/SourceGroupManage/TaskTrigger/models/taskTriger';
import customTask from '@/packages/XIHE/SourceGroupManage/CustomTask/models/CustomTaskModel';
import history from '@/history';
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
const app = dva({
  onError(e, dispatch) {
    console.log(e.message);
  },
});
window.g_app = app;

// 2. 注册 Model
app.model(taskModel);
app.model(userModel);
app.model(globalModel);
app.model(editorModel);
app.model(monitorModel);
app.model(simulatorModel);
app.model(taskTriger);
app.model(customTask);

// 3. 启动
const DvaProvider = app.create();

ReactDOM.render(
  <DvaProvider>
    <Router history={history}>
      <App />
    </Router>
  </DvaProvider>,
  document.getElementById('root'),
);

if (module.hot) {
  module.hot.accept();
}
