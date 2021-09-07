import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import history from '@/history';
import intl from 'react-intl-universal';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/utils/Loadable';
import { connect } from '@/utils/dva';
import { isStrictNull } from '@/utils/utils';
import { getLanguage } from '@/utils/init';

// PortalApp组件负责整个APP的初始化，包括鉴权、菜单、国际化等等
@connect(({ global }) => ({ antdLocale: global.antdLocale }))
class PortalApp extends Component {
  state = {
    initDone: false,
  };

  async componentDidMount() {
    this.loadLocales();
    // 获取国际化数据
    const token = window.localStorage.getItem('Authorization');
    if (isStrictNull(token)) {
      history.push('/login');
      return;
    }
  }

  loadLocales() {
    // TODO: 获取国际化语言 参数加一个: 当前需要的语种;
    // 接口请求失败 国际化使用本地的
    const currentLocale = getLanguage();
    const locales = {
      'en-US': require('@/locales/en-US').default,
      'zh-CN': require('@/locales/zh-CN').default,
    };
    intl.init({ currentLocale: currentLocale, locales }).then(() => {
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
