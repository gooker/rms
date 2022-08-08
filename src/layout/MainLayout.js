import React from 'react';
import { message, Modal, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import HomeLayout from '@/layout/HomeLayout';
import RmsConfirm from '@/components/RmsConfirm';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { AlertCountPolling } from '@/workers/WebWorkerManager';
import SocketClient from '@/entities/SocketClient';
import { AppCode } from '@/config/config';
import notice from '@/utils/notice';
import { fetchGlobalExtraData, initI18n } from '@/utils/init';
import { loadTexturesForMap } from '@/utils/textures';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import { getAuthorityInfo, queryUserByToken } from '@/services/SSOService';
import { fetchGetProblemDetail } from '@/services/commonService';

@withRouter
@connect(({ global, user }) => ({
  textureLoaded: global.textureLoaded,
  currentUser: user.currentUser,
  currentSection: user.currentSection,
}))
class MainLayout extends React.Component {
  notificationQueue = [];

  state = {
    appReady: false,
  };

  async componentDidMount() {
    if (!window.isProductionEnv) {
      window.localStorage.setItem('dev', 'true');
    }

    const _this = this;
    const { dispatch, history, textureLoaded } = this.props;
    // 挂载push函数
    window.RMS.push = history.push;

    // 首先验证token的有效性
    const token = window.sessionStorage.getItem('token');
    if (isStrictNull(token)) {
      this.logout();
    } else {
      // 开始初始化应用
      const validateResult = await queryUserByToken();
      if (validateResult && !dealResponse(validateResult)) {
        try {
          const userInfo = await dispatch({ type: 'user/fetchCurrentUser' });
          if (isNull(userInfo)) {
            throw new Error(formatMessage({ id: 'app.section.not.exist' }));
          }
          const { username, language } = userInfo;

          // 初始化国际化信息
          await initI18n(language);

          // 先验证授权
          // const granted = await this.validateAuthority();
          const granted = true;
          if (!granted) {
            history.push('/login');
          } else {
            // 初始化应用基础信息
            await dispatch({ type: 'global/initPlatformState' });

            // 初始化页面长链接、告警相关功能
            if (username !== 'admin') {
              // 初始化Socket客户端
              // this.socketClient = new SocketClient();
              this.socketClient = new SocketClient({ login: 'user1', passcode: 123456 });

              this.socketClient.connect();
              this.socketClient.registerNotificationQuestion((message) => {
                // 如果关闭提示，就直接不拉取接口
                const sessionValue = window.sessionStorage.getItem('showErrorNotification');
                const showErrorNotification = isNull(sessionValue) ? true : sessionValue === 'true';
                if (!showErrorNotification) return;
                this.showSystemAlert(message);
              });
              await dispatch({ type: 'global/saveSocketClient', payload: this.socketClient });

              // 立即获取一次告警数量
              dispatch({ type: 'global/fetchAlertCount' }).then((response) => {
                if (response > 0) {
                  RmsConfirm({
                    content: formatMessage({ id: 'app.alarmCenter.requestHandle' }, { response }),
                    okText: formatMessage({ id: 'app.alarmCenter.goHandle' }),
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
                dispatch({ type: 'global/updateTextureLoaded', payload: true });
              }

              // 获取一些非立即需要的系统数据
              requestAnimationFrame(fetchGlobalExtraData);

              // FIXME:轮询告警数量(这个会引发一个问题: connect/mapStateToProps/selections)
              AlertCountPolling.start((value) => {
                dispatch({ type: 'global/updateAlertCount', payload: value });
              });
            }
            this.setState({ appReady: true });
          }
        } catch (error) {
          Modal.error({
            title: formatMessage({ id: 'app.global.initFailed' }),
            content: error.message,
            onOk() {
              dispatch({ type: 'user/logout' });
            },
          });
        }
      } else {
        this.logout();
      }
    }
  }

  componentWillUnmount() {
    // 关闭所有 Web Worker
    AlertCountPolling.terminate();

    try {
      this.socketClient?.disconnect();
    } catch (e) {
      console.warn(`[Socket Disconnect Error] -> You can ignore this error: ${e.message}`);
    }
  }

  logout = () => {
    const { history } = this.props;
    window.localStorage.clear();
    window.sessionStorage.clear();
    history.push('/login');
  };

  showSystemAlert = async (message) => {
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
    this.props.history.push(`/${AppCode.DevOps}/alertCenter`);
  };

  validateAuthority = async () => {
    const {
      dispatch,
      currentUser: { adminType },
    } = this.props;
    const response = await getAuthorityInfo();
    if (dealResponse(response, null, formatMessage({ id: 'app.authCenter.fetchInfo.failed' }))) {
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
        dispatch({ type: 'global/clearEnvironments' });
        return ['SUPERMANAGER', 'ADMIN'].includes(adminType);
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
  };

  render() {
    const { appReady } = this.state;
    return appReady ? <HomeLayout /> : <LoadingSkeleton />;
  }
}
export default MainLayout;
