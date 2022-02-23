import React, { useState, useEffect, memo } from 'react';
import { Menu } from 'antd';
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
  const { dispatch, currentApp, allMenuData, updateOpenKeys, openKeys, selectedKeys } = prop;
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
  function renderMenu(routes, localeKey) {
    return routes.map(({ name, icon, path, routes }) => {
      const subLocaleKey = `${localeKey}.${name}`;
      if (Array.isArray(routes)) {
        return (
          <SubMenu
            key={path}
            title={formatMessage({ id: subLocaleKey })}
            icon={icon ? <span className={commonStyles.menuIcon}>{MenuIcon[icon]}</span> : null}
          >
            {renderMenu(routes, subLocaleKey)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item
            key={path}
            icon={icon ? <span className={commonStyles.menuIcon}>{MenuIcon[icon]}</span> : null}
          >
            <Link to={path}>
              <FormattedMessage id={subLocaleKey} />
            </Link>
          </Menu.Item>
        );
      }
    });
  }

  return (
    <div className={styles.menu}>
      <Portal />
      <div>
        <Menu
          mode="inline"
          theme="dark"
          openKeys={openKeys}
          onOpenChange={onOpenChange}
          selectedKeys={selectedKeys}
          onSelect={onSelectMenuItem}
          style={{ width: '100%' }}
        >
          {renderMenu(currentModuleMenu, 'menu')}
        </Menu>
      </div>
    </div>
  );
};
export default connect(({ global, menu }) => {
  return {
    currentApp: global.currentApp,
    allMenuData: menu.allMenuData,
    openKeys: menu.openKeys,
    selectedKeys: menu.selectedKeys,
    updateOpenKeys: menu.updateOpenKeys,
  };
})(memo(AppMenu));
