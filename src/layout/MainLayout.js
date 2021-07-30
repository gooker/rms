import React from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import LayoutSider from '@/packages/Portal/components/Sider';
import LayoutContent from '@/components/pages/Content/Content';
import './mainLayout.less';

const { Header } = Layout;

class MainLayout extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  componentDidMount(){
   window.parent.postMessage({ type:'appReady', payload:'Sorter-WCS-GUI' }, '*');
  }

  render() {
    const { collapsed } = this.state;
    //   不从Iframe加载
    if (window.self === window.parent) {
      return (
        <Layout className="main-layout">
          <LayoutSider collapsed={collapsed} />
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: this.toggle,
              })}
            </Header>
            <LayoutContent />
          </Layout>
        </Layout>
      );
    }
    return <LayoutContent />;
  }
}
export default MainLayout;