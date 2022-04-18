import React, { memo } from 'react';
import { Dropdown, Menu } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './sceneComponentStyle.module.less';

const NavigationCellTypeSelector = (props) => {
  const { dispatch, navigationCellType, shownNavigationCellType } = props;

  const menu = (
    <Menu selectedKeys={shownNavigationCellType} onClick={updateShownType}>
      {navigationCellType.map((item) => (
        <Menu.Item
          key={item.code}
          disabled={
            shownNavigationCellType.length === 1 && shownNavigationCellType.includes(item.code)
          }
        >
          {shownNavigationCellType.includes(item.code) && <CheckOutlined />}
          <span style={{ marginLeft: 8 }}>{item.name}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  function updateShownType({ key }) {
    let _shownNavigationCellType = [...shownNavigationCellType];
    if (_shownNavigationCellType.includes(key)) {
      _shownNavigationCellType = _shownNavigationCellType.filter((item) => item !== key);
    } else {
      _shownNavigationCellType.push(key);
    }
    dispatch({
      type: 'editorView/updateShownNavigationCellType',
      payload: _shownNavigationCellType,
    });
  }

  return (
    <div className={styles.navigationCellTypeSelector}>
      <Dropdown overlay={menu} trigger={['click']}>
        <span className={styles.navigationCellTypeSelectorContent}>
          <FormattedMessage id={'editor.navigationCellType'} />:
          <span style={{ color: '#1890ff', marginLeft: 3, fontWeight: 600 }}>
            ({shownNavigationCellType.length})
          </span>
        </span>
      </Dropdown>
    </div>
  );
};
export default connect(({ global, editorView }) => ({
  navigationCellType: global.navigationCellType,
  shownNavigationCellType: editorView.shownNavigationCellType,
}))(memo(NavigationCellTypeSelector));
