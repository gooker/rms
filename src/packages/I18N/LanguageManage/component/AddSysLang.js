import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Menu, Modal, Dropdown, Select } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import LocalsKeys from '@/locales/LocaleKeys';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};

export default class AddSysLangModal extends Component {
  formRef = React.createRef();

  renderOption = () => {
    const { existKeys } = this.props;
    let data = [];
    Object.keys(LocalsKeys).forEach((key) => {
      if (!existKeys.includes(key)) {
        return data.push(<Select.Option key={key}>{LocalsKeys[key]}</Select.Option>);
      }
    });
    return data;
  };

  changeLang = (e) => {
    const { setFieldsValue } = this.formRef.current;
    const { key } = e;
    const name = LocalsKeys[key];
    setFieldsValue({
      code: key,
      name,
    });
  };

  onSubmitLang = () => {
    const { validateFields } = this.formRef.current;
    const { onAddLang } = this.props;
    validateFields()
      .then((allValues) => {
        const currentValue = { ...allValues };
        currentValue.name = LocalsKeys[allValues.code];
        onAddLang(currentValue);
      })
      .catch(() => {});
  };

  render() {
    const { onCancel, visible } = this.props;
    return (
      <>
        {/*新增语言  */}
        <Modal
          title={<FormattedMessage id="translator.languageManage.addlanguage" />}
          destroyOnClose
          maskClosable={false}
          mask={true}
          width={420}
          onCancel={onCancel}
          footer={null}
          visible={visible}
        >
          <Form {...formItemLayout} ref={this.formRef}>
            <Form.Item
              name="code"
              label={<FormattedMessage id="translator.languageManage.langtype" />}
              rules={[{ required: true }]}
            >
              <Select style={{ width: '100%' }}>{this.renderOption()}</Select>
            </Form.Item>

            <Button style={{ margin: '30px 0 0 44%' }} onClick={this.onSubmitLang} type="primary">
              {<FormattedMessage id="app.button.save" />}
            </Button>
          </Form>
        </Modal>
      </>
    );
  }
}
