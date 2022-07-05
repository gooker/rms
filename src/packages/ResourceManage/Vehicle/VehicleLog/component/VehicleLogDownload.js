import React, { memo, useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';
import { LogFileTypes } from '@/config/consts';

const { formItemLayout } = getFormLayout(5, 17);
const VehicleLogDownload = (props) => {
  const { onCancel, visible, onSubmit } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        onSubmit(values);
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={formatMessage({ id: 'app.logDownload' })}
      maskClosable={false}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item
          name={'fileName'}
          label={formatMessage({ id: 'app.logDownload.fileName' })}
          rules={[{ required: true }]}
        >
          <Select>
            {LogFileTypes.map((type) => (
              <Select.Option key={type} value={type}>
                {type}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(VehicleLogDownload);
