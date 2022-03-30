import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { connect } from '@/utils/RmsDva';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/components/Loadable';
import { initI18nInstance } from '@/utils/init';
import { formatMessage } from '@/utils/util';

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
      message.error(formatMessage({ id: 'app.message.initFailed' }, { reason: 'I18N' }));
    }
  }

  render() {
    const { initDone } = this.state;
    const { antdLocale } = this.props;
    return (
      initDone && (
        <ConfigProvider locale={antdLocale}>
          <Router>
            <Switch>
              {/* 登录页面*/}
              <Route
                exact
                path="/login"
                component={Loadable(() => import('@/packages/Portal/Login'))}
              />

              {/* 主页面 */}
              <Route exact={false} path="/" component={MainLayout} />
            </Switch>
          </Router>
        </ConfigProvider>
      )
    );
  }
}
export default App;
