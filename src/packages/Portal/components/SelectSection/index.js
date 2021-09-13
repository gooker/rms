import React, { PureComponent } from 'react';
import { Menu } from 'antd';
import IconDir from '@/utils/ExtraIcon';
import HeaderDropdown from '@/components/HeaderDropdown';

import { connect } from '@/utils/dva';
import styles from '../Head.module.less';

@connect(({ global, user }) => ({
  currentUser: user.currentUser,
}))
class SelectSection extends PureComponent {
  renderMenu = () => {
    const {
      onMenuClick,
      currentUser: { sections },
    } = this.props;
    const sectionId = window.localStorage.getItem('sectionId');
    let menuData = [];
    if (sections && Array.isArray(sections)) {
      menuData = sections.map((element) => (
        <Menu.Item key={element.sectionId}>{element.sectionName}</Menu.Item>
      ));
    }
    return (
      <Menu selectedKeys={[sectionId]} onClick={onMenuClick}>
        {menuData}
      </Menu>
    );
  };
  render() {
    const { showLabel, currentUser } = this.props;
    const currentSection = currentUser?.currentSection ? currentUser.currentSection : {};

    return (
      <HeaderDropdown overlay={this.renderMenu}>
        <span className={`${styles.action} ${styles.account}`}>
          <span style={{ marginRight: 3 }}>
            <IconDir type="iconquyuguanli" />{' '}
          </span>
          {showLabel && <span className={styles.name}>{currentSection.sectionName}</span>}
        </span>
      </HeaderDropdown>
    );
  }
}

export default SelectSection;
