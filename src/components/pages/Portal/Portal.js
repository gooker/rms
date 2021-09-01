import React, { Component } from 'react';
import { ConfigProvider, message } from 'antd';
import history from '@/history';
import intl from 'react-intl-universal';
import MainLayout from '@/layout/MainLayout';
import { connect } from '@/utils/dva';
import { getCurrentUser } from '@/services/api';
import { dealResponse, isStrictNull } from '@/utils/utils';
// Portal组件负责整个APP的初始化，包括鉴权、菜单、国际化等等
@connect(({ app }) => ({ antdLocale: app.antdLocale }))
class Portal extends Component {
  state = {
    initDone: false,
  };

  async componentDidMount() {
    // 获取国际化数据
    this.loadLocales();

    const token = window.localStorage.getItem('Authorization');
    if (isStrictNull(token)) {
      history.push('/login');
      this.setState({ toLogin: true });
      return;
    }

    // 获取用户信息
    const response = await getCurrentUser();
    if (dealResponse(response)) {
      message.error('获取当前用户信息失败');
      return false;
    }
    const { language, currentSection, authorityKeys, userTimeZone } = response;

    // 1. 保存Section
    window.localStorage.setItem('sectionId', currentSection.sectionId);

    // 2. 保存国际化
    window.localStorage.setItem('currentLocale', language);

    // 3. 保存权限数据
    const permissionMap = {};
    for (let index = 0; index < authorityKeys.length; index++) {
      permissionMap[authorityKeys[index]] = authorityKeys[index];
    }
    window.localStorage.setItem('permissionMap', JSON.stringify(permissionMap));

    // 4. 保存用户时区信息
    window.localStorage.setItem('userTimeZone', userTimeZone);

    // 获取菜单数据
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
            <MainLayout/>
        </ConfigProvider>
      )
    );
  }
}
export default Portal;
