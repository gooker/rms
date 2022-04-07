import React, { memo } from 'react';
import { Menu, Dropdown } from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './tabsBar.module.less';
import commonStyle from '@/common.module.less';
import Loadable from '@/components/Loadable';
const LoadableRefreshPage = Loadable(() => import('@/components/RefreshPage'));

const TabButton = (props) => {
  const { dispatch, tabs, index, menuKey, label, activeTab } = props;
  const tabCount = tabs.length;
  const active = menuKey === activeTab;

  function onChange() {
    dispatch({ type: 'menu/saveActiveTab', payload: menuKey });
  }

  function onRemove() {
    dispatch({ type: 'menu/removeTab', payload: menuKey });
  }

  function onContextMenu({ key }) {
    if (key === 'refresh') {
      onRefresh();
    } else {
      dispatch({ type: 'menu/closeTab', payload: { index, action: key } });
    }
  }

  function onRefresh() {
    if (!active) {
      onChange();
    }
    // 先替换index位置的tab数据，指向刷新的页面
    const originTab = { ...tabs[index] };
    const _tabs = [...tabs];
    _tabs.splice(index, 1, {
      ...originTab,
      $$component: LoadableRefreshPage,
    });
    dispatch({ type: 'menu/saveState', payload: { tabs: _tabs } });

    // 设置定时器再切回来，这样可以触发tabs的更新
    setTimeout(() => {
      _tabs.splice(index, 1, originTab);
      dispatch({ type: 'menu/saveState', payload: { tabs: [..._tabs] } });
    }, 0);
  }

  const menu = (
    <Menu onClick={onContextMenu}>
      <Menu.Item key="refresh">
        <FormattedMessage id={'app.button.refresh'} />
      </Menu.Item>
      <Menu.Item key="left" disabled={index <= 1}>
        <FormattedMessage id={'app.tabs.closeLeft'} />
      </Menu.Item>
      <Menu.Item key="right" disabled={index >= tabCount - 1}>
        <FormattedMessage id={'app.tabs.closeRight'} />
      </Menu.Item>
      <Menu.Item key="others" disabled={index <= 1}>
        <FormattedMessage id={'app.tabs.closeOthers'} />
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menu} trigger={['contextMenu']}>
      <div
        className={styles.tabButton}
        style={{ background: active ? '#fff' : '#9f9f9f' }}
        onClick={onChange}
      >
        <div className={commonStyle.flexRowCenter} style={{ height: '100%' }}>
          <span style={active ? { color: '#1890ff', fontWeight: 500 } : {}}>{label}</span>
          <CloseCircleFilled
            style={{ marginLeft: 5 }}
            onClick={(ev) => {
              ev.stopPropagation();
              onRemove();
            }}
          />
        </div>
      </div>
    </Dropdown>
  );
};
export default connect(({ menu }) => ({
  tabs: menu.tabs,
  activeTab: menu.activeTab,
}))(memo(TabButton));
