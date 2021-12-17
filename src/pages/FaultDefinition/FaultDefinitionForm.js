import React, { memo, useState } from 'react';
import { Button, Form, Input, message, Switch } from 'antd';
import { dealResponse, formatMessage, getFormLayout, isNull } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { submitFaultDefinition } from '@/services/api';

const formLayout = getFormLayout(6, 18);

const FaultDefinitionForm = (props) => {
  const { agvType, refresh, onCancel, data } = props;

  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);

  function submit() {
    formRef.validateFields().then(async (values) => {
      setLoading(true);
      const requestParam = { ...values };
      if (!isNull(data)) {
        requestParam.id = data.id;
      }
      const response = await submitFaultDefinition(agvType, requestParam);
      if (!dealResponse(response)) {
        message.success(formatMessage({ id: 'app.message.operateSuccess' }));
        onCancel();
        refresh();
      } else {
        message.success(formatMessage({ id: 'app.message.operateFailed' }));
      }
    });
  }

  return (
    <Form form={formRef} {...formLayout.formItemLayout}>
      <Form.Item
        name={'errorCode'}
        label={formatMessage({ id: 'app.fault.code' })}
        initialValue={data?.errorCode}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'errorName'}
        label={formatMessage({ id: 'app.fault.name' })}
        initialValue={data?.errorName}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'level'}
        label={formatMessage({ id: 'app.fault.level' })}
        initialValue={data?.level}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'errorType'}
        label={formatMessage({ id: 'app.fault.type' })}
        initialValue={data?.errorType}
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'autoRecover'}
        label={formatMessage({ id: 'app.fault.autoRecover' })}
        initialValue={data?.autoRecover ?? false}
      >
        <Switch />
      </Form.Item>
      <Form.Item
        name={'preDataDefinition'}
        label={formatMessage({ id: 'app.fault.preDataDefinition' })}
        initialValue={data?.preDataDefinition}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'curDataDefinition'}
        label={formatMessage({ id: 'app.fault.curDataDefinition' })}
        initialValue={data?.curDataDefinition}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name={'description'}
        label={formatMessage({ id: 'app.fault.description' })}
        initialValue={data?.description}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item
        name={'additionalContent'}
        label={formatMessage({ id: 'app.fault.additionalData' })}
        initialValue={data?.additionalContent}
      >
        <Input.TextArea />
      </Form.Item>
      <Form.Item {...formLayout.formItemLayoutNoLabel}>
        <Button type={'primary'} onClick={submit} loading={loading} disabled={loading}>
          <FormattedMessage id={'app.button.submit'} />
        </Button>
        <Button style={{ marginLeft: 10 }} onClick={onCancel}>
          <FormattedMessage id={'app.button.cancel'} />
        </Button>
      </Form.Item>
    </Form>
  );
};
export default memo(FaultDefinitionForm);
