import React, { memo } from 'react';
import { Menu, Dropdown } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './tabsBar.module.less';
import commonStyle from '@/common.module.less';

const TabButton = (props) => {
  const { index, tabCount, menuKey, active, label, dispatch } = props;

  function onChange(menuKey) {
    dispatch({ type: 'menu/saveActiveTab', payload: menuKey });
  }

  function onRemove(menuKey) {
    dispatch({ type: 'menu/removeTab', payload: menuKey });
  }

  function onContextMenu({ key }) {
    dispatch({ type: 'menu/closeTab', payload: { index, action: key } });
  }

  const menu = (
    <Menu onClick={onContextMenu}>
      <Menu.Item key="left" disabled={!(index > 1)}>
        <FormattedMessage id={'app.tabs.closeLeft'} />
      </Menu.Item>
      <Menu.Item key="right" disabled={!(index < tabCount - 1)}>
        <FormattedMessage id={'app.tabs.closeRight'} />
      </Menu.Item>
      <Menu.Item key="others" disabled={!(index > 0)}>
        <FormattedMessage id={'app.tabs.closeOthers'} />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <div className={styles.tabButton} style={{ background: active ? '#fff' : '#9f9f9f' }}>
        <div className={commonStyle.flexRowCenter} style={{ height: '100%' }}>
          <span
            onClick={() => {
              onChange(menuKey);
            }}
          >
            {label}
          </span>
          {menuKey !== '/' && (
            <CloseCircleFilled
              style={{ marginLeft: 5 }}
              onClick={(ev) => {
                ev.stopPropagation();
                onRemove(menuKey);
              }}
            />
          )}
        </div>
      </div>
    </Dropdown>
  );
};
export default memo(TabButton);
