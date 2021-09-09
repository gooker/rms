import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/Lang';
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};

export default class UpdatePassword extends Component {
  formRef = React.createRef();
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
        <Form {...formItemLayout} ref={this.formRef}>
          <Form.Item
            label={<FormattedMessage id="sso.user.account.password" />}
            name="password"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input.Password autoComplete="off" type="password" />
          </Form.Item>
          <Form.Item
            label={<FormattedMessage id="sso.user.account.password2" />}
            name="surePassword"
            dependencies={['password']}
            rules={[
              {
                required: true,
              },
              {
                validator: (_, value) => {
                  const { getFieldValue } = this.formRef.current;
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      formatMessage({ id: 'sso.user.require.passwordConsistent', format: false }),
                    ),
                  );
                },
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
