import ReactDOM from 'react-dom';
import dva from 'dva';
import createHistory from 'history/createBrowserHistory';
import './global.less';

// 1. Initialize
const app = dva({
  history: createHistory(),
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/app').default);

// 4. Router
app.router(require('./utils/router').default);

// 5. Start
const App = app.start();

ReactDOM.render(<App />, document.getElementById('root'));
