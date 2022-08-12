import React, { PureComponent } from 'react';
import { Dropdown, Menu } from 'antd';
import { connect } from '@/utils/RmsDva';
import styles from './Header.module.less';
import { IconFont } from '@/components/IconFont';

@connect(({ user }) => ({
  currentUser: user.currentUser,
}))
class SelectSection extends PureComponent {
  changeSection = (record) => {
    const { key } = record;
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchUpdateUserCurrentSection',
      payload: key, // key就是sectionId,
    }).then((result) => {
      if (result) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
    });
  };

  renderMenu = () => {
    const {
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
      <Menu selectedKeys={[sectionId]} onClick={this.changeSection}>
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
