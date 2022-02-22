import React, { PureComponent } from 'react';
import { Menu, Dropdown } from 'antd';
import { connect } from '@/utils/RmsDva';
import styles from './Header.module.less';
import { IconFont } from '@/components/IconFont';

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
    return (
      <Dropdown overlay={this.renderMenu}>
        <span className={styles.action}>
          <IconFont type="icon-section" />
        </span>
      </Dropdown>
    );
  }
}
export default SelectSection;
