import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import { IeOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import styles from './Header.module.less';

export default class SelectUrl extends PureComponent {
  changeEnvironment = ({ key }) => {
    const { environments } = this.props;
    const environment = find(environments, ({ id }) => id === key);
    const { changeEnvironment } = this.props;
    if (environment) {
      changeEnvironment(environment);
    } else {
      changeEnvironment({ id: 0 });
    }
  };

  renderMenus = (environments) => {
    const data = [];
    for (let index = 0; index < environments.length; index++) {
      const element = environments[index];
      data.push(<Menu.Item key={element.id}>{element.envName}</Menu.Item>);
    }
    return data;
  };

  renderSelectedEnvironment = () => {
    const { environments = [] } = this.props;
    const currentEnv = environments.filter((item) => item.flag === '1');
    if (currentEnv.length !== 0) {
      return currentEnv[0];
    } else {
      return environments[0];
    }
  };

  render() {
    const { environments } = this.props;
    const selectedEnvironment = this.renderSelectedEnvironment() || {};
    const envMenu = (
      <Menu
        selectedKeys={[`${selectedEnvironment.id}`]}
        onClick={(key) => {
          this.changeEnvironment(key);
        }}
      >
        {this.renderMenus(environments)}
      </Menu>
    );
    return (
      <>
        {environments && environments.length > 1 ? (
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
