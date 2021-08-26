import React, { Component } from 'react';
import { Form, Input, Button, Row, Col, Menu } from 'antd';
import { formatMessage } from '@/utils/Lang';
import HeaderDropdown from '@/components/HeaderDropdown';
import LocalsKeys from '@/locales/LocaleKeys';
import commonStyles from '@/common.module.less';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};

export default class AddSysLang extends Component {
  formRef = React.createRef();
  renderMenu = () => {
    this.selectedKeys = null;
    const { allLanguage } = this.props;
    const existKeys = Object.values(allLanguage).map(({ type }) => type);
    let menuData = [];

    Object.keys(LocalsKeys).forEach((key) => {
      if (!existKeys.includes(key)) {
        return menuData.push(<Menu.Item key={key}>{LocalsKeys[key]}</Menu.Item>);
      }
    });
    return (
      <Menu
        style={{ maxHeight: '350px', overflow: 'auto' }}
        selectedKeys={[this.selectedKey]}
        onClick={this.changeLang}
      >
        {menuData}
      </Menu>
    );
  };

  changeLang = (e) => {
    const { setFieldsValue } = this.formRef.current;
    const { key } = e;
    const name = LocalsKeys[key];
    setFieldsValue({
      type: key,
      name,
    });
  };

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

  onSubmitLang = () => {
    const { validateFields } = this.formRef.current;
    const { onAddLang } = this.props;
    validateFields().then((allValues) => {
      onAddLang(allValues);
    });
  };

  render() {
    return (
      <div>
        <Form {...formItemLayout} ref={this.formRef}>
          <Row style={{ marginBottom: 20 }}>
            <Col flex="auto" className={commonStyles.textRight}>
              <HeaderDropdown
                overlay={this.renderMenu}
                trigger={['click']}
                placement="bottomCenter"
              >
                <Button type="link">快捷方式</Button>
              </HeaderDropdown>
            </Col>
          </Row>
          <Form.Item
            name="type"
            label={formatMessage({ id: 'translator.languageManage.langtype' })}
            rules={[{ required: true }, { validator: this.typeValidator }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="name"
            label={formatMessage({ id: 'translator.languageManage.langname' })}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Button style={{ margin: '50px 0 0 47%' }} onClick={this.onSubmitLang} type="primary">
            {formatMessage({ id: 'app.button.save' })}
          </Button>
        </Form>
      </div>
    );
  }
}
