import React, { memo, useEffect, useState } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { isPlainObject, uniq } from 'lodash';
import GroupModal from './GroupModal';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchSectionMaps } from '@/services/XIHEService';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import { fetchResourceGroup, saveResourceGroup } from '@/services/resourceService';
import AddToGroupModal from '@/components/ResourceGroup/AddToGroupModal';
import GroupResourceModal from '@/components/ResourceGroup/GroupResourceModal';

/**
 * @param props
 * @param type 组类型
 * @param memberIdKey
 * @param selections 列表页面Table的 selectedRows 对象
 * @param cancelSelection 取消Table选择的回调方法
 * @param refresh 刷新列表页面数据的回调方法
 */
const GroupManager = (props) => {
  const { type, memberIdKey, selections, refresh, cancelSelection } = props;

  const [activeMapId, setActiveMapId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupModalVisible, setGroupModalVisible] = useState(false); // 组CRUD
  const [addingModalVisible, setAddingModalVisible] = useState(false); // 添加到组
  const [resourceModalVisible, setResourceModalVisible] = useState(false); // 查看/编辑组成员

  useEffect(() => {
    init();
  }, []);

  async function init() {
    const sectionMaps = await fetchSectionMaps();
    if (!dealResponse(sectionMaps)) {
      const activeMap = sectionMaps.filter((item) => item.activeFlag)[0];
      if (activeMap) {
        setActiveMapId(activeMap.id);
        await refreshResourceGroup(activeMap.id);
      } else {
        message.error(formatMessage({ id: 'app.message.noActiveMap' }));
      }
    } else {
      message.error(formatMessage({ id: 'app.message.fetchMapFail' }));
    }
  }

  async function refreshResourceGroup(mapId) {
    const allResourceGroups = await fetchResourceGroup({ mapId });
    if (!dealResponse(allResourceGroups)) {
      const _groups = allResourceGroups.filter((item) => item.groupType === type);
      setGroups(_groups);
    }
  }

  const menu = (
    <Menu onClick={onMenuClick}>
      <Menu.Item key={'group_manage'}>
        <FormattedMessage id={'group.groupMange'} />
      </Menu.Item>
      <Menu.Item key={'resource_group_manage'}>
        <FormattedMessage id={'group.resourceGroupMange'} />
      </Menu.Item>
    </Menu>
  );

  function onMenuClick({ key }) {
    if (key === 'group_manage') {
      setGroupModalVisible(true);
    }
    if (key === 'resource_group_manage') {
      setResourceModalVisible(true);
    }
  }

  async function addToGroup(payload) {
    let groupsDetail = groups.filter((item) => payload.groups.includes(item.code));
    groupsDetail = groupsDetail.map((item) => {
      const loopResult = { ...item };
      if (!Array.isArray(loopResult.members)) {
        loopResult.members = [];
      }
      if (!isPlainObject(loopResult.priority)) {
        loopResult.priority = {};
      }
      const { members, priority } = loopResult;
      loopResult.members = uniq(members.concat(selections.map(({ id }) => id)));
      for (const selection of selections) {
        const memberId = selection[memberIdKey];
        if (isNull(priority[selection.id])) {
          priority[selection.id] = {
            memberId,
            priority: payload.priority,
          };
        }
      }
      return loopResult;
    });
    const promises = groupsDetail.map((item) => saveResourceGroup(item));
    const response = await Promise.all(promises);
    if (!dealResponse(response, true)) {
      setAddingModalVisible(false);
      refresh();
      refreshResourceGroup(activeMapId);
      cancelSelection();
    }
  }

  return (
    <>
      <Dropdown.Button
        onClick={() => {
          if (selections.length === 0) {
            message.warn('请先选择资源');
          } else {
            setAddingModalVisible(true);
          }
        }}
        overlay={menu}
      >
        <PlusOutlined /> <FormattedMessage id={'group.addToGroup'} />
      </Dropdown.Button>

      {/* 资源组管理 */}
      <GroupModal
        type={type}
        mapId={activeMapId}
        groups={groups}
        onChange={setGroups}
        visible={groupModalVisible}
        onCancel={() => {
          refresh();
          setGroupModalVisible(false);
        }}
      />

      {/* 添加到组 */}
      <AddToGroupModal
        visible={addingModalVisible}
        groups={groups}
        onCancel={() => {
          setAddingModalVisible(false);
        }}
        onOk={addToGroup}
      />

      {/* 资源组管理 */}
      <GroupResourceModal
        visible={resourceModalVisible}
        groups={groups}
        onCancel={(needRefresh) => {
          needRefresh === true && refresh();
          setResourceModalVisible(false);
        }}
      />
    </>
  );
};
export default memo(GroupManager);
