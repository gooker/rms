import React, { Component } from 'react';
import { Form, Radio, Button, Select, Modal } from 'antd';
import { adjustModalWidth } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import ImportI18nLanguage from './ImportI18nLanguage';

const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 15,
  },
};
const modalWidth = adjustModalWidth() * 0.6;
export default class ImportApplicationModal extends Component {
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
    const { appList, appCode, visible, onCancel } = this.props;
    const { displayMode } = this.state;
    return (
      <>
        <Modal
          title={
            <>
              <FormattedMessage id="translator.languageManage.attention" />
              <span style={{ fontSize: '15px', color: '#faad14' }}>
                <FormattedMessage id="translator.languageManage.importTips" />
              </span>
            </>
          }
          width={modalWidth}
          footer={null}
          destroyOnClose
          visible={visible}
          onCancel={onCancel}
        >
          <Form {...formItemLayout} ref={this.formRef}>
            <Form.Item
              name="appCode"
              label={<FormattedMessage id="translator.languageManage.application" />}
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
              name="type"
              label={<FormattedMessage id="translator.languageManage.displayMode" />}
              initialValue={displayMode}
              rules={[{ required: true }]}
            >
              <Radio.Group onChange={this.onModeChange}>
                <Radio value="standard">
                  {<FormattedMessage id="translator.languageManage.standard" />}
                </Radio>
                <Radio value="custom">
                  {<FormattedMessage id="translator.languageManage.custom" />}
                </Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item
              label={<FormattedMessage id="translator.languageManage.langFile" />}
              name="languages"
              rules={[
                {
                  required: true,
                  message: <FormattedMessage id="translator.languageManage.uploadfile" />,
                },
              ]}
            >
              <ImportI18nLanguage accept={'.xlsx,.xls'} type={'addApp'}  />
            </Form.Item>
            <Button
              style={{ margin: '70px 0 0 48%' }}
              onClick={this.onSubmitApplicate}
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
