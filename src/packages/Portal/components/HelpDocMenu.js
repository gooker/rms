import React, { memo, useEffect, useState } from 'react';
import { Menu, Typography } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import MenuIcon from '@/utils/MenuIcon';
import { formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import styles from '@/layout/homeLayout.module.less';

const { SubMenu } = Menu;

const HelpDocMenu = (props) => {
  const { dispatch, currentApp, allMenuData, menuCollapsed, openKeys, selectedKeys } = props;

  const [currentModuleMenu, setCurrentModuleMenu] = useState([]);

  // 根据currentApp重新渲染菜单数据
  useEffect(() => {
    if (isNull(currentApp)) return;
    const currentAppRouter = allMenuData
      .filter(({ appCode }) => appCode === currentApp)
      .map(({ menu }) => menu);
    setCurrentModuleMenu(currentAppRouter.length > 0 ? currentAppRouter[0] : []);
  }, [currentApp]);

  function onOpenChange(keys) {
    const routeFirstLevelKeys = currentModuleMenu.map(({ path }) => path);
    // 取最后keys数组最后一个节点，如果是某个根节点(routeFirstLevelKeys)，就隐藏别的已展开的节点
    const lastOpenKey = keys[keys.length - 1];
    if (routeFirstLevelKeys.includes(lastOpenKey)) {
      dispatch({ type: 'help/saveOpenKeys', payload: [lastOpenKey] });
    } else {
      dispatch({ type: 'help/saveOpenKeys', payload: keys });
    }
  }

  function extractOpenKeys() {
    const { pathname } = window.location;

    if (pathname === '/' || !Array.isArray(currentModuleMenu) || currentModuleMenu.length === 0) {
      return [];
    }

    const openKeys = [];
    const routeFirstLevelKeys = currentModuleMenu.map(({ path }) => path);
    for (let i = 0; i < routeFirstLevelKeys.length; i++) {
      if (pathname.startsWith(routeFirstLevelKeys[i])) {
        openKeys.push(routeFirstLevelKeys[i]);

        const suffix = `${routeFirstLevelKeys[i]}/`;
        const restPath = pathname.replace(suffix, '').split('/');
        if (restPath.length > 1) {
          // 最后一个路由是页面路由要去掉
          restPath.pop();
          let openKey = '';
          restPath.forEach((item) => {
            openKey = `${suffix}${item}`;
            openKeys.push(openKey);
          });
        }
        return openKeys;
      }
    }
  }

  function onSelectMenuItem(item) {
    dispatch({ type: 'help/saveSelectedKeys', payload: item.selectedKeys });
  }

  function switchMenuCollapsed() {
    dispatch({ type: 'help/updateMenuCollapsed', payload: !menuCollapsed });
  }

  // 渲染菜单
  function renderMenu(routes) {
    return routes
      .map(({ icon, path, routes, locale, hideInMenu }) => {
        if (hideInMenu) return null;
        if (Array.isArray(routes)) {
          return (
            <SubMenu
              key={path}
              title={formatMessage({ id: locale })}
              icon={icon ? <span className={commonStyles.menuIcon}>{MenuIcon[icon]}</span> : null}
            >
              {renderMenu(routes)}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={path}
              icon={icon ? <span className={commonStyles.menuIcon}>{MenuIcon[icon]}</span> : null}
            >
              <Typography.Link>
                <FormattedMessage id={locale} />
              </Typography.Link>
            </Menu.Item>
          );
        }
      })
      .filter(Boolean);
  }

  return (
    <>
      <Menu
        theme='dark'
        mode='inline'
        openKeys={openKeys}
        inlineCollapsed={menuCollapsed}
        onOpenChange={onOpenChange}
        selectedKeys={selectedKeys}
        onSelect={onSelectMenuItem}
        style={{ width: '100%' }}
      >
        {renderMenu(currentModuleMenu)}
      </Menu>
      <div onClick={switchMenuCollapsed} className={styles.menuTrigger}>
        {menuCollapsed ? <RightOutlined /> : <LeftOutlined />}
      </div>
    </>
  );
};
export default connect(({ global, help, menu }) => ({
  allMenuData: menu.allMenuData,
  menuCollapsed: help.menuCollapsed,
  openKeys: help.openKeys,
  selectedKeys: help.selectedKeys,
  currentApp: help.currentApp,
}))(memo(HelpDocMenu));
