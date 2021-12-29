import React, { useState, useEffect, memo } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from '@/utils/dva';
import { formatMessage, isStrictNull } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import MenuIcon from '@/utils/MenuIcon';
import commonStyles from '@/common.module.less';

const baseCode = {
  tote: 'tote-wcs-gui',
};

const { SubMenu } = Menu;

const Slider = (prop) => {
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState(prop.selectedKeys_global);
  const [currentModuleRouter, setCurrentModuleRouter] = useState([]);
  const { currentApp, currentUser, allMenuData, dispatch } = prop;

  useEffect(() => {
    const currentOpenApp = window.location.href.split('#/')[1];
    let code = null;
    if (!isStrictNull(currentOpenApp)) {
      code = baseCode[currentOpenApp.split('/')[0]] || currentOpenApp.split('/')[0];
    } else {
      code = currentUser && currentUser.username === 'admin' ? 'sso' : 'mixrobot';
    }
    dispatch({ type: 'global/saveCurrentApp', payload: code });
  }, []);

  useEffect(() => {
    const currentAppRouter = allMenuData
      .filter(({ appCode }) => appCode === currentApp)
      .map(({ menu }) => menu);
    setCurrentModuleRouter(currentAppRouter.length > 0 ? currentAppRouter[0] : []);
  }, [currentApp]);

  useEffect(() => {
    const openKey = extractOpenKey(selectedKeys);
    setOpenKeys([openKey]);
  }, [currentModuleRouter, selectedKeys]);

  const extractOpenKey = (key) => {
    let openKey;
    const selectedKey = key[0];
    for (let index = 0; index < currentModuleRouter.length; index++) {
      const { routes, path } = currentModuleRouter[index];
      if (routes) {
        for (let index2 = 0; index2 < routes.length; index2++) {
          if (routes[index2].path === selectedKey) {
            openKey = path;
            break;
          }
        }
      } else {
        if (path === selectedKey) {
          openKey = path;
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
    setSelectedKeys(selectedKeys);
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
      selectedKeys={selectedKeys}
      onOpenChange={onOpenChange}
      onSelect={onSelectMenuItem}
      style={{ width: '100%' }}
    >
      {currentModuleRouter.map(({ name, icon, path, routes }) => {
        if (Array.isArray(routes)) {
          return (
            <SubMenu
              key={path}
              title={formatMessage({ id: `menu.${name}` })}
              icon={<span className={commonStyles.menuIcon}>{MenuIcon[icon]}</span>}
            >
              {renderMenuItem(name, routes)}
            </SubMenu>
          );
        }
        return (
          <Menu.Item
            key={path}
            icon={<span className={commonStyles.menuIcon}>{MenuIcon[icon]}</span>}
          >
            <Link to={path}>
              <FormattedMessage id={`menu.${name}`} />
            </Link>
          </Menu.Item>
        );
      })}
    </Menu>
  );
};
export default connect(({ global, user }) => {
  return {
    currentApp: global?.currentApp,
    allMenuData: global?.allMenuData,
    selectedKeys_global: global?.selectedKeys,
    currentUser: user?.currentUser,
  };
})(memo(Slider));
