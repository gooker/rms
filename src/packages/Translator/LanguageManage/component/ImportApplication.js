import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { formatMessage } from '@/utils/Lang';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};

export default class ImportApplication extends Component {
  formRef = React.createRef();
  
  onSubmitApplicate = () => {
    const { validateFields } = this.formRef.current;
    const { onAddApplicate } = this.props;
    validateFields().then((allValues) => {
      onAddApplicate(allValues);
    });
  };

  render() {
    return (
      <div>
        <Form {...formItemLayout} ref={this.formRef}>
          <Form.Item
            name="type"
            label={formatMessage({ id: 'translator.languageManage.langtype' })}
            rules={[{ required: true, validator: this.typeValidator }]}
          >
            <Input />
          </Form.Item>
          <Button style={{ margin: '70px 0 0 330px' }} onClick={this.onSubmitApplicate} type="primary">
            {formatMessage({ id: 'app.button.save' })}
          </Button>
        </Form>
      </div>
    );
  }
}
