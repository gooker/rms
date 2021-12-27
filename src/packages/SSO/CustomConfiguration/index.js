import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import LogoUploader from './LogoUploader/LogoUploader';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';

const formItemLayout = {
  labelCol: {
    sm: { span: 5 },
  },
  wrapperCol: {
    sm: { span: 19 },
  },
};

export default class customConfiguration extends Component {
  formRef = React.createRef();
  deleteLogo = () => {
    const {
      current: { setFieldsValue },
    } = this.formRef;
    setFieldsValue({ logo: null });
  };

  submit=()=>{
    const { validateFields } = this.formRef.current;
    validateFields()
      .then((value) => {
          console.log(value);
      })
  }
  render() {
    return (
      <div className={commonStyles.commonPageStyle}>
        <Form ref={this.formRef} {...formItemLayout}>
          <Form.Item
            label={<FormattedMessage id="app.microApp.label.copyRight" />}
            name="copyRight"
          >
            <Input allowClear style={{ width: '60%' }} />
          </Form.Item>
          <Form.Item label={<FormattedMessage id="app.microApp.label.logo" />} name="logo">
            <LogoUploader clear={this.deleteLogo} />
          </Form.Item>
        </Form>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
          <Button type="primary" onClick={this.submit}>
            <FormattedMessage id="sso.init.upload" />
          </Button>
        </div>
      </div>
    );
  }
}
