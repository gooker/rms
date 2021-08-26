import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { formatMessage } from '@/utils/Lang';
import ImportI18nLanguage from './ImportI18nLanguage';
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};

export default class AddApplication extends Component {
  formRef = React.createRef();

  typeValidator = (_, value) => {
    // 大小写 下划线
    var regex = /^[A-Za-z_-]+$/gi;
    if (value && !regex.test(value)) {
      return Promise.reject(
        new Error(formatMessage({ id: 'translator.languageManage.langtypeValidate' })),
      );
    }
    return Promise.resolve();
  };

  submitApplication = () => {
    const { validateFields } = this.formRef.current;
    const { addApplicateChange } = this.props;
    validateFields().then((allValues) => {
      addApplicateChange(allValues);
    });
  };
  render() {
    return (
      <div>
        <Form {...formItemLayout} ref={this.formRef}>
          <Form.Item
            name="code"
            label={'code'}
            rules={[{ required: true }, { validator: this.typeValidator }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={formatMessage({ id: 'translator.languageManage.name' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label={formatMessage({ id: 'translator.languageManage.langFile' })}
            name="i18n"
            rules={[{ required: true, message: '请上传文件' }]}
          >
            <ImportI18nLanguage accept={'.xlsx,.xls'} />
          </Form.Item>

          <Button
            style={{ margin: '30px 0 0 47%' }}
            onClick={this.submitApplication}
            type="primary"
          >
            {formatMessage({ id: 'app.button.save' })}
          </Button>
        </Form>
      </div>
    );
  }
}
