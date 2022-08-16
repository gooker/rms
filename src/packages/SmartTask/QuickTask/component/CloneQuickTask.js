import React, { memo } from 'react';
import { Form, Input, Select } from 'antd';
import CommonModal from '@/components/CommonModal';
import { connect } from '@/utils/RmsDva';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import { saveQuickTask } from '@/services/smartTaskService';

const CloneQuickTask = (props) => {
  const { dispatch, copy, onCancel, quickTaskGroups } = props;
  const [formRef] = Form.useForm();

  const visible = !isNull(copy);

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        const requestBody = {
          ...values,
          desc: copy.desc,
          taskCode: copy.taskCode,
          variable: copy.variable,
          isNeedConfirm: copy.isNeedConfirm,
          isShared: false,
        };
        saveQuickTask(requestBody).then((response) => {
          if (!dealResponse(response)) {
            dispatch({ type: 'quickTask/getVisibleQuickTasks' });
            closeModal();
          }
        });
      })
      .catch(() => {
      });
  }

  function closeModal() {
    formRef.resetFields();
    dispatch({ type: 'quickTask/updateEditing', payload: null });
    onCancel();
  }

  return (
    <CommonModal
      title={`${formatMessage('app.button.copy')}${formatMessage('menu.quickTask')}`}
      visible={visible}
      onCancel={closeModal}
      onOk={submit}
    >
      <Form form={formRef}>
        <Form.Item
          name={'name'}
          label={formatMessage('app.common.name')}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name={'groupId'} label={formatMessage('app.common.groupName')}>
          <Select>
            {quickTaskGroups.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </CommonModal>
  );
};
export default connect(({ quickTask }) => ({
  quickTaskGroups: quickTask.quickTaskGroups,
}))(memo(CloneQuickTask));
