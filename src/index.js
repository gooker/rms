import ReactDOM from 'react-dom';
import dva from '@/utils/dva';
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

//   不从Iframe加载
if (window.self === window.parent) {
  ReactDOM.render(
    <DvaProvider>
      <Router basename="/">
        <Portal />
      </Router>
    </DvaProvider>,
    document.getElementById('root'),
  );
} else {
  window.addEventListener('message', (event) => {
    if (window.location.origin !== event.data.origin) {
      if (event.data.type === 'init') {
        const {
          token,
          nameSpacesInfo,
          grantedAPP,
          language,
          locales,
          sectionId,
        } = event.data;
        window.localStorage.setItem('language', language);
        window.localStorage.setItem('sectionId', sectionId);
        window.localStorage.setItem('Authorization', token);
        window.localStorage.setItem('grantedAPP', JSON.stringify(grantedAPP));
        window.localStorage.setItem('nameSpacesInfo', JSON.stringify(nameSpacesInfo));
        const localLocales = JSON.parse(locales);
        ReactDOM.render(
          <DvaProvider>
            <Router basename="/">
              <Portal />
            </Router>
          </DvaProvider>,
          document.getElementById('root'),
        );
      }
     
    }
  });
}
