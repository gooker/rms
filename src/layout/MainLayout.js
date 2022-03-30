import React from 'react';
import { Modal, message, notification } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import HomeLayout from '@/layout/HomeLayout';
import RmsConfirm from '@/components/RmsConfirm';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { AlertCountPolling } from '@/workers/WebWorkerManager';
import SocketClient from '@/entities/SocketClient';
import { AppCode } from '@/config/config';
import notice from '@/utils/notice';
import { loadTexturesForMap } from '@/utils/textures';
import { isNull, isStrictNull, dealResponse, formatMessage, getPlateFormType } from '@/utils/util';
import { fetchAllAgvType, fetchAllTaskTypes } from '@/services/api';
import { getAuthorityInfo, queryUserByToken } from '@/services/SSO';
import { fetchGetProblemDetail } from '@/services/global';
import { handleNameSpace } from '@/utils/init';

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
    const _this = this;
    const { dispatch, history, textureLoaded } = this.props;
    // 挂载push函数
    window.history.$$push = history.push;

    // 首先验证token的有效性
    const token = window.sessionStorage.getItem('token');
    if (isStrictNull(token)) {
      this.logout();
    } else {
      // 刚进入页面需要首先处理namespace数据
      await handleNameSpace(dispatch);

      // 开始初始化应用
      const validateResult = await queryUserByToken();
      if (validateResult && !dealResponse(validateResult)) {
        try {
          const userInfo = await dispatch({ type: 'user/fetchCurrentUser' });
          // 先验证授权
          const granted = await this.validateAuthority();
          if (!granted) {
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
                const showErrorNotification = isNull(sessionValue) ? true : sessionValue === 'true';
                if (!showErrorNotification) return;
                this.showSystemAlert(message);
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
        } catch (error) {
          Modal.error({
            title: formatMessage({ id: 'app.global.initFailed' }),
            content: error.toString(),
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
      // TODO: 这个后续需要用Web Worker的方式处理，防止大批量报错导致页面卡顿
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
    this.props.history.push(`/${AppCode.SSO}/alertCenter`);
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
    return appReady ? <HomeLayout /> : <LoadingSkeleton />;
  }
}
export default MainLayout;
