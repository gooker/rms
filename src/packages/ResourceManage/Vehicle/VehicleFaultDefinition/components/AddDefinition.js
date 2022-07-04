/*TODO: I18N*/
import React, { memo, useEffect } from 'react';
import { Modal, Form, Input, Switch } from 'antd';
import { isNull, formatMessage, getFormLayout, dealResponse, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout } = getFormLayout(6, 17);

function AddDefinition(props) {
  const { visible, onCancel, onOk, updateRecord, allData } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function onSave() {
    formRef
      .validateFields()
      .then(async (values) => {
        const response = await savexxxx({ ...values });
        if (!dealResponse(response)) {
          onCancel();
          onOk();
        }
      })
      .catch(() => {});
  }

  function validatCodeDuplicate(_, value) {
    const errorCodes = allData?.map(({ errorCode }) => errorCode);
    if (!value || !errorCodes.includes(value) || !isStrictNull(updateRecord)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.form.code.duplicate' })));
  }

  function validateNameDuplicate(_, value) {
    const errorNames = allData?.map(({ errorName }) => errorName);
    if (!value || !errorNames.includes(value) || !isStrictNull(updateRecord)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'app.form.name.duplicate' })));
  }

  return (
    <Modal
      destroyOnClose
      visible={visible}
      width={'580px'}
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
          label={formatMessage({ id: 'app.fault.code' })}
          name="errorCode"
          rules={[{ required: true }, { validator: validatCodeDuplicate }]}
          initialValue={updateRecord?.errorCode}
        >
          <Input allowClear disabled={!isNull(updateRecord)} />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'app.fault.name' })}
          name="errorName"
          rules={[{ required: true }, { validator: validateNameDuplicate }]}
          initialValue={updateRecord?.errorName}
        >
          <Input allowClear disabled={!isNull(updateRecord)} />
        </Form.Item>

        <Form.Item
          label={formatMessage({ id: 'app.fault.level' })}
          name="level"
          initialValue={updateRecord?.level}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label={formatMessage({ id: 'app.fault.type' })}
          name="errorType"
          initialValue={updateRecord?.errorType}
        >
          <Input allowClear />
        </Form.Item>
        <Form.Item
          label={'自动恢复'}
          name="autoRecover"
          initialValue={updateRecord?.autoRecover ?? false}
          valuePropName={'checked'}
        >
          <Switch allowClear />
        </Form.Item>
        <Form.Item
          label={'故障附加数据1'}
          name="preDataDefinition"
          initialValue={updateRecord?.preDataDefinition}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label={'故障附加数据2'}
          name="curDataDefinition"
          initialValue={updateRecord?.curDataDefinition}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label={<FormattedMessage id="app.common.description" />}
          name="description"
          initialValue={updateRecord?.description}
        >
          <Input allowClear />
        </Form.Item>

        <Form.Item
          label={'额外信息'}
          name="additionalContent"
          initialValue={updateRecord?.additionalContent}
        >
          <Input allowClear />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default memo(AddDefinition);
