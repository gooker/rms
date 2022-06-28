import React, { memo, useEffect, useState } from 'react';
import { Dropdown, Menu, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import GroupModal from './GroupModal';
import { fetchSectionMaps } from '@/services/XIHEService';
import { dealResponse, formatMessage } from '@/utils/util';
import { fetchResourceGroup } from '@/services/resourceService';

const GroupManager = (props) => {
  const { type } = props;

  const [mapId, setMapId] = useState(null);
  const [groups, setGroups] = useState([]);
  const [groupModalVisible, setGroupModalVisible] = useState(false);

  useEffect(() => {
    async function init() {
      const [sectionMaps] = await fetchSectionMaps();
      if (!dealResponse(sectionMaps)) {
        const activeMap = sectionMaps.filter((item) => item.activeFlag)[0];
        if (activeMap) {
          setMapId(activeMap.id);
          const allResourceGroups = await fetchResourceGroup({ mapId: activeMap.id });
        } else {
          message.error(formatMessage({ id: 'app.message.noActiveMap' }));
        }
      } else {
        message.error(formatMessage({ id: 'app.message.fetchMapFail' }));
      }
    }

    init();
  }, []);

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

  function primaryClick() {
    setGroupModalVisible(true);
  }

  return (
    <>
      <Dropdown.Button onClick={primaryClick} overlay={menu}>
        <PlusOutlined /> <FormattedMessage id={'group.addToGroup'} />
      </Dropdown.Button>

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
    </>
  );
};
export default memo(GroupManager);
