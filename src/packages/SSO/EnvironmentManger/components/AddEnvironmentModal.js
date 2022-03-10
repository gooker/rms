import React, { Component } from 'react';
import { Form, Input, Radio, Select, Button, Col, Row } from 'antd';
import { formatMessage, getFormLayout, isStrictNull, validateUrl } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { ApiNameSpace } from '@/config/config';
import MenuIcon from '@/utils/MenuIcon';
import { PlusOutlined } from '@ant-design/icons';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(4, 18);

class AddEnvironmentModal extends Component {
  formRef = React.createRef();

  state = {
    updateInfos: [],
  };

  componentDidMount() {
    const { updateRow } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (isStrictNull(updateRow)) {
      setFieldsValue({ flag: '1' });
    } else {
      setFieldsValue({
        envName: updateRow[0].envName,
        flag: updateRow[0].flag,
        additionalInfos: updateRow[0].additionalInfos,
      });
      this.setState({ updateInfos: updateRow[0].additionalInfos });
    }
  }

  submit = () => {
    const { validateFields } = this.formRef.current;
    const { onSubmit } = this.props;
    validateFields()
      .then((allValues) => {
        onSubmit(allValues);
      })
      .catch(() => {});
  };

  urlValidator(_, value) {
    if (!isStrictNull(value) && validateUrl(value)) {
      return Promise.resolve();
    }
    return Promise.reject(new Error(formatMessage({ id: 'environmentManager.url.invalid' })));
  }

  render() {
    const { updateRow } = this.props;
    return (
      <div>
        <Form ref={this.formRef} {...formItemLayout}>
          <Form.Item
            label={<FormattedMessage id="environmentManager.envName" />}
            name="envName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="environmentManager.isDefault" />}
            name="flag"
            rules={[{ required: true }]}
          >
            <Radio.Group>
              <Radio value="0">
                <FormattedMessage id="app.common.false" />
              </Radio>
              <Radio value="1">
                <FormattedMessage id="app.common.true" />
              </Radio>
            </Radio.Group>
          </Form.Item>
          <Form.List
            name={'additionalInfos'}
            initialValue={updateRow ? updateRow[0].additionalInfos : [{ key: null, value: null }]}
          >
            {(fields, { add, remove }, { errors }) => (
              <>
                {fields.map((field, index) => (
                  <Form.Item
                    {...(index === 0 ? formItemLayout : formItemLayoutNoLabel)}
                    label={index === 0 ? <FormattedMessage id="environmentManager.apis" /> : ''}
                    required={true}
                    key={field.key}
                  >
                    <Row gutter={10}>
                      <Col span={10}>
                        <Form.Item
                          noStyle
                          {...field}
                          name={[field.name, 'key']}
                          label={formatMessage({ id: 'app.configInfo.header.moduleName' })}
                          rules={[{ required: true }]}
                        >
                          <Select
                            placeholder={formatMessage({
                              id: 'environmentManager.module.required',
                            })}
                          >
                            {ApiNameSpace.map((item) => (
                              <Select.Option key={item} value={item}>
                                {item}
                              </Select.Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={10}>
                        <Form.Item
                          noStyle
                          {...field}
                          name={[field.name, 'value']}
                          label={formatMessage({ id: 'app.configInfo.header.moduleURL' })}
                          rules={[{ required: true }, { validator: this.urlValidator }]}
                        >
                          <Input
                            placeholder={formatMessage({
                              id: 'environmentManager.url.required',
                            })}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={4} style={{ textAlign: 'center' }}>
                        {fields.length > 1 ? (
                          <Button
                            type="danger"
                            icon={MenuIcon.delete}
                            onClick={() => remove(field.name)}
                          />
                        ) : null}
                      </Col>
                    </Row>
                  </Form.Item>
                ))}
                <Form.Item {...formItemLayoutNoLabel}>
                  <Button type="dashed" onClick={() => add()} style={{ width: '60%' }}>
                    <PlusOutlined />
                  </Button>
                  <Form.ErrorList errors={errors} />
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
        <div
          style={{
            marginTop: 20,
            textAlign: 'center',
            background: 'transparent',
            borderTop: '1px solid #e8e8e8',
            paddingTop: '20px',
          }}
        >
          <Button onClick={this.submit} type="primary">
            <FormattedMessage id="app.button.submit" />
          </Button>
        </div>
      </div>
    );
  }
}
export default AddEnvironmentModal;
