/* eslint-disable jsx-a11y/anchor-is-valid */
/*TODO: I18N*/
import React, { useState } from 'react';
import { Dropdown, Menu } from 'antd';

export default function DropDownGroupComponent(props) {
  const { disabled, onAdd, onDelete } = props;

  function onContextMenu({ key }) {
    if (key === 'add') {
      onAdd();
    }
    if (key === 'delete') {
      onDelete();
    }

    if (key === 'deleteGroup') {
    }
  }

  const menu = (
    <Menu onClick={onContextMenu}>
      <Menu.Item key="add">添加到组</Menu.Item>
      <Menu.Item key="delete">从组中删除</Menu.Item>
      <Menu.Item key="deleteGroup">删除该组</Menu.Item>
    </Menu>
  );
  return (
    <Dropdown.Button overlay={menu} disabled={disabled}>
      组操作
    </Dropdown.Button>
  );
}
