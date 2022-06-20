/*TODO: I18N*/
import React, { useEffect, useState } from 'react';
import { Modal, Form, AutoComplete, message, Select } from 'antd';
import { dealResponse, formatMessage, getFormLayout, getRandomString, isNull } from '@/utils/util';
import { fetchActiveMap } from '@/services/commonService';
import {
  saveResourceGroup,
  fetchResourceGroup,
  deleteResourceGroup,
} from '@/services/resourceService';
import ResourceGroupPriorityModal from './ResourceGroupPriorityModal';
import { find } from 'lodash';
const { formItemLayout } = getFormLayout(5, 18);

export default function ResourceGroupModal(props) {
  const { visible, title, groupType, currentType, members, onCancel, onOk } = props;
  const { mapId, groupData } = props;

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
        newSource.push({ id: item, priority: 5 });
      });
    }

    setGroupPriority(newSource);
  }

  function getMembersFromGroup(groupId) {
    const { members, priority } = find(groupData, { id: groupId });
    const newPriority = [];
    for (let key in priority) {
      newPriority.push({
        id: key,
        priority: priority[key],
      });
    }
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
    const { ids } = values;
    let newAllPriorityObj = {};
    groupPriority.map(({ id, priority }) => (newAllPriorityObj[id] = priority));
    const params = {
      mapId,
      groupType,
      groupId: ids,
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
    groupPriority.map(({ id, priority }) => (newAllPriorityObj[id] = priority));
    
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

        {['deleteGroup', 'edit'].includes(currentType) && (
          <Form.Item
            name={'ids'}
            label={formatMessage({ id: 'app.common.groupName' })}
            rules={[{ required: true }]}
            getValueFromEvent={(e) => {
              getMembersFromGroup(e);
              return e;
            }}
          >
            <Select mode={currentType === 'deleteGroup' ? 'multiple' : ''}>
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
