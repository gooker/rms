import React, { memo, useEffect } from 'react';
import { Modal, Form, Select } from 'antd';
import { dealResponse, getFormLayout } from '@/utils/util';
import { initStorage } from '@/services/resourceService';
import FormattedMessage from '@/components/FormattedMessage';
import { allStorageType } from './storage';
const { formItemLayout } = getFormLayout(5, 15);

function ResourceGroupModal(props) {
  const { visible, title, onCancel, onOk, record } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  function onSubmit() {
    form
      .validateFields()
      .then(async (values) => {
        const params = { ...values };
        const response = await initStorage(params);
        if (!dealResponse(response, 1)) {
          onCancel();
          onOk();
        }
      })
      .catch(() => {});
  }

  return (
    <Modal destroyOnClose visible={visible} onCancel={onCancel} title={title} onOk={onSubmit}>
      <Form form={form} {...formItemLayout}>
        <Form.Item hidden name={'id'} initialValue={record?.id} />

        <Form.Item
          label={<FormattedMessage id="app.common.type" />}
          name="storageType"
          rules={[{ required: true }]}
          initialValue={record?.storageType}
        >
          <Select allowClear style={{ width: '100%' }}>
            {allStorageType?.map(({ label, code }) => (
              <Select.Option key={code} value={code}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default memo(ResourceGroupModal);
