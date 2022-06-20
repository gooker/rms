import React, { memo, useEffect, useState } from 'react';
import { Dropdown, Menu, Row, Col } from 'antd';
import { find } from 'lodash';
import { fetchActiveMap } from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchResourceGroup, deleteResourceGroupMembers } from '@/services/resourceService';

import ResourceGroupModal from './ResourceGroupModal';
import RmsConfirm from '@/components/RmsConfirm';
import FormattedMessage from '@/components/FormattedMessage';

function ResourceGroupOperateComponent(props) {
  const { selectedRowKeys, selectedRows, onRefresh, groupType } = props;

  const [currentType, setCurrentType] = useState(null);
  const [title, setTitle] = useState(null);
  const [groupVisible, setGroupVisible] = useState(false); // 添加到分组

  const [mapId, setMapId] = useState(null);
  const [groupData, setGroupData] = useState([]);

  useEffect(() => {
    async function init() {
      const data = await fetchActiveMap();
      if (!dealResponse(data)) {
        setMapId(data?.id);
        const response = await fetchResourceGroup({ mapId: data?.id });
        if (!dealResponse(response)) {
          const currentTypeData = response?.filter((item) => item?.groupType === groupType);
          setGroupData(currentTypeData);
        }
      }
    }

    init();
  }, []);

  function onContextMenu({ key }) {
    let title = '';
    if (key === 'add') {
      title = formatMessage({ id: 'resourceGroup.add' });
      setGroupVisible(true);
    }

    if (key === 'edit') {
      title = formatMessage({ id: 'resourceGroup.editPriority' });
      setGroupVisible(true);
    }
    if (key === 'deleteMember') {
      title = formatMessage({ id: 'resourceGroup.deleteMember' });
      onDeleteMember();
    }

    if (key === 'deleteGroup') {
      title = formatMessage({ id: 'resourceGroup.delete' });
      setGroupVisible(true);
    }
    setCurrentType(key);
    setTitle(title);
  }

  function onDeleteMember() {
    let allSelectedIds = selectedRows.map(({ id }) => id);
    let allGroups = selectedRows.map(({ groups }) => groups).flat();
    allGroups = [...new Set(allGroups)];

    const params = [];
    const _data = [];
    allGroups.map((name) => {
      const { id, members } = find(groupData, { groupName: name });
      const currentIds = members?.filter((mem) => allSelectedIds.includes(mem));
      params.push({
        groupId: id,
        members: currentIds,
      });
      _data.push(
        <Row>
          <Col>{name}</Col>
          <Col>{currentIds}</Col>
        </Row>,
      );
    });

    RmsConfirm({
      content: (
        <div>
          <Row>{formatMessage({ id: 'app.message.batchDelete.confirm' })}</Row>
          {_data}
        </div>
      ),
      onOK: async () => {
        const response = await deleteResourceGroupMembers();
        if (!dealResponse(response, 1)) {
          onRefresh();
        }
      },
    });
  }

  const menu = (
    <Menu onClick={onContextMenu}>
      <Menu.Item key="add" disabled={selectedRowKeys?.length === 0}>
        <FormattedMessage id="resourceGroup.add" />
      </Menu.Item>
      <Menu.Item key="edit" disabled={groupData?.length === 0}>
        <FormattedMessage id="resourceGroup.editPriority" />
      </Menu.Item>
      <Menu.Item key="deleteMember" disabled={selectedRowKeys?.length === 0}>
        <FormattedMessage id="resourceGroup.deleteMember" />
      </Menu.Item>
      <Menu.Item key="deleteGroup" disabled={groupData?.length === 0}>
        <FormattedMessage id="resourceGroup.delete" />
      </Menu.Item>
    </Menu>
  );
  return (
    <>
      <Dropdown.Button overlay={menu}>
        <FormattedMessage id="resourceGroup.operate" />
      </Dropdown.Button>

      <ResourceGroupModal
        visible={groupVisible}
        title={title}
        currentType={currentType}
        mapId={mapId}
        groupData={groupData}
        members={selectedRowKeys}
        groupType={groupType}
        onOk={onRefresh}
        onCancel={() => {
          setGroupVisible(false);
        }}
      />
    </>
  );
}
export default memo(ResourceGroupOperateComponent);
