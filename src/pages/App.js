import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ConfigProvider, message } from 'antd';
import { isEmpty } from 'lodash';
import { connect } from '@/utils/RmsDva';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/components/Loadable';
import { initI18nInstance } from '@/utils/init';
import { extractNameSpaceInfoFromEnvs, formatMessage, getCustomEnvironments } from '@/utils/util';
import requestAPI from '@/utils/requestAPI';

@connect(({ global }) => ({ antdLocale: global.antdLocale }))
class App extends Component {
  state = {
    initDone: false,
  };

  async componentDidMount() {
    if (!window.$$isProduction) {
      window.localStorage.setItem('dev', 'true');
    }

    try {
      const defaultAPI = requestAPI();
      const customEnvironments = getCustomEnvironments();
      const activeAPI = customEnvironments.filter((item) => item.flag === '1');
      window.nameSpacesInfo = isEmpty(activeAPI)
        ? defaultAPI
        : extractNameSpaceInfoFromEnvs(activeAPI[0]);

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
