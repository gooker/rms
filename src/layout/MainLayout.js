import React from 'react';
import { Layout, Modal, message, Skeleton } from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from '@/utils/dva';
import LayoutSlider from '@/packages/Portal/components/Sider';
import LayoutHeader from '@/packages/Portal/components/Header';
import LayoutContent from '@/pages/Content/Content';
import { dealResponse, formatMessage } from '@/utils/utils';
import { fetchAllTaskTypes } from '@/services/api';
import { loadTexturesForMap } from '@/utils/textures';

import './mainLayout.less';

@withRouter
@connect()
class MainLayout extends React.Component {
  state = {
    appReady: false,
  };

  async componentDidMount() {
    const { dispatch, history } = this.props;
    dispatch({ type: 'global/saveHistory', payload: history });

    try {
      // 1.获取用户信息
      await dispatch({ type: 'user/fetchCurrentUser' });

      // 2.初始化菜单
      await dispatch({ type: 'global/initAppAuthority' });
      this.setState({ appReady: true });

      // 3. 获取所有车类任务类型数据
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
    return appReady ? (
      <Layout className="main-layout">
        <LayoutSlider />
        <Layout className="site-layout">
          <LayoutHeader />
          <LayoutContent />
        </Layout>
      </Layout>
    ) : (
      <Skeleton active />
    );
  }
}
export default MainLayout;
