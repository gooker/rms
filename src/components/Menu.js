// 只用于本地开发调试使用
import React, { useState, useEffect, memo } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from '@/utils/dva';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import MenuIcon from '@/utils/MenuIcon';
// import history from '@/history';

const { SubMenu } = Menu;

const Sider = (prop) => {
  const [openKeys, setOpenKeys] = useState([]);
  // const [selectedKeys, setSelectedKeys] = useState([]);
  const [currentModuleRouter, setCurrentModuleRouter] = useState([]);
  const { currentApp, allMenuData,selectedKeys_global,dispatch } = prop;
  useEffect(() => {
    setTimeout(() => {
      // 提取当前展开的菜单节点
      const openKey = extractOpenKey();
      setOpenKeys([openKey]);

      // 提取当前选中的菜单项
      const selectedKey = window.location.href.split('#')[1];
      // setSelectedKeys([selectedKey]);
      dispatch({ type: 'global/saveSelectedKeys', payload: [selectedKey] });// agv 列表会跳转到小车监控 存放起来
    });
  }, []);

  useEffect(() => {
    const currentAppRouter = allMenuData
      .filter(({ appCode }) => appCode === currentApp)
      .map(({ menu }) => menu);

    setCurrentModuleRouter(currentAppRouter.length > 0 ? currentAppRouter[0] : []);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentApp]);

  const extractOpenKey = () => {
    let openKey;
    const selectedKey = window.location.href.split('#')[1];

    for (let index = 0; index < currentModuleRouter.length; index++) {
      const { name, routes, path } = currentModuleRouter[index];
      if (routes) {
        for (let index2 = 0; index2 < routes.length; index2++) {
          if (routes[index2].path === selectedKey) {
            openKey = name;
            break;
          }
        }
      } else {
        if (path === selectedKey) {
          openKey = name;
          break;
        }
      }

      if (openKey) {
        break;
      }
    }

    return openKey;
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
  };

  const onSelectMenuItem = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    // setSelectedKeys(selectedKeys);
    dispatch({ type: 'global/saveSelectedKeys', payload: selectedKeys });
  };

  const renderMenuItem = (name, routes) => {
    return routes.map(({ path, name: childName, routes: itemRoutes }) => {
      if (Array.isArray(itemRoutes)) {
        return (
          <SubMenu key={path} title={formatMessage({ id: `menu.${name}.${childName}` })}>
            {renderMenuItem(`${name}.${childName}`, itemRoutes)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={path}>
            <Link to={path}>
              <FormattedMessage id={`menu.${name}.${childName}`} />
            </Link>
          </Menu.Item>
        );
      }
    });
  };

  return (
    <Menu
      mode="inline"
      theme="dark"
      openKeys={openKeys}
      selectedKeys={selectedKeys_global}
      onOpenChange={onOpenChange}
      onSelect={onSelectMenuItem}
      style={{ width: '100%' }}
    >
      {currentModuleRouter.map(({ name, icon, path, routes }) => {
        if (Array.isArray(routes)) {
          return (
            <SubMenu key={path} title={formatMessage({ id: `menu.${name}` })} icon={MenuIcon[icon]}>
              {renderMenuItem(name, routes)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item key={path} icon={MenuIcon[icon]}>
            <Link to={path}>
              <FormattedMessage id={`menu.${name}`} />
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};

export default connect(({ global }) => {
  return {
    currentApp: global?.currentApp,
    allMenuData: global?.allMenuData,
    selectedKeys_global:global?.selectedKeys,
  };
})(memo(Sider));
