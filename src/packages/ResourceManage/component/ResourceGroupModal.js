import React, { useEffect, useState } from 'react';
import { Modal, Form, AutoComplete, Select } from 'antd';
import { find } from 'lodash';
import { dealResponse, formatMessage, getFormLayout, getRandomString, isNull } from '@/utils/util';
import { saveResourceGroup, deleteResourceGroup } from '@/services/resourceService';
import ResourceGroupPriorityModal from './ResourceGroupPriorityModal';
const { formItemLayout } = getFormLayout(5, 18);

const rowIdMap = {
  STORE: 'id',
  LOAD: 'loadId',
  VEHICLE: 'vehicleId',
  CHARGER: 'chargerId',
  CHARGE_STRATEGY: 'code',
};

export default function ResourceGroupModal(props) {
  const { visible, title, groupType, currentType, members, allRows, onCancel, onOk } = props;
  const { mapId, groupData } = props;
  console.log(mapId);

  const [groupPriority, setGroupPriority] = useState([]);
  const [updateMembers, setUpdateMembers] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    } else {
      getPriority();
    }
  }, [visible]);

  function getPriority() {
    const newSource = [];

    if (currentType === 'add') {
      members?.map((item) => {
        const currentRow = find(allRows, { item });
        const memberId = rowIdMap[groupType] && currentRow ? currentRow[rowIdMap[groupType]] : item;
        newSource.push({ id: item, memberId, priority: 5 });
      });
    }

    setGroupPriority(newSource);
  }

  // 编辑
  function getMembersFromGroup(groupId) {
    const { members, priority = [], code, groupName } = find(groupData, { id: groupId });
    const newPriority = [];
    for (let key in priority) {
      newPriority.push({
        id: key,
        memberId: priority[key].memberId,
        priority: priority[key].priority,
      });
    }

    form.setFieldsValue({ code, groupName });
    setUpdateMembers(members);
    setGroupPriority(newPriority);
  }

  function onSubmit() {
    form
      .validateFields()
      .then(async (values) => {
        if (currentType === 'add') {
          onAdd(values);
        }

        if (currentType === 'edit') {
          onEdit(values);
        }

        if (currentType === 'deleteGroup') {
          onDeleteGroup(values);
        }
      })
      .catch(() => {});
  }

  async function onEdit(values) {
    let newAllPriorityObj = {};
    groupPriority.map(
      ({ id, memberId, priority }) =>
        (newAllPriorityObj[id] = {
          memberId,
          priority,
        }),
    );
    const params = {
      ...values,
      mapId,
      groupType,
      members: updateMembers,
      priority: newAllPriorityObj,
    };
    const response = await saveResourceGroup(params);
    if (!dealResponse(response, 1)) {
      onCancel();
      onOk();
    }
  }

  async function onDeleteGroup(values) {
    const { ids } = values;
    const deleteResponse = await deleteResourceGroup([...ids]);
    if (!dealResponse(deleteResponse, 1)) {
      onCancel();
      onOk();
    }
  }

  async function onAdd(values) {
    const { groupName } = values;
    const group = find(groupData, { groupName });

    let newMembers = [...members];
    let newAllPriorityObj = {};
    if (!isNull(group)) {
      newMembers = [...new Set([...group.members, ...members])];
      newAllPriorityObj = { ...group.priority };
    }
    groupPriority.map(
      ({ id, memberId, priority }) =>
        (newAllPriorityObj[id] = {
          memberId,
          priority,
        }),
    );

    const params = {
      ...values,
      mapId,
      groupType,
      id: group?.id,
      members: newMembers,
      priority: { ...newAllPriorityObj },
    };

    const response = await saveResourceGroup(params);
    if (!dealResponse(response, 1)) {
      onCancel();
      onOk();
    }
  }
  return (
    <Modal destroyOnClose visible={visible} onCancel={onCancel} title={title} onOk={onSubmit}>
      <Form form={form} {...formItemLayout}>
        {/* 编码 */}
        <Form.Item hidden name={'code'} initialValue={`${groupType}_${getRandomString(6)}`} />
        {currentType === 'add' && (
          <Form.Item
            name={'groupName'}
            label={formatMessage({ id: 'app.common.groupName' })}
            rules={[{ required: true }]}
          >
            <AutoComplete
              options={groupData?.map(({ groupName }) => {
                return { value: groupName };
              })}
              allowClear
            />
          </Form.Item>
        )}
        {currentType === 'edit' && (
          <>
            <Form.Item hidden name={'groupName'} />
            <Form.Item
              name={'id'}
              label={formatMessage({ id: 'app.common.groupName' })}
              rules={[{ required: true }]}
              getValueFromEvent={(e) => {
                getMembersFromGroup(e);
                return e;
              }}
            >
              <Select>
                {groupData?.map(({ groupName, id }) => (
                  <Select.Option key={id} value={id}>
                    {groupName}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </>
        )}

        {['deleteGroup'].includes(currentType) && (
          <Form.Item
            name={'ids'}
            label={formatMessage({ id: 'app.common.groupName' })}
            rules={[{ required: true }]}
          >
            <Select mode={'multiple'}>
              {groupData?.map(({ groupName, id }) => (
                <Select.Option key={id} value={id}>
                  {groupName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        )}
      </Form>
      {['add', 'edit'].includes(currentType) && (
        <ResourceGroupPriorityModal data={groupPriority} onChange={setGroupPriority} />
      )}
    </Modal>
  );
}
