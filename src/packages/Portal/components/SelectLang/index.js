import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import classNames from 'classnames';
import HeaderDropdown from '@/components/HeaderDropdown';
import LocalsKeys from '@/locales/LocaleKeys';
import styles from '../SelectEnvironment/index.module.less';

export default class SelectLang extends PureComponent {
  render() {
    const { className, onChange, showLabel } = this.props;
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
      <HeaderDropdown overlay={langMenu} placement="bottomRight">
        <span className={classNames(styles.dropDown, className)}>
          <GlobalOutlined title={<FormattedMessage id="app.navBar.lang" />} />
          {showLabel && <span style={{ marginLeft: 4 }}>{LocalsKeys[selectedLang]}</span>}
        </span>
      </HeaderDropdown>
    );
  }
}
