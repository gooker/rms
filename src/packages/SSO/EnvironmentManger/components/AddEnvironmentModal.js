import React, { Component } from 'react';
import { Form, Row, Col, Input, Radio, Select, Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';
import DynamicForm from '@/components/DynamicForm/Index';
import { ApiNameSpace } from '@/config/config';
const { DynamicFormCol } = DynamicForm;
const formLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

export default class AddEnvironmentModal extends Component {
  formRef = React.createRef();

  componentDidMount() {
    const { setFieldsValue } = this.formRef.current;
    setFieldsValue({ flag: '1' });
  }

  validatoAdditionalInfosr = (rule, value, callback) => {
    if (value) {
      const { keys, key, name } = value;
      const additionalInfos = [];
      for (let index = 0; index < keys.length; index++) {
        const element = keys[index];
        if (
          key[element] === '' ||
          key[element] == null ||
          name[element] == null ||
          name[element] === ''
        ) {
          callback(formatMessage({ id: 'app.environmentManager.tip.formNotComplete' }));
          return false;
        }
        additionalInfos.push({
          key: key[element],
          value: name[element],
        });
      }
      callback();
    }
    callback();
  };

  submit=()=>{
    const { validateFields } = this.formRef.current;
    const { onSubmit } = this.props;
    validateFields().then((allValues) => {
      onSubmit(allValues);
    });
  }

  render() {
    return (
      <div>
        <Form ref={this.formRef}>
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
          <Form.Item
            label={<FormattedMessage id="environmentManager.extraInfo" />}
            name="additionalInfos"
            rules={[{ validator: this.validatoAdditionalInfosr }]}
          >
            <DynamicForm formItem={formLayout}>
              <DynamicFormCol field="key" col={{ span: 18 }}>
                <Select>
                  {ApiNameSpace.map((item) => (
                    <Select.Option
                      key={item}
                      value={item}
                      placeholder={formatMessage({
                        id: 'environmentManager.require.key',
                      })}
                    >
                      {item}
                    </Select.Option>
                  ))}
                </Select>
              </DynamicFormCol>
              <DynamicFormCol field="value" col={{ span: 18 }}>
                <Input
                  placeholder={formatMessage({
                    id: 'environmentManager.require.value',
                  })}
                />
              </DynamicFormCol>
            </DynamicForm>
          </Form.Item>
        </Form>
        <div
          style={{
            marginTop: 60,
            textAlign: 'center',
            background: 'transparent',
            borderTop: '1px solid #e8e8e8',
            padding: '10px 16px',
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
