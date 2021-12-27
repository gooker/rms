import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import {
  ApiOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

import { connect } from '@/utils/dva';
import styles from '../Head.module.less';

@connect(({ global, user }) => ({
  currentUser: user.currentUser,
  userRoleList: user.userRoleList,
}))
class UserCenter extends PureComponent {
  render() {
    const { currentUser, userRoleList, showLabel, onMenuClick } = this.props;
    const menu = (
      <Menu selectedKeys={[]} onClick={onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
        </Menu.Item>
        <Menu.SubMenu
          title={
            <span>
              <UnorderedListOutlined />
              <FormattedMessage id="menu.account.roleList" />
            </span>
          }
        >
          {userRoleList.map((record) => (
            <Menu.Item key={record.code}>{record.label}</Menu.Item>
          ))}
        </Menu.SubMenu>
        <Menu.Item key="apiList">
          <ApiOutlined />
          <FormattedMessage id="menu.account.apiList" />
        </Menu.Item>
      </Menu>
    );
    return (
      <Dropdown overlay={menu}>
        <span className={`${styles.action} ${styles.account}`}>
          <UserOutlined style={{ marginRight: 4 }} />
          {showLabel && <span className={styles.name}>{currentUser.username}</span>}
        </span>
      </Dropdown>
    );
  }
}

export default UserCenter;
