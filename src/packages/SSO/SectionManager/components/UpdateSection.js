import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/Lang';

export default class UpdateSection extends Component {
  formRef = React.createRef();

  componentDidMount() {
    const { selectRow, updateFlag } = this.props;
    const { setFieldsValue } = this.formRef.current;
    if (updateFlag) {
      const currentRecord = selectRow[0];
      const params = {
        sectionName: currentRecord.sectionName,
        sectionId: currentRecord.sectionId,
        name: currentRecord.name,
        password: currentRecord.password,
      };
      setFieldsValue({ ...params });
    }
  }

  typeValidator = (_, value) => {
    // 数字
    var regex = /^[0-9A]+$/gi;
    if (value && !regex.test(value)) {
      return Promise.reject(new Error(formatMessage({ id: 'section.idvalidate', format: false })));
    }
    return Promise.resolve();
  };

  submit = () => {
    const { validateFields } = this.formRef.current;
    const { onSubmit } = this.props;
    validateFields().then((allValues) => {
      onSubmit(allValues);
    });
  };
  render() {
    return (
      <div>
        <Form ref={this.formRef} layout={'vertical'}>
          <Form.Item
            label={formatMessage({ id: 'app.common.name' })}
            name="sectionName"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.common.sectionId' })}
            name="sectionId"
            rules={[
              {
                required: true,
              },
              { validator: this.typeValidator },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'section.mqUser' })}
            name="name"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input
              autoComplete="off"
              readOnly
              onFocus={() => {
                const { getFieldInstance } = this.formRef.current;
                const ev = getFieldInstance('name');
                if (ev && ev.input) {
                  ev.input.readOnly = false;
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="section.mqPassword" />}
            name="password"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'section.password.required' }),
              },
            ]}
          >
            <Input.Password autoComplete="off" type="password" />
          </Form.Item>
        </Form>
        <div
          style={{
            marginTop: 60,
            textAlign: 'center',
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
