// 只用于本地开发调试使用
import React, { useState, useEffect, memo } from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import MenuIcon from '@/utils/MenuIcon';
import { Sorter } from '@/config/router';

const { SubMenu } = Menu;

const Sider = () => {
  const [openKeys, setOpenKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      // 提取当前展开的菜单节点
      const openKey = extractOpenKey();
      setOpenKeys([openKey]);

      // 提取当前选中的菜单项
      const selectedKey = window.location.href.split('#')[1];
      setSelectedKeys([selectedKey]);
    });
  }, []);

  const extractOpenKey = () => {
    let openKey;
    const selectedKey = window.location.href.split('#')[1];
    for (let index = 0; index < Sorter.length; index++) {
      const { name, routes } = Sorter[index];
      for (let index2 = 0; index2 < routes.length; index2++) {
        if (routes[index2].path === selectedKey) {
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
    const latestOpenKey = keys.find((key) => openKeys.indexOf(key) === -1);
    setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
  };

  const onSelectMenuItem = ({ item, key, keyPath, selectedKeys, domEvent }) => {
    setSelectedKeys(selectedKeys);
  };

  const renderMenuItem = (name, routes) => {
    return routes.map(({ path, name: childName }) => (
      <Menu.Item key={path}>
        <Link to={path}>
          <FormattedMessage id={`menu.${name}.${childName}`} />
        </Link>
      </Menu.Item>
    ));
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
      {Sorter.map(({ name, icon, routes }) => (
        <SubMenu key={name} title={formatMessage({ id: `menu.${name}` })} icon={MenuIcon[icon]}>
          {renderMenuItem(name, routes)}
        </SubMenu>
      ))}
    </Menu>
  );
};
export default memo(Sider);
