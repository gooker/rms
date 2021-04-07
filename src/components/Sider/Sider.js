import React from 'react';
import { Layout } from 'antd';
import LayoutMenu from '@/components/Menu';

const { Sider } = Layout;

export default class LayoutSider extends React.PureComponent {
  render() {
    const { collapsed } = this.props;
    return (
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo" />
        <LayoutMenu />
      </Sider>
    );
  }
}
