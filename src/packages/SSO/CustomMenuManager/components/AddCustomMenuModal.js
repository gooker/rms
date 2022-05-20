import React, { memo } from 'react';
import { Form, Input, Select, Modal } from 'antd';
import { formatMessage, getFormLayout, isStrictNull } from '@/utils/util';

const { formItemLayout } = getFormLayout(4, 18);

const AddCustomMenuModal = (props) => {
  const { onSave, visible, onClose, editRecord, parentPath, appCode } = props;
  const [formRef] = Form.useForm();

  function submit() {
    formRef
      .validateFields()
      .then((allValues) => {
        onSave(allValues);
        onClose();
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={isStrictNull(editRecord) ? '新增' : '编辑'}
      maskClosable={false}
      onCancel={onClose}
      onOk={submit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item hidden name="authority" initialValue={['ADMIN', 'SUPERMANAGER', 'MANAGER']}>
          <Select mode="tags" />
        </Form.Item>
        <Form.Item hidden name="parentPath" initialValue={editRecord?.parentPath ?? parentPath}>
          <Input />
        </Form.Item>
        <Form.Item hidden name="appCode" initialValue={editRecord?.appCode ?? appCode}>
          <Input />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'app.common.name' })}
          name="name"
          initialValue={editRecord?.name}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="url"
          label={'URL'}
          initialValue={editRecord?.url}
          rules={[{ required: true }, { type: 'url' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label={'key'}
          name="key"
          initialValue={editRecord?.key}
          rules={[
            { required: true },
            {
              validator: (_, value) => {
                var regex = /^[a-zA-Z]+$/gi;
                if (value && !regex.test(value)) {
                  return Promise.reject(
                    new Error(formatMessage({ id: 'sso.customMenu.key.tips', format: false })),
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(AddCustomMenuModal);
