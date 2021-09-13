import ReactDOM from 'react-dom';
import dva from '@/utils/dva';
import App from '@/components/pages/Portal/App';
import globalModel from '@/models/global';
import taskModel from '@/models/task';
import userModel from '@/models/user';
import './global.less';

// 全局错误处理(尝试版)
// window.onerror = function (message, source, lineno, colno, error) {
//   console.log('捕获到[onError]异常：', { message, source, lineno, colno, error });
// };

// window.addEventListener('error', (error) => {
//   console.log('捕获到[Error]异常：', error);
// });

// window.addEventListener('unhandledrejection', (error) => {
//   console.log('捕获到[unhandledrejection]异常：', error);
// });

// 1. 初始化Dva对象
const app = dva();
window.g_app = app;

// 2. 注册插件
// app.use({});

// 3. 注册 Model
app.model(taskModel);
app.model(userModel);
app.model(globalModel);

// 4. 启动
const DvaProvider = app.create();

//   不从Iframe加载
ReactDOM.render(
  <DvaProvider>
    <App />
  </DvaProvider>,
  document.getElementById('root'),
);
