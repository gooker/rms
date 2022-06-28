import React, { memo, useEffect, useState } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import GroupModal from './GroupModal';
import { fetchSectionMaps } from '@/services/XIHEService';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import { fetchResourceGroup, saveResourceGroup } from '@/services/resourceService';
import AddToGroupModal from '@/components/ResourceGroup/AddToGroupModal';
import { isPlainObject, uniq } from 'lodash';

const GroupManager = (props) => {
  const { type, memberIdKey, selections, refresh, cancelSelection } = props;

  const [mapId, setMapId] = useState(null);
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
        setMapId(activeMap.id);
        const allResourceGroups = await fetchResourceGroup({ mapId: activeMap.id });
        const _groups = allResourceGroups.filter((item) => item.groupType === type);
        setGroups(_groups);
      } else {
        message.error(formatMessage({ id: 'app.message.noActiveMap' }));
      }
    } else {
      message.error(formatMessage({ id: 'app.message.fetchMapFail' }));
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
      //
    }
  }

  async function addToGroup(selectGroups) {
    let groupsDetail = groups.filter((item) => selectGroups.includes(item.code));
    groupsDetail = groupsDetail.map((item) => {
      const loopResult = { ...item };
      if (!Array.isArray(loopResult.members)) {
        loopResult.members = [];
      }
      if (!isPlainObject(loopResult.members)) {
        loopResult.priority = {};
      }
      const { members, priority } = loopResult;
      loopResult.members = uniq(members.concat(selections.map(({ id }) => id)));
      for (const selection of selections) {
        const memberId = selection[memberIdKey];
        if (isNull(priority[selection.id])) {
          priority[selection.id] = {
            memberId,
            priority: 5,
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
        mapId={mapId}
        groups={groups}
        onChange={setGroups}
        visible={groupModalVisible}
        onCancel={() => {
          setGroupModalVisible(false);
        }}
      />

      {/*  添加到组 */}
      <AddToGroupModal
        visible={addingModalVisible}
        groups={groups}
        onCancel={() => {
          setAddingModalVisible(false);
        }}
        onOk={addToGroup}
      />
    </>
  );
};
export default memo(GroupManager);
