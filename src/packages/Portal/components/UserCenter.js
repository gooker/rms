import React, { memo } from 'react';
import { Menu, Dropdown } from 'antd';
import { useHistory } from 'react-router-dom';
import {
  ApiOutlined,
  LogoutOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/dva';
import styles from './Header.module.less';

const UserCenter = (props) => {
  const { dispatch, currentUser, userRoleList, showLabel } = props;
  const history = useHistory();

  function handleUserMenuClick({ key }) {
    if (key === 'logout') {
      // 只有在手动退出的情况下才清空 global/environments 对象
      dispatch({ type: 'global/clearEnvironments' });
      dispatch({ type: 'user/logout', payload: history });
    }
    if (key === 'apiList') {
      this.setState({ apiListShow: true });
    }
  }

  const menu = (
    <Menu selectedKeys={[]} onClick={handleUserMenuClick}>
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
      <span className={styles.action}>
        <UserOutlined style={{ marginRight: 4 }} />
        {showLabel && <span className={styles.name}>{currentUser.username}</span>}
      </span>
    </Dropdown>
  );
};
export default connect(({ global, user }) => ({
  currentUser: user.currentUser,
  userRoleList: user.userRoleList,
}))(memo(UserCenter));
