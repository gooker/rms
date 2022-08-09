import React, { memo } from 'react';
import { Dropdown, Menu } from 'antd';
import { CheckOutlined, UpOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { CoordinateType, NavigationTypeView } from '@/config/config';
import styles from './sceneComponentStyle.module.less';

const MapShownModeSelector = (props) => {
  const {
    shownNavigationType,
    shownCellCoordinateType,
    onNavigationTypeChanged,
    onCellCoordinateTypeChanged,
  } = props;

  const menu = (
    <Menu selectedKeys={shownNavigationType} onClick={updateShownType}>
      {NavigationTypeView.map((item) => (
        <Menu.Item key={item.code}>
          {shownNavigationType.includes(item.code) && <CheckOutlined />}
          <span style={{ marginLeft: 8 }}>{item.name}</span>
        </Menu.Item>
      ))}
    </Menu>
  );

  const cellCoordinateTypeMenu = (
    <Menu selectedKeys={[shownCellCoordinateType]} onClick={updateShownCellCoordinateType}>
      <Menu.Item key={'navi'}>
        <FormattedMessage id='app.map.naviCell' />
      </Menu.Item>
      <Menu.Item key={'land'}>
        <FormattedMessage id='app.map.landCell' />
      </Menu.Item>
    </Menu>
  );

  function updateShownCellCoordinateType({ key }) {
    onCellCoordinateTypeChanged(key);
  }

  function updateShownType({ key }) {
    let _shownNavigationCellType = [...shownNavigationType];
    if (_shownNavigationCellType.includes(key)) {
      _shownNavigationCellType = _shownNavigationCellType.filter((item) => item !== key);
    } else {
      _shownNavigationCellType.push(key);
    }
    onNavigationTypeChanged(_shownNavigationCellType);
  }

  return (
    <div className={styles.navigationCellTypeSelector}>
      <Dropdown overlay={cellCoordinateTypeMenu} trigger={['click']}>
        <span className={styles.navigationCellTypeSelectorContent}>
          {shownCellCoordinateType === CoordinateType.LAND ? (
            <FormattedMessage id="app.map.landCell" />
          ) : (
            <FormattedMessage id="app.map.naviCell" />
          )}
          <UpOutlined style={{ marginLeft: 5 }} />
        </span>
      </Dropdown>
      <div className={styles.divider} />
      <Dropdown overlay={menu} trigger={['click']}>
        <span className={styles.navigationCellTypeSelectorContent}>
          <FormattedMessage id={'editor.navigationType'} />
          <span style={{ color: '#1890ff', marginLeft: 3, fontWeight: 600 }}>
            ({shownNavigationType.length})
          </span>
          <UpOutlined style={{ marginLeft: 5 }} />
        </span>
      </Dropdown>
    </div>
  );
};
export default memo(MapShownModeSelector);
