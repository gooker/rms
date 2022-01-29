import React, { Component } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import { adjustModalWidth, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ImportI18nLanguage from './ImportI18nLanguage';
const formItemLayout = {
  labelCol: {
    span: 4,
  },
  wrapperCol: {
    span: 16,
  },
};
const modalWidth = adjustModalWidth() * 0.6;

export default class AddApplication extends Component {
  formRef = React.createRef();

  typeValidator = (_, value) => {
    // 大小写 下划线
    var regex = /^[A-Za-z_-]+$/gi;
    if (value && !regex.test(value)) {
      return Promise.reject(
        new Error(
          formatMessage({ id: 'translator.languageManage.langtypeValidate', format: false }),
        ),
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
    const { onCancel, visible } = this.props;
    return (
      <>
        <Modal
          title={<FormattedMessage id="translator.languageManage.addapplication" />}
          destroyOnClose
          maskClosable={false}
          mask={true}
          width={modalWidth}
          onCancel={onCancel}
          footer={null}
          visible={visible}
        >
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
              label={<FormattedMessage id="app.common.name" />}
              rules={[{ required: true }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label={<FormattedMessage id="translator.languageManage.langFile" />}
              name="i18n"
            >
              <ImportI18nLanguage accept={'.xlsx,.xls'} />
            </Form.Item>

            <Button
              style={{ margin: '30px 0 0 47%' }}
              onClick={this.submitApplication}
              type="primary"
            >
              {<FormattedMessage id="app.button.save" />}
            </Button>
          </Form>
        </Modal>
      </>
    );
  }
}
