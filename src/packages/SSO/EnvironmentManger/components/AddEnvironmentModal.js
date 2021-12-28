import React, { Component } from 'react';
import { Form, Row, Col, Input, Radio, Select, Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage, isStrictNull } from '@/utils/utils';
import DynamicForm from '@/components/DynamicForm/Index';
import { ApiNameSpace } from '@/config/config';
const { DynamicFormCol } = DynamicForm;
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

  validatoAdditionalInfosr = (rule, values) => {
    if (values) {
      const additionalInfos = [];
      for (let index = 0; index < values.length; index++) {
        const element = values[index];
        if (isStrictNull(element.key) && isStrictNull(element.value)) {
          //  callback(formatMessage({ id: 'environmentManager.tip.formNotComplete' }));
          return false;
        }
        additionalInfos.push({
          key: element.key,
          value: element.value,
        });
      }
      return Promise.resolve();
    }
    return Promise.resolve();
  };

  submit = () => {
    const { validateFields } = this.formRef.current;
    const { onSubmit } = this.props;
    validateFields()
      .then((allValues) => {
        onSubmit(allValues);
      })
      .catch(() => {});
  };

  render() {
    const { updateRow } = this.props;
    return (
      <div>
        <Form ref={this.formRef}>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                label={<FormattedMessage id="environmentManager.envName" />}
                name="envName"
                rules={[
                  {
                    required: true,
                    message: formatMessage({ id: 'environmentManager.require.envName' }),
                  },
                ]}
              >
                <Input
                  placeholder={formatMessage({
                    id: 'environmentManager.require.envName',
                  })}
                />
              </Form.Item>
            </Col>
            <Col span={24}>
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
            </Col>
            <Col span={24}>
              <Form.Item
                label={<FormattedMessage id="environmentManager.extraInfo" />}
                name="additionalInfos"
                rules={[{ validator: this.validatoAdditionalInfosr }]}
                initialValue={updateRow ? updateRow[0].additionalInfos : []}
              >
                <DynamicForm>
                  <DynamicFormCol field="key" col={{ span: 9 }}>
                    <Select
                      placeholder={formatMessage({
                        id: 'environmentManager.require.key',
                      })}
                    >
                      {ApiNameSpace.map((item) => (
                        <Select.Option key={item} value={item}>
                          {item}
                        </Select.Option>
                      ))}
                    </Select>
                  </DynamicFormCol>
                  <DynamicFormCol field="value" col={{ span: 11, offset: 1 }}>
                    <Input
                      placeholder={formatMessage({
                        id: 'environmentManager.require.value',
                      })}
                    />
                  </DynamicFormCol>
                </DynamicForm>
              </Form.Item>
            </Col>
          </Row>
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
