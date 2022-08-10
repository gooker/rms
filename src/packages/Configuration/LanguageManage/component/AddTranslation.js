import React, { memo, useEffect } from 'react';
import { Form, Input, Radio, Space } from 'antd';
import CommonModal from '@/components/CommonModal';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage } from '@/utils/util';
import { updateSysTranslation } from '@/services/translationService';

const AddTranslation = (props) => {
  const { visible, onCancel, appCode } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (visible) {
      formRef.setFieldsValue({ appCode });
    } else {
      formRef.resetFields();
    }
  }, [visible]);

  function submit() {
    const requestBody = { appCode, merge: true, translationDetail: {} };
    updateSysTranslation(requestBody).then((response) => {
      if (!dealResponse(response, true)) {
        onCancel();
      }
    });
  }

  return (
    <CommonModal
      title={formatMessage('translator.addRow')}
      visible={visible}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form form={formRef}>
        <Form.Item name={'appCode'} label={<FormattedMessage id="app.module" />}>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            options={[
              {
                label: formatMessage({ id: 'translator.languageManage.frontend' }),
                value: 'FE',
              },
              {
                label: formatMessage({ id: 'translator.languageManage.backend' }),
                value: 'BE',
              },
            ]}
          />
        </Form.Item>

        <Form.Item name={'key'} label={'Key'}>
          <Input />
        </Form.Item>

        <Form.List name="value" label={'Value'}>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Space
                  key={key}
                  style={{
                    display: 'flex',
                    marginBottom: 8,
                  }}
                  align="baseline"
                >
                  <Form.Item
                    {...restField}
                    name={[name, 'key']}
                    rules={[{ required: true, message: 'Missing Key' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'value']}
                    rules={[{ required: true, message: 'Missing last name' }]}
                  >
                    <Input />
                  </Form.Item>
                </Space>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </CommonModal>
  );
};
export default memo(AddTranslation);
