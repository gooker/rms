import React, { useState, useEffect, memo } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from '@/utils/RcsDva';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import MenuIcon from '@/utils/MenuIcon';
import commonStyles from '@/common.module.less';

const { SubMenu } = Menu;

const Slider = (prop) => {
  const { dispatch, currentApp, allMenuData } = prop;

  const { pathname } = window.location;
  const [currentModuleRouter, setCurrentModuleRouter] = useState([]);
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(pathname === '/' ? [] : [pathname]);

  // 根据currentApp重新渲染菜单数据
  useEffect(() => {
    const currentAppRouter = allMenuData
      .filter(({ appCode }) => appCode === currentApp)
      .map(({ menu }) => menu);
    setCurrentModuleRouter(currentAppRouter.length > 0 ? currentAppRouter[0] : []);
  }, [currentApp]);

  useEffect(() => {
    setOpenKeys(extractOpenKeys());
  }, [currentModuleRouter]);

  function extractOpenKeys() {
    if (
      pathname === '/' ||
      !Array.isArray(currentModuleRouter) ||
      currentModuleRouter.length === 0
    ) {
      return [];
    }

    const openKeys = [];
    const routeFirstLevelKeys = currentModuleRouter.map(({ path }) => path);
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
    const routeFirstLevelKeys = currentModuleRouter.map(({ path }) => path);
    // 取最后keys数组最后一个节点，如果是某个根节点(routeFirstLevelKeys)，就隐藏别的已展开的节点
    const lastOpenKey = keys[keys.length - 1];
    if (routeFirstLevelKeys.includes(lastOpenKey)) {
      setOpenKeys([lastOpenKey]);
    } else {
      setOpenKeys(keys);
    }
  }

  function onSelectMenuItem({ selectedKeys }) {
    setSelectedKeys(selectedKeys);
    // dispatch({ type: 'global/saveMenuSelectKeys', payload: selectedKeys });
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
    <Menu
      mode="inline"
      theme="dark"
      openKeys={openKeys}
      onOpenChange={onOpenChange}
      selectedKeys={selectedKeys}
      onSelect={onSelectMenuItem}
      style={{ width: '100%' }}
    >
      {renderMenu(currentModuleRouter, 'menu')}
    </Menu>
  );
};
export default connect(({ global, user }) => {
  return {
    currentApp: global?.currentApp,
    allMenuData: global?.allMenuData,
    menuSelectKeys: global?.menuSelectKeys,
  };
})(memo(Slider));
