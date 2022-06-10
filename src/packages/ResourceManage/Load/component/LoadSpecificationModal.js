/* TODO: I18N */
import React, { memo } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import { isNull, formatMessage, getFormLayout, dealResponse } from '@/utils/util';
import { saveLoadSpecification } from '@/services/resourceService';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(5, 16);

function LoadSpecificationModal(props) {
  const { visible, onCancel, onOk, updateRecord, allLoadType } = props;
  const [formRef] = Form.useForm();

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        let id = null;
        if (isNull()) {
          id = updateRecord.id;
        }
        const response = await saveLoadSpecification({ ...values, id });
        if (!dealResponse(response)) {
          onCancel();
          onOk();
        }
      })
      .catch(() => {});
  }
  return (
    <Modal
      destroyOnClose
      visible={visible}
      width={'500px'}
      title={
        isNull(updateRecord)
          ? formatMessage({ id: 'app.button.add' })
          : formatMessage({ id: 'app.button.edit' })
      }
      onCancel={onCancel}
      onOk={onSave}
    >
      <Form {...formItemLayout} form={formRef}>
        <Form.Item
          label={<FormattedMessage id="app.common.type" />}
          name="loadTypeCode"
          rules={[{ required: true }]}
          initialValue={updateRecord?.loadType?.code}
        >
          <Select allowClear style={{ width: '100%' }}>
            {allLoadType?.map(({ id, code, name }) => (
              <Select.Option key={id} value={code}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label={'长'}
          name="length"
          rules={[{ required: true }]}
          initialValue={updateRecord?.length}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label={'宽'}
          name="width"
          rules={[{ required: true }]}
          initialValue={updateRecord?.width}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label={'高'}
          name="height"
          rules={[{ required: true }]}
          initialValue={updateRecord?.height}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item label={'颜色'} name="color" initialValue={updateRecord?.color}>
          <Input allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(LoadSpecificationModal);
