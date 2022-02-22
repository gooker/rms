import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import LocalsKeys from '@/locales/LocaleKeys';
import I18NIcon from '@/components/I18NIcon';
import styles from './Header.module.less';

export default class SelectLang extends PureComponent {
  render() {
    const { onChange } = this.props;
    const localLocales =
      window.localStorage.getItem('locales') || '["zh-CN","en-US","ko-KR","vi-VN"]';
    const selectedLang = window.localStorage.getItem('currentLocale');
    const langMenu = (
      <Menu className={styles.menu} selectedKeys={[selectedLang]} onClick={onChange}>
        {JSON.parse(localLocales).map((locale) => (
          <Menu.Item key={locale}>{LocalsKeys[locale]}</Menu.Item>
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
