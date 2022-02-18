import React from 'react';
import { Layout, Modal, message, Skeleton, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import LayoutSlider from '@/packages/Portal/components/Sider';
import LayoutHeader from '@/packages/Portal/components/Header';
import LayoutContent from '@/pages/Content/Content';
import { dealResponse, formatMessage, getPlateFormType, isNull } from '@/utils/util';
import { fetchAllAgvType, fetchAllTaskTypes } from '@/services/api';
import { loadTexturesForMap } from '@/utils/textures';
import SocketClient from '@/entities/SocketClient';
import { getAuthorityInfo } from '@/services/SSO';
import './mainLayout.less';

@withRouter
@connect(({ global }) => ({
  textureLoaded: global.textureLoaded,
  isInnerFullscreen: global.isInnerFullscreen,
}))
class MainLayout extends React.Component {
  state = {
    appReady: false,
  };

  async componentDidMount() {
    const { dispatch, history, textureLoaded } = this.props;
    dispatch({ type: 'global/saveHistory', payload: history });

    try {
      const userInfo = await dispatch({ type: 'user/fetchCurrentUser' });
      if (userInfo && !dealResponse(userInfo)) {
        // 1. 先验证授权
        const granted = await this.validateAuthority();
        if (!granted && userInfo.username !== 'admin') {
          dispatch({ type: 'global/clearEnvironments' });
          history.push('/login');
        } else {
          // 判断当前平台类型
          window.currentPlatForm = getPlateFormType();
          if (!window.currentPlatForm.isChrome) {
            Modal.warning({
              title: formatMessage({ id: 'app.message.systemHint' }),
              content: formatMessage({ id: 'app.global.chrome.suggested' }),
            });
          }

          // 2.初始化应用基础信息
          await dispatch({ type: 'global/initPlatformState' });
          const { currentSection, username } = userInfo;

          if (username !== 'admin') {
            // 3. 初始化Socket客户端
            const { name, password } = currentSection;
            const socketClient = new SocketClient({ login: name, passcode: password });
            socketClient.connect();
            dispatch({ type: 'global/saveSocketClient', payload: socketClient });

            // 4. 加载地图Texture
            if (!textureLoaded) {
              await loadTexturesForMap();
              dispatch({ type: 'global/updateTextureLoaded', payload: true });
            }

            // 5. 获取所有车类任务类型数据
            this.loadAllTaskTypes();

            // 6. 货物所有车类型
            this.loadAllAgvTypes();
          }

          this.setState({ appReady: true });
        }
      } else {
        throw new Error(formatMessage({ id: 'app.message.fetchUserFail' }));
      }
    } catch (error) {
      Modal.error({
        title: formatMessage({ id: 'app.global.initFailed' }),
        content: error.toString(),
        onOk() {
          dispatch({ type: 'user/logout', payload: history });
        },
      });
    }
  }

  componentWillUnmount() {
    //TODO: 暂停所有 Web Worker
  }

  async validateAuthority() {
    const { dispatch } = this.props;
    const response = await getAuthorityInfo();
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.authCenter.fetchInfo.failed' }));
      return false;
    } else {
      /**
       * 首先判断是否授权
       * 已授权的话先判断是否过期
       * 已过期的话基于提示
       * 未过期的话: 大于14天小于30天，只要登录提示；小于14天每隔1小时提示
       */
      if (isNull(response)) {
        message.error(formatMessage({ id: 'app.authCenter.unauthorized.message' }));
        return false;
      } else {
        const isExpired = response.lastDay * 1000 <= new Date().valueOf();
        if (isExpired) {
          Modal.error({
            zIndex: 10000000,
            mask: false,
            title: formatMessage({ id: 'app.message.systemHint' }),
            content: formatMessage({ id: 'app.authCenter.expired' }),
            okText: formatMessage({ id: 'app.message.gotIt' }),
          });
        } else {
          // 距离过期的天数
          const daysToExpired = Math.ceil(
            (response.lastDay * 1000 - new Date().valueOf()) / 1000 / 60 / 60 / 24,
          );
          dispatch({ type: 'global/saveSysAuthInfo', payload: daysToExpired });
          if (daysToExpired <= 30) {
            notification['warning']({
              message: formatMessage({ id: 'app.request.systemHint' }),
              description: formatMessage(
                { id: 'app.authCenter.willExpired' },
                { day: daysToExpired },
              ),
              duration: 5,
            });
          }
          return true;
        }
      }
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

  loadAllAgvTypes = () => {
    const { dispatch } = this.props;
    fetchAllAgvType().then((response) => {
      if (!dealResponse(response)) {
        dispatch({ type: 'global/saveAllAgvTypes', payload: response });
      } else {
        message.error(
          `${formatMessage(
            { id: 'app.message.fetchFailTemplate' },
            { type: formatMessage({ id: 'app.agv.type' }) },
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
