import React, { memo, useState } from 'react';
import { Menu, Dropdown, Modal } from 'antd';
import { useHistory } from 'react-router-dom';
import { ApiOutlined, LogoutOutlined, TeamOutlined, UserOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import AppConfigPanel from '@/packages/Portal/components/AppConfigPanel';
import styles from './Header.module.less';

const UserCenter = (props) => {
  const { dispatch, currentUser, userRoleList } = props;
  const history = useHistory();

  const [apiListVisible, setApiListVisible] = useState(false);

  function handleUserMenuClick({ key }) {
    if (key === 'logout') {
      // 只有在手动退出的情况下才清空 global/environments 对象
      dispatch({ type: 'global/clearEnvironments' });
      dispatch({ type: 'user/logout', payload: history });
    }
    if (key === 'apiList') {
      setApiListVisible(true);
    }
  }

  const menu = (
    <Menu selectedKeys={[]} onClick={handleUserMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined /> <FormattedMessage id="menu.account.logout" defaultMessage="logout" />
      </Menu.Item>
      <Menu.SubMenu
        key={'roleList'}
        title={
          <>
            <TeamOutlined /> <FormattedMessage id="menu.account.roleList" />
          </>
        }
      >
        {userRoleList.map((record) => (
          <Menu.Item key={record.code}>{record.label}</Menu.Item>
        ))}
      </Menu.SubMenu>
      <Menu.Item key="apiList">
        <ApiOutlined /> <FormattedMessage id="menu.account.apiList" />
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key={'loginName'}>
        <UserOutlined /> {currentUser.username}
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Dropdown overlay={menu}>
        <span className={styles.action}>
          <UserOutlined />
        </span>
      </Dropdown>

      {/* API列表展示窗口 */}
      <Modal
        width={960}
        footer={null}
        closable={false}
        visible={apiListVisible}
        onCancel={() => {
          setApiListVisible(false);
        }}
      >
        <AppConfigPanel />
      </Modal>
    </>
  );
};
export default connect(({ global, user }) => ({
  currentUser: user.currentUser,
  userRoleList: user.userRoleList,
}))(memo(UserCenter));
