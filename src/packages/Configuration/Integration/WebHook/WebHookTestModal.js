import React, { memo, useState } from 'react';
import { Form, Input, message } from 'antd';
import { isPlainObject } from 'lodash';
import { formatMessage, generateWebHookTestParam, getFormLayout } from '@/utils/util';
import CommonModal from '@/components/CommonModal';
import { testWebHook } from '@/services/commonService';

const { formItemLayout } = getFormLayout(4, 18);

const WebHookTestModal = (props) => {
  const { data, onCancel } = props;

  const [formRef] = Form.useForm();
  const [testLoading, setTestLoading] = useState(false);

  function sendTestRequest() {
    formRef
      .validateFields()
      .then((value) => {
        setTestLoading(true);
        const requestBody = generateWebHookTestParam(data, value);
        testWebHook(requestBody)
          .then((response) => {
            if (response[0].code === '0') {
              message.success(formatMessage('webHook.test.pass'));
            } else {
              message.error(response[0].message || formatMessage('webHook.test.pass'));
            }
          })
          .finally(() => {
            setTestLoading(false);
          });
      })
      .catch(() => {
      });
  }

  if (!isPlainObject(data?.body)) {
    return null;
  }
  return (
    <CommonModal
      visible
      title={formatMessage({ id: 'webHook.test' })}
      onOk={sendTestRequest}
      okText={formatMessage({ id: 'webHook.button.test' })}
      okButtonProps={{ loading: testLoading }}
      onCancel={onCancel}
    >
      <Form labelWrap form={formRef} {...formItemLayout} preserve={false}>
        {Object.entries(data.body).map(([fieldKey, fieldValue]) => (
          <Form.Item key={fieldKey} label={fieldKey} name={fieldKey} initialValue={fieldValue}>
            <Input />
          </Form.Item>
        ))}
      </Form>
    </CommonModal>
  );
};
export default memo(WebHookTestModal);
