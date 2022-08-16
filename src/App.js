import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ConfigProvider, message, Modal } from 'antd';
import { connect } from '@/utils/RmsDva';
import MainLayout from '@/layout/MainLayout';
import Loadable from '@/components/Loadable';
import requestAPI from '@/utils/requestAPI';
import { initI18NWithoutRemote } from '@/utils/init';
import { openDB, selectAllDB } from '@/utils/IndexDBUtil';
import { extractNameSpaceInfoFromEnvs, formatMessage, getPlateFormType, isNull } from '@/utils/util';

@connect(({ global }) => ({ antdLocale: global.antdLocale }))
class App extends Component {
  state = {
    initDone: false,
  };

  async componentDidMount() {
    try {
      window.dbContext = await openDB();
      const defaultAPI = requestAPI();
      const customEnvironments = await selectAllDB(window.dbContext);
      const activeAPI = customEnvironments.filter((item) => item.active)[0];
      window.nameSpacesInfo = isNull(activeAPI)
        ? defaultAPI
        : extractNameSpaceInfoFromEnvs(activeAPI);
      await initI18NWithoutRemote();

      // 判断当前平台类型
      window.currentPlatForm = getPlateFormType();
      if (!window.currentPlatForm.isChrome) {
        Modal.warning({
          title: formatMessage({ id: 'app.message.systemHint' }),
          content: formatMessage({ id: 'app.global.chrome.suggested' }),
        });
      }

      this.setState({ initDone: true });
    } catch (e) {
      console.log(e);
      message.error(formatMessage({ id: 'app.message.initFailed' }, { reason: 'I18N' }));
    }
  }

  componentWillUnmount() {
    window.dbContext.close();
    window.dbContext = null;
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
