import React from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import throttle from 'lodash/throttle';
import { connect } from '@/utils/RcsDva';
import LayoutMenu from '@/components/Menu';
import Logo from '@/../public/images/logoMain.png';

const { Sider } = Layout;

class LayoutSider extends React.PureComponent {
  state = {
    collapsed: false,
  };

  componentDidMount() {
    this.resizeObserver();
  }

  componentWillUnmount() {
    this.bodySizeObserver.disconnect();
  }

  resizeObserver = () => {
    this.bodySizeObserver = new ResizeObserver(
      throttle((entries) => {
        const { width } = entries[0].contentRect;
        if (width <= 920) {
          this.setState({ collapsed: true });
        }
      }, 500),
    );
    this.bodySizeObserver.observe(document.body);
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  render() {
    const { collapsed } = this.state;
    const { logo } = this.props;
    return (
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="siderLogo">
          <img src={logo || Logo} alt={'logo'} />
        </div>
        <LayoutMenu />
        <div
          onClick={this.toggle}
          style={{
            color: 'rgba(255, 255, 255, 0.65)',
            position: 'absolute',
            bottom: 40,
            left: 10,
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
      </Sider>
    );
  }
}
export default connect(({ global }) => ({
  logo: global?.logo,
}))(LayoutSider);
