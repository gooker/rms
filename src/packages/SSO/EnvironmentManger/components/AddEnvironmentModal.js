import React, { PureComponent } from 'react';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { AutoComplete, Button, Col, Form, Input, Radio, Row } from 'antd';
import { formatMessage, getFormLayout, isStrictNull, validateUrl } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { NameSpace } from '@/config/config';

const { formItemLayout } = getFormLayout(4, 18);
const ApiNameSpace = [NameSpace.Platform, NameSpace.SSO, NameSpace.WS];

class AddEnvironmentModal extends PureComponent {
  componentDidMount() {
    const { formRef, updateRow } = this.props;
    const { setFieldsValue } = formRef.current;
    if (updateRow) {
      setFieldsValue({
        envName: updateRow.envName,
        flag: updateRow.flag,
        additionalInfos: updateRow.additionalInfos,
      });
    } else {
      setFieldsValue({ flag: '0' });
    }
  }

  urlValidator(_, value) {
    if (!isStrictNull(value) && validateUrl(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'environmentManager.url.invalid' })));
  }

  render() {
    const { formRef } = this.props;
    return (
      <Form ref={formRef} {...formItemLayout}>
        <Form.Item
          label={<FormattedMessage id='environmentManager.envName' />}
          name='envName'
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id='environmentManager.isDefault' />}
          name='flag'
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value='0'>
              <FormattedMessage id='app.common.false' />
            </Radio>
            <Radio value='1'>
              <FormattedMessage id='app.common.true' />
            </Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item required label={formatMessage({ id: 'environmentManager.apis' })}>
          <Form.List name={'additionalInfos'}>
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item required key={field.key}>
                    <Row gutter={10}>
                      <Col>
                        <Form.Item
                          noStyle
                          {...field}
                          name={[field.name, 'key']}
                          label={formatMessage({ id: 'app.configInfo.header.moduleName' })}
                          rules={[{ required: true }]}
                        >
                          <AutoComplete style={{ width: 120 }}>
                            {ApiNameSpace.map((item) => (
                              <AutoComplete.Option key={item} value={item}>
                                {item}
                              </AutoComplete.Option>
                            ))}
                          </AutoComplete>
                        </Form.Item>
                      </Col>
                      <Col flex={1}>
                        <Form.Item
                          noStyle
                          {...field}
                          name={[field.name, 'value']}
                          label={formatMessage({ id: 'app.configInfo.header.moduleURL' })}
                          rules={[{ required: true }, { validator: this.urlValidator }]}
                        >
                          <Input />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        {fields.length > 1 ? (
                          <Button onClick={() => remove(field.name)} icon={<MinusOutlined />} />
                        ) : null}
                      </Col>
                    </Row>
                  </Form.Item>
                ))}
                <Form.Item>
                  <Button type='dashed' onClick={() => add()} style={{ width: '60%' }}>
                    <PlusOutlined />
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form.Item>
      </Form>
    );
  }
}
export default AddEnvironmentModal;
