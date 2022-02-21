import React from 'react';
import { Layout, Modal, message, Skeleton, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import LayoutSlider from '@/packages/Portal/components/Sider';
import LayoutHeader from '@/packages/Portal/components/Header';
import LayoutContent from '@/pages/Content/Content';
import RmsConfirm from '@/components/RmsConfirm';
import { AlertCountPolling } from '@/workers/WebWorkerManager';
import { dealResponse, formatMessage, getPlateFormType, isNull } from '@/utils/util';
import { fetchAllAgvType, fetchAllTaskTypes } from '@/services/api';
import { loadTexturesForMap } from '@/utils/textures';
import SocketClient from '@/entities/SocketClient';
import { getAuthorityInfo } from '@/services/SSO';
import { fetchGetProblemDetail } from '@/services/global';
import notice from '@/utils/notice';
import './mainLayout.less';

@withRouter
@connect(({ global }) => ({
  textureLoaded: global.textureLoaded,
  isInnerFullscreen: global.isInnerFullscreen,
}))
class MainLayout extends React.Component {
  notificationQueue = [];

  state = {
    appReady: false,
  };

  async componentDidMount() {
    const _this = this;
    const { dispatch, history, textureLoaded } = this.props;
    dispatch({ type: 'global/saveHistory', payload: history });

    try {
      const userInfo = await dispatch({ type: 'user/fetchCurrentUser' });
      if (userInfo && !dealResponse(userInfo)) {
        // 先验证授权
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

          // 初始化应用基础信息
          await dispatch({ type: 'global/initPlatformState' });
          const { currentSection, username } = userInfo;

          if (username !== 'admin') {
            // 初始化Socket客户端
            const { name, password } = currentSection;
            const socketClient = new SocketClient({ login: name, passcode: password });
            socketClient.connect();
            socketClient.registerNotificationQuestion((message) => {
              // 如果关闭提示，就直接不拉取接口
              const sessionValue = window.sessionStorage.getItem('showErrorNotification');
              const showErrorNotification = sessionValue === null ? true : JSON.parse(sessionValue);
              if (!showErrorNotification) return;
              this.showSystemProblem(message);
            });
            await dispatch({ type: 'global/saveSocketClient', payload: socketClient });

            // 立即获取一次告警数量
            dispatch({ type: 'global/fetchAlertCount' }).then((response) => {
              if (response > 0) {
                RmsConfirm({
                  content: formatMessage({ id: 'app.alertCenter.requestHandle' }, { response }),
                  okText: formatMessage({ id: 'app.alertCenter.goHandle' }),
                  cancelText: formatMessage({ id: 'app.button.cancel' }),
                  onOk() {
                    _this.goToQuestionCenter();
                  },
                });
              }
            });

            // 加载地图Texture
            if (!textureLoaded) {
              await loadTexturesForMap();
              await dispatch({ type: 'global/updateTextureLoaded', payload: true });
            }

            // 获取所有车类任务类型数据
            this.loadAllTaskTypes();

            // 获取所有车类型
            this.loadAllAgvTypes();

            // 轮询告警数量
            AlertCountPolling.start((value) => {
              dispatch({ type: 'global/updateAlertCount', payload: value });
            });
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
    // 关闭所有 Web Worker
    AlertCountPolling.terminate();
  }

  showSystemProblem = async (message) => {
    const { currentSection } = this.props;
    const { errorCountNumber, hasNewError, alertCenter } = message;
    if (hasNewError) {
      const response = await fetchGetProblemDetail(alertCenter.id);
      if (dealResponse(response)) {
        notice(message, currentSection.sectionId, this.notificationQueue);
      } else {
        const newMessage = {
          errorCountNumber,
          hasNewError,
          problemHandling: response,
        };
        notice(newMessage, currentSection.sectionId, this.notificationQueue);
      }
    }
  };

  goToQuestionCenter = () => {
    //
  };

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
