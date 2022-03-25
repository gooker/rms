import React, { useState, useEffect, memo } from 'react';
import { Menu } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { connect } from '@/utils/RmsDva';
import MenuIcon from '@/utils/MenuIcon';
import { formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import Portal from '@/packages/Portal/components/Portal/Portal';
import styles from '../layout/homeLayout.module.less';
import commonStyles from '@/common.module.less';

const { SubMenu } = Menu;

const AppMenu = (prop) => {
  const {
    dispatch,
    currentApp,
    menuCollapsed,
    allMenuData,
    updateOpenKeys,
    openKeys,
    selectedKeys,
  } = prop;
  const [currentModuleMenu, setCurrentModuleMenu] = useState([]);
  const { pathname } = window.location;

  useEffect(() => {
    const _selectedKeys = pathname === '/' ? [] : [pathname];
    if (_selectedKeys.length > 0) {
      const currentApp = pathname.split('/')[1];
      dispatch({ type: 'global/saveCurrentApp', payload: currentApp });
    }
    dispatch({ type: 'menu/saveSelectedKeys', payload: _selectedKeys });
  }, []);

  // 根据currentApp重新渲染菜单数据
  useEffect(() => {
    if (isNull(currentApp)) return;
    const currentAppRouter = allMenuData
      .filter(({ appCode }) => appCode === currentApp)
      .map(({ menu }) => menu);
    setCurrentModuleMenu(currentAppRouter.length > 0 ? currentAppRouter[0] : []);
  }, [currentApp]);

  useEffect(() => {
    dispatch({
      type: 'menu/saveState',
      payload: { openKeys: extractOpenKeys(), selectedKeys: [pathname] },
    });
  }, [currentModuleMenu, updateOpenKeys]);

  function extractOpenKeys() {
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

  function onOpenChange(keys) {
    const routeFirstLevelKeys = currentModuleMenu.map(({ path }) => path);
    // 取最后keys数组最后一个节点，如果是某个根节点(routeFirstLevelKeys)，就隐藏别的已展开的节点
    const lastOpenKey = keys[keys.length - 1];
    if (routeFirstLevelKeys.includes(lastOpenKey)) {
      dispatch({ type: 'menu/saveOpenKeys', payload: [lastOpenKey] });
    } else {
      dispatch({ type: 'menu/saveOpenKeys', payload: keys });
    }
  }

  function onSelectMenuItem(item) {
    dispatch({ type: 'menu/saveSelectedKeys', payload: item.selectedKeys });
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
              <Link to={path}>
                <FormattedMessage id={locale} />
              </Link>
            </Menu.Item>
          );
        }
      })
      .filter(Boolean);
  }

  function switchMenuCollapsed() {
    dispatch({ type: 'global/updateMenuCollapsed', payload: !menuCollapsed });
  }

  return (
    <div className={styles.menu}>
      <Portal />
      <div style={{ width: menuCollapsed ? 50 : 200 }}>
        <Menu
          theme="dark"
          mode="inline"
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
      </div>
    </div>
  );
};
export default connect(({ global, menu }) => {
  return {
    currentApp: global.currentApp,
    menuCollapsed: global.menuCollapsed,
    openKeys: menu.openKeys,
    allMenuData: menu.allMenuData,
    selectedKeys: menu.selectedKeys,
    updateOpenKeys: menu.updateOpenKeys,
  };
})(memo(AppMenu));
