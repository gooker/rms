import ReactDOM from 'react-dom';
import dva from '@/utils/dva';
import { HashRouter as Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Portal from '@/components/Portal/Portal';
import appModel from '@/models/app';
import './global.less';

// 1. 初始化Dva对象
const app = dva({
  history: createBrowserHistory(),
});

// 2. 注册插件
// app.use({});

// 3. 注册 Model
app.model(appModel);

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
