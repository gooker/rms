import ReactDOM from 'react-dom';
import dva from '@/utils/Dva';
import { HashRouter as Router } from 'react-router-dom';
import Portal from '@/components/pages/Portal/Portal';
import appModel from '@/models/app';
import taskModel from '@/models/task';
import './global.less';

// 1. 初始化Dva对象
const app = dva();
window.g_app = app;

// 2. 注册插件
// app.use({});

// 3. 注册 Model
app.model(appModel);
app.model(taskModel);

// 4. 启动
const DvaProvider = app.create();

ReactDOM.render(
  <DvaProvider>
    <Router basename="/">
      <Portal />
    </Router>
  </DvaProvider>,
  document.getElementById('root'),
);
