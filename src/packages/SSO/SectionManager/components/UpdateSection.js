import React, { Component } from 'react';
import { Button, Form, Input } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';

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
    const regex = /^[0-9A]+$/gi;
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
            name='sectionName'
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'app.form.sectionId' })}
            name='sectionId'
            rules={[{ required: true }, { validator: this.typeValidator }]}
          >
            <Input />
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
