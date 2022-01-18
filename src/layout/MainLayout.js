import React from 'react';
import { Layout, Modal, message, Skeleton } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from '@/utils/RcsDva';
import LayoutSlider from '@/packages/Portal/components/Sider';
import LayoutHeader from '@/packages/Portal/components/Header';
import LayoutContent from '@/pages/Content/Content';
import { dealResponse, formatMessage } from '@/utils/utils';
import { fetchAllTaskTypes } from '@/services/api';
import { loadTexturesForMap } from '@/utils/textures';

import './mainLayout.less';
import SocketClient from '@/utils/SocketClient';

@withRouter
@connect(({ global }) => ({
  isInnerFullscreen: global.isInnerFullscreen,
}))
class MainLayout extends React.Component {
  state = {
    appReady: false,
  };

  async componentDidMount() {
    const { dispatch, history } = this.props;
    dispatch({ type: 'global/saveHistory', payload: history });

    try {
      // 1.获取用户信息
      const { currentSection } = await dispatch({ type: 'user/fetchCurrentUser' });

      // 2. 初始化Socket客户端
      const { name, password } = currentSection;
      const socketClient = new SocketClient({ login: name, passcode: password });
      socketClient.connect();
      dispatch({ type: 'global/saveSocketClient', payload: socketClient });

      // 3.初始化菜单
      await dispatch({ type: 'global/initAppAuthority' });

      // 4. 加载地图Texture
      await loadTexturesForMap();
      this.setState({ appReady: true });

      // 5. 获取所有车类任务类型数据
      this.loadAllTaskTypes();
    } catch (error) {
      Modal.error({
        title: formatMessage({ id: 'app.global.initFailed' }),
        content: error.toString(),
        onOk() {
          dispatch({ type: 'user/logout' });
        },
      });
    }
  }

  loadAllTaskTypes = () => {
    const { dispatch } = this.props;
    fetchAllTaskTypes().then((response) => {
      if (!dealResponse(response)) {
        dispatch({ type: 'global/updateAllTaskTypes', payload: response });
      } else {
        message.error(
          `${formatMessage(
            { id: 'app.message.fetchFailTemplate' },
            { type: formatMessage({ id: 'app.task.type' }) },
          )}`,
        );
      }
    });
  };

  render() {
    const { appReady } = this.state;
    const { isInnerFullscreen } = this.props;
    return appReady ? (
      <Layout className="main-layout">
        {!isInnerFullscreen && <LayoutSlider />}
        <Layout className="site-layout">
          {!isInnerFullscreen && <LayoutHeader />}
          <LayoutContent />
        </Layout>
      </Layout>
    ) : (
      <Skeleton active />
    );
  }
}
export default MainLayout;
