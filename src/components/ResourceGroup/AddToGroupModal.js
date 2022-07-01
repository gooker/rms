import React, { memo, useEffect } from 'react';
import { Form, InputNumber, Modal, Select } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';

const { formItemLayout } = getFormLayout(4, 20);
const AddToGroupModal = (props) => {
  const { visible, groups, onCancel, onOk } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function submit() {
    formRef
      .validateFields()
      .then((value) => {
        onOk(value);
      })
      .catch(() => {});
  }

  return (
    <Modal
      visible={visible}
      title={formatMessage({ id: 'group.addResourceToGroup' })}
      maskClosable={false}
      onOk={submit}
      onCancel={onCancel}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'groups'}
          label={formatMessage({ id: 'resourceGroup.grouping' })}
          rules={[{ required: true }]}
        >
          <Select allowClear mode={'multiple'} style={{ width: '100%' }}>
            {groups.map(({ code, groupName }) => (
              <Select.Option key={code} value={code}>
                {groupName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name={'priority'}
          label={formatMessage({ id: 'app.common.priority' })}
          initialValue={5}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(AddToGroupModal);
