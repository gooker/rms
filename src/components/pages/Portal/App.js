import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import history from '@/history';
import intl from 'react-intl-universal';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/utils/Loadable';
import { connect } from '@/utils/dva';
import { isStrictNull } from '@/utils/utils';
// PortalApp组件负责整个APP的初始化，包括鉴权、菜单、国际化等等
@connect(({ app }) => ({ antdLocale: app.antdLocale }))
class PortalApp extends Component {
  state = {
    initDone: false,
    appReady: false,
  };

  async componentDidMount() {
    // 获取国际化数据
    this.loadLocales();
    const token = window.localStorage.getItem('Authorization');
    if (isStrictNull(token)) {
      history.push('/login');
      return;
    }
  }

  loadLocales() {
    const locales = {
      'en-US': require('@/locales/en-US').default,
      'zh-CN': require('@/locales/zh-CN').default,
    };

    intl.init({ currentLocale: 'zh-CN', locales }).then(() => {
      this.setState({ initDone: true });
    });
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
              {/* 组件 放sider menu content */}
              <MainLayout />
            </Switch>
          </Router>
        </ConfigProvider>
      )
    );
  }
}
export default PortalApp;