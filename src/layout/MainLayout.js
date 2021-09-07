import React from 'react';
import { Layout } from 'antd';
import { connect } from '@/utils/dva';
import { initI18nInstance } from '@/utils/init';
import LayoutSider from '@/packages/Portal/components/Sider';
import LayoutContent from '@/components/pages/Content/Content';
import LayoutHeader from '@/packages/Portal/components/Header';
import './mainLayout.less';

const { Header } = Layout;

@connect()
class MainLayout extends React.Component {
  state = {
    appReady: false,
  };
  async componentDidMount() {
    // 顺序: user menu 国际化

    const { dispatch } = this.props;
    // 1.获取用户信息
    await dispatch({ type: 'user/fetchCurrentUser' });
    // 2.menu
    await dispatch({ type: 'global/fetchInitialAppStatus' });
    // 3.国际化 远程
    await initI18nInstance();
    this.setState({ appReady: true });
  }
  render() {
    const { appReady } = this.state;
    return (
      appReady && (
        <Layout className="main-layout">
          <LayoutSider />
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              <LayoutHeader />
            </Header>
            <LayoutContent />
          </Layout>
        </Layout>
      )
    );
  }
}
export default MainLayout;
