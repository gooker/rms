/* TODO: I18N */
import React, { memo } from 'react';
import { Form, Input, Modal, Select, Switch } from 'antd';
import { formatMessage, getFormLayout } from '@/utils/util';

const { formItemLayout } = getFormLayout(4, 18);
const QuickTaskFormModal = (props) => {
  const { visible, onOk, onCancel } = props;

  const [formRef] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title={'创建快捷任务'}
      width={600}
      maskClosable={false}
      closable={false}
      onOk={onOk}
      onCancel={onCancel}
    >
      <Form labelWrap form={formRef} {...formItemLayout}>
        <Form.Item label={formatMessage({ id: 'app.common.name' })} name={'name'}>
          <Input />
        </Form.Item>
        <Form.Item label={formatMessage({ id: 'app.common.description' })} name={'desc'}>
          <Input />
        </Form.Item>
        <Form.Item label={'所属组别'} name={'groupId'}>
          <Select></Select>
        </Form.Item>
        <Form.Item label={'关联自定义任务'} name={'taskCode'}>
          <Select></Select>
        </Form.Item>
        <Form.Item label={'确认操作'} name={'isNeedConfirm'} valuePropName={'checked'}>
          <Switch />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(QuickTaskFormModal);
