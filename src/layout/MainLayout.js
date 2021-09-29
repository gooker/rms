import React from 'react';
import { Layout,Skeleton } from 'antd';
import { connect } from '@/utils/dva';
import { initI18nInstance } from '@/utils/init';
import LayoutSider from '@/packages/Portal/components/Sider';
import LayoutContent from '@/components/pages/Content/Content';
import LayoutHeader from '@/packages/Portal/components/Header';
import './mainLayout.less';
import { isNull } from '@/utils/utils';

const { Header } = Layout;

@connect()
class MainLayout extends React.Component {
  state = {
    appReady: false,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    // 1.获取用户信息
    const userAvailable = await dispatch({ type: 'user/fetchCurrentUser' });
    if (isNull(userAvailable)) return;

    // 2.menu
    const authInitial = await dispatch({ type: 'global/initAppAuthority' });
    if (isNull(authInitial)) return;

    // 3.国际化 远程
    await initI18nInstance();
    this.setState({ appReady: true });
  }

  render() {
    const { appReady } = this.state;
    return appReady ? (
      <Layout className="main-layout">
        <LayoutSider />
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
