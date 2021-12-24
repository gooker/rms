import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import history from '@/history';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/utils/Loadable';
import { connect } from '@/utils/dva';
import { initI18nInstance } from '@/utils/init';

@connect(({ global }) => ({ antdLocale: global.antdLocale }))
class App extends Component {
  state = {
    initDone: false,
  };

  async componentDidMount() {
    try {
      await initI18nInstance();
      this.setState({ initDone: true });
    } catch (e) {
      console.log('初始化失败');
    }
  }

  render() {
    const { initDone } = this.state;
    const { antdLocale } = this.props;
    return (
      initDone && (
        <ConfigProvider locale={antdLocale}>
          <Router history={history}>
            <Switch>
              <Route
                exact
                path="/login"
                component={Loadable(() => import('@/packages/Portal/Login'))}
              />
              <MainLayout />
            </Switch>
          </Router>
        </ConfigProvider>
      )
    );
  }
}
export default App;
