import React, { Component } from 'react';
import { ConfigProvider } from 'antd';
import intl from 'react-intl-universal';
import MainLayout from '@/layout/MainLayout';
import { connect } from '@/utils/Dva';

// Portal组件负责整个APP的初始化，包括鉴权、菜单、国际化等等
@connect(({ app }) => ({ antdLocale: app.antdLocale }))
class Portal extends Component {
  state = {
    initDone: false,
  };

  componentDidMount() {
    // 获取用户信息
    // 获取菜单数据
    // 获取国际化数据
    this.loadLocales();
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
          <MainLayout />
        </ConfigProvider>
      )
    );
  }
}
export default Portal;
