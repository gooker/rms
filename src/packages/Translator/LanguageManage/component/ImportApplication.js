import React, { Component } from 'react';
import { Form, Radio, Button, Select } from 'antd';
import { formatMessage } from '@/utils/Lang';
import ImportI18nLanguage from './ImportI18nLanguage';

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
  state = {
    displayMode: 'standard',
  };

  onModeChange = (e) => {
    this.setState({
      displayMode: e.target.value,
    });
  };

  onSubmitApplicate = () => {
    const { validateFields } = this.formRef.current;
    const { importApplicate } = this.props;
    validateFields().then((allValues) => {
      importApplicate(allValues);
    });
  };

  render() {
    const { appList, appCode } = this.props;
    const { displayMode } = this.state;
    return (
      <div>
        <Form {...formItemLayout} ref={this.formRef}>
          <Form.Item
            name="appCode"
            label={formatMessage({ id: 'translator.languageManage.application' })}
            initialValue={appCode}
            rules={[{ required: true }]}
          >
            <Select disabled={true}>
              {appList.map((record) => {
                return (
                  <Select.Option key={record.code} value={record.code}>
                    {record.name}
                  </Select.Option>
                );
              })}
            </Select>
          </Form.Item>
          <Form.Item
            name="displayMode"
            label={formatMessage({ id: 'translator.languageManage.displayMode' })}
            initialValue={displayMode}
            rules={[{ required: true }]}
          >
            <Radio.Group onChange={this.onModeChange}>
              <Radio value="standard">
                {formatMessage({ id: 'translator.languageManage.standard' })}
              </Radio>
              <Radio value="custom">
                {formatMessage({ id: 'translator.languageManage.custom' })}
              </Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label={formatMessage({ id: 'translator.languageManage.langFile' })}
            name="languages"
            rules={[{ required: true }]}
          >
            <ImportI18nLanguage accept={'.xlsx,.xls'} type={'addApp'} onabc={this.abv}/>
          </Form.Item>
          <Button
            style={{ margin: '70px 0 0 330px' }}
            onClick={this.onSubmitApplicate}
            type="primary"
          >
            {formatMessage({ id: 'app.button.save' })}
          </Button>
        </Form>
      </div>
    );
  }
}
