import React from 'react';
import { Layout } from 'antd';
// import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { connect } from '@/utils/dva';
import LayoutSider from '@/packages/Portal/components/Sider';
import LayoutContent from '@/components/pages/Content/Content';
import LayoutHeader from '@/packages/Portal/components/Header';
import './mainLayout.less';

const { Header } = Layout;
@connect()
class MainLayout extends React.Component {
  state = {
    collapsed: false,
    appReady: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    // 获取用户信息
    await dispatch({ type: 'user/fetchCurrentUser' });
    const initState = await dispatch({ type: 'global/fetchInitialAppStatus' });
    if (initState) {
      this.setState({ appReady: true });
    }

    window.parent.postMessage({ type: 'appReady', payload: 'Sorter-WCS-GUI' }, '*');
  }

  render() {
    const { collapsed, appReady } = this.state;
    return (
      appReady && (
        <Layout className="main-layout">
          <LayoutSider collapsed={collapsed} />
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
