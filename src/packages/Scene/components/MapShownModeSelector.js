/* TODO: I18N */
import React, { memo } from 'react';
import { Dropdown, Menu } from 'antd';
import { CheckOutlined, UpOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './sceneComponentStyle.module.less';
import { CoordinateType, NavigationTypeView } from '@/config/config';

const MapShownModeSelector = (props) => {
  const { dispatch, shownNavigationCellType, shownCellCoordinateType } = props;

  const menu = (
    <Menu selectedKeys={shownNavigationCellType} onClick={updateShownType}>
      {NavigationTypeView.map((item) => (
        <Menu.Item key={item.code}>
          {shownNavigationCellType.includes(item.code) && <CheckOutlined />}
          <span style={{ marginLeft: 8 }}>{item.name}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const cellCoordinateTypeMenu = (
    <Menu selectedKeys={[shownCellCoordinateType]} onClick={updateShownCellCoordinateType}>
      <Menu.Item key={'land'}>物理点位</Menu.Item>
      <Menu.Item key={'navi'}>导航点位</Menu.Item>
    </Menu>
  );

  function updateShownCellCoordinateType({ key }) {
    dispatch({ type: 'editorView/updateShownCellCoordinateType', payload: key });
  }

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
      <Dropdown overlay={cellCoordinateTypeMenu} trigger={['click']}>
        <span className={styles.navigationCellTypeSelectorContent}>
          {shownCellCoordinateType === CoordinateType.LAND ? '物理点位' : '导航点位'}
          <UpOutlined style={{ marginLeft: 5 }} />
        </span>
      </Dropdown>
      <div className={styles.divider} />
      <Dropdown overlay={menu} trigger={['click']}>
        <span className={styles.navigationCellTypeSelectorContent}>
          <FormattedMessage id={'editor.navigationCellType'} />
          <span style={{ color: '#1890ff', marginLeft: 3, fontWeight: 600 }}>
            ({shownNavigationCellType.length})
          </span>
          <UpOutlined style={{ marginLeft: 5 }} />
        </span>
      </Dropdown>
    </div>
  );
};
export default connect(({ global, editorView }) => ({
  shownNavigationCellType: editorView.shownNavigationCellType,
  shownCellCoordinateType: editorView.shownCellCoordinateType,
}))(memo(MapShownModeSelector));
