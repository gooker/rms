import React from 'react';
import { Layout, Modal, message, Skeleton } from 'antd';
import { connect } from '@/utils/dva';
import LayoutSlider from '@/packages/Portal/components/Sider';
import LayoutContent from '@/pages/Content/Content';
import LayoutHeader from '@/packages/Portal/components/Header';
import { dealResponse, formatMessage } from '@/utils/utils';
import { fetchAllTaskTypes } from '@/services/api';
import './mainLayout.less';

const { Header } = Layout;

@connect()
class MainLayout extends React.Component {
  state = {
    appReady: false,
  };

  async componentDidMount() {
    const { dispatch } = this.props;

    try {
      // 1.获取用户信息
      await dispatch({ type: 'user/fetchCurrentUser' });

      // 2.初始化菜单
      await dispatch({ type: 'global/initAppAuthority' });
      this.setState({ appReady: true });
      this.loadAllTaskTypes();
    } catch (error) {
      Modal.error({
        title: formatMessage({ id: 'app.global.initFailed' }),
        content: error.toString(),
        zIndex:2147483649,
        onOk(){
          // 登出
          dispatch({ type: 'user/logout' });
        }
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
          <Header className="site-layout-background" style={{ padding: 0 }}>
            <LayoutHeader />
          </Header>
          <LayoutContent />
        </Layout>
      </Layout>
    ) : (
      <Skeleton active />
    );
  }
}
export default MainLayout;
