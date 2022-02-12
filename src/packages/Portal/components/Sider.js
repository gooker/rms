import React from 'react';
import { Layout } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { withRouter } from 'react-router-dom';
import { throttle } from 'lodash';
import { connect } from '@/utils/RmsDva';
import LayoutMenu from '@/components/Menu';
import Logo from '@/../public/images/logoMain.png';

const { Sider } = Layout;

@withRouter
@connect(({ global }) => ({ logo: global?.logo }))
class LayoutSider extends React.PureComponent {
  state = {
    collapsed: false,
  };

  componentDidMount() {
    this.bodySizeObserver = new ResizeObserver(
      throttle((entries) => {
        const { width } = entries[0].contentRect;
        if (width <= 920) {
          this.setState({ collapsed: true });
        }
      }, 500),
    );
    this.bodySizeObserver.observe(document.body);
  }

  componentWillUnmount() {
    this.bodySizeObserver.disconnect();
  }

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    const { collapsed } = this.state;
    const { logo, history } = this.props;
    return (
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div
          className="siderLogo"
          onClick={() => {
            history.push('/welcome');
          }}
        >
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
export default LayoutSider;
