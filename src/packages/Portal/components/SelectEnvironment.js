import React, { PureComponent } from 'react';
import { Dropdown, Menu } from 'antd';
import { IeOutlined } from '@ant-design/icons';
import { getAllEnvironments, getCustomEnvironments } from '@/utils/util';
import styles from './Header.module.less';

class SelectUrl extends PureComponent {
  changeEnvironment = ({ key }) => {
    const customEnvs = getCustomEnvironments().map((item) => ({
      ...item,
      flag: item.id === key ? '1' : '0',
    }));
    window.localStorage.setItem('customEnvs', JSON.stringify(customEnvs));
    window.sessionStorage.removeItem('nameSpacesInfo');
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  renderMenus = (environments) => {
    const data = [];
    for (const environment of environments) {
      data.push(<Menu.Item key={environment.id}>{environment.envName}</Menu.Item>);
    }
    return data;
  };

  render() {
    const { allEnvs, activeEnv } = getAllEnvironments();
    const envMenu = (
      <Menu
        selectedKeys={[activeEnv]}
        onClick={(key) => {
          this.changeEnvironment(key);
        }}
      >
        {this.renderMenus(allEnvs)}
      </Menu>
    );
    return (
      <>
        {allEnvs.length > 1 ? (
          <Dropdown overlay={envMenu}>
            <span className={styles.action}>
              <IeOutlined />
            </span>
          </Dropdown>
        ) : null}
      </>
    );
  }
}
export default SelectUrl;
