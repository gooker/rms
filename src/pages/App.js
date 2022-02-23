import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { connect } from '@/utils/RmsDva';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/components/Loadable';
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
