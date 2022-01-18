import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/utils/Loadable';
import { connect } from '@/utils/RcsDva';
import { initI18nInstance } from '@/utils/init';

@connect(({ global }) => ({ antdLocale: global.antdLocale }))
class App extends Component {
  state = {
    initDone: false,
  };

  async componentDidMount() {
    try {
      // 国际化必须在系统任何内容展示前完成初始化
      await initI18nInstance();
      this.setState({ initDone: true });
    } catch (e) {
      console.log('初始化失败: 国际化');
    }
  }

  render() {
    const { initDone } = this.state;
    const { antdLocale } = this.props;
    return (
      initDone && (
        <ConfigProvider locale={antdLocale} input={{ autoComplete: 'off' }}>
          <Switch>
            {/* 登录页面*/}
            <Route
              exact
              path="/login"
              component={Loadable(() => import('@/packages/Portal/Login'))}
            />
            {/* 主页面 */}
            <MainLayout />
          </Switch>
        </ConfigProvider>
      )
    );
  }
}
export default App;
