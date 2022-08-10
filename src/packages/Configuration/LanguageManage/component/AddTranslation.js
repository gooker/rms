import React, { memo, useEffect } from 'react';
import { Col, Form, Input, Radio, Row } from 'antd';
import CommonModal from '@/components/CommonModal';
import FormattedMessage from '@/components/FormattedMessage';
import { convertMapArrayToMap, dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { updateSysTranslation } from '@/services/translationService';
import { connect } from '@/utils/RmsDva';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(4, 18);
const AddTranslation = (props) => {
  const { visible, onCancel, appCode, systemLanguage } = props;
  const [formRef] = Form.useForm();

  useEffect(() => {
    if (visible) {
      const dynamicValue = systemLanguage.map(({ code }) => ({ key: code, value: null }));
      formRef.setFieldsValue({ appCode, value: dynamicValue });
    } else {
      formRef.resetFields();
    }
  }, [visible]);

  function submit() {
    formRef
      .validateFields()
      .then((values) => {
        const { appCode, key, value } = values;
        const requestBody = {
          appCode,
          merge: true,
          translationDetail: {
            [key]: convertMapArrayToMap(value),
          },
        };
        updateSysTranslation(requestBody).then((response) => {
          if (!dealResponse(response, true)) {
            onCancel();
          }
        });
      })
      .catch(() => {
      });
  }

  return (
    <CommonModal
      width={600}
      title={formatMessage('translator.addRow')}
      visible={visible}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item name={'appCode'} label={<FormattedMessage id='app.module' />}>
          <Radio.Group
            optionType='button'
            buttonStyle='solid'
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

        <Form.Item
          name={'key'}
          label={formatMessage('translator.key')}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.List name='value'>
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }, index) => (
                <Form.Item
                  key={key}
                  required
                  {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                  label={index === 0 ? formatMessage('translator.value') : ''}
                >
                  <Row key={key} gutter={8}>
                    <Col>
                      <Form.Item
                        noStyle
                        {...restField}
                        name={[name, 'key']}
                        rules={[
                          { required: true, message: formatMessage('translator.value.required') },
                        ]}
                      >
                        <Input style={{ width: 80 }} />
                      </Form.Item>
                    </Col>
                    <Col flex={1}>
                      <Form.Item
                        noStyle
                        {...restField}
                        name={[name, 'value']}
                        rules={[
                          { required: true, message: formatMessage('translator.value.required') },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form.Item>
              ))}
            </>
          )}
        </Form.List>
      </Form>
    </CommonModal>
  );
};
export default connect(({ global }) => ({
  systemLanguage: global.systemLanguage,
}))(memo(AddTranslation));
