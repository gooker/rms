import React from 'react';
import { Layout } from 'antd';
// import intl from 'react-intl-universal';
import { connect } from '@/utils/dva';
// import { getLanguage } from '@/utils/init';
import LayoutSider from '@/packages/Portal/components/Sider';
import LayoutContent from '@/components/pages/Content/Content';
import LayoutHeader from '@/packages/Portal/components/Header';
import './mainLayout.less';

const { Header } = Layout;

@connect()
class MainLayout extends React.Component {
  state={
    appReady:false,
  }
 async componentDidMount(){
    // 顺序: user menu 国际化
    // 1.获取用户信息
    // 2.menu
    const { dispatch } = this.props;
    await dispatch({ type: 'user/fetchCurrentUser' });
    const initMenu = await dispatch({ type: 'global/fetchInitialAppStatus' });
    if (initMenu) {
      // const locales = {
      //   'en-US': require('@/locales/en-US').default,
      //   'zh-CN': require('@/locales/zh-CN').default,
      // };
      // const currentLocale = getLanguage();
      // intl.init({ currentLocale: currentLocale, locales });
      this.setState({ appReady: true });
    }
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
