import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import { connect } from '@/utils/RmsDva';
import I18NIcon from '@/components/I18NIcon';
import styles from './Header.module.less';

@connect(({ global }) => ({
  systemLanguage: global.systemLanguage,
}))
class SelectLang extends PureComponent {
  render() {
    const { onChange, systemLanguage } = this.props;
    const selectedLang = window.localStorage.getItem('currentLocale');
    const langMenu = (
      <Menu selectedKeys={[selectedLang]} onClick={onChange}>
        {systemLanguage.map((record) => (
          <Menu.Item key={record.code}>{record.name}</Menu.Item>
        ))}
      </Menu>
    );
    return (
      <Dropdown overlay={langMenu} placement="bottomRight">
        <span className={styles.action}>
          <I18NIcon />
        </span>
      </Dropdown>
    );
  }
}
export default SelectLang;
