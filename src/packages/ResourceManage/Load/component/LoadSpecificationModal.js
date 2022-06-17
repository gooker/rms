/* TODO: I18N */
import React, { memo, useEffect } from 'react';
import { Modal, Form, Select, Input } from 'antd';
import {
  isNull,
  formatMessage,
  getFormLayout,
  dealResponse,
  getRandomString,
  isStrictNull,
} from '@/utils/util';
import { saveLoadSpecification } from '@/services/resourceService';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(5, 16);

function LoadSpecificationModal(props) {
  const { visible, onCancel, onOk, updateRecord, allLoadType, allData } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function validateDuplicateName(_, value) {
    const existNames = allData?.map(({ name }) => name);
    if (!value || !existNames.includes(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.form.name.duplicate' })));
  }

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        const response = await saveLoadSpecification({ ...values });
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
        <Form.Item hidden name={'id'} initialValue={updateRecord?.id} />
        <Form.Item
          hidden
          name="code"
          initialValue={updateRecord?.code ?? `Specification_Code_${getRandomString(6)}`}
        />

        <Form.Item
          label={formatMessage({ id: 'app.common.name' })}
          name="name"
          initialValue={updateRecord?.name}
          rules={[{ required: true }, { validator: validateDuplicateName }]}
        >
          <Input disabled={!isStrictNull(updateRecord)} />
        </Form.Item>
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
