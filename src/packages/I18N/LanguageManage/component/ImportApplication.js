import React, { Component } from 'react';
import { Form, Radio, Button, Modal } from 'antd';
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
const modalWidth = 500;
export default class ImportApplicationModal extends Component {
  formRef = React.createRef();
  onSubmitApplicate = () => {
    const { validateFields } = this.formRef.current;
    const { importApplicate } = this.props;
    validateFields()
      .then((allValues) => {
        importApplicate(allValues);
      })
      .catch(() => {});
  };

  render() {
    const { visible, onCancel } = this.props;
    return (
      <>
        <Modal
          destroyOnClose
          title={<FormattedMessage id="app.button.import" />}
          width={modalWidth}
          footer={null}
          visible={visible}
          onCancel={onCancel}
        >
          <Form {...formItemLayout} ref={this.formRef}>
            <Form.Item
              name="merge"
              label={<FormattedMessage id="translator.languageManage.importType" />}
              initialValue={true}
              rules={[{ required: true }]}
            >
              <Radio.Group>
                <Radio value={true}>
                  <FormattedMessage id="translator.languageManage.merge" />
                </Radio>
                <Radio value={false}>
                  <FormattedMessage id="translator.languageManage.replace" />
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
              <ImportI18nLanguage accept={'.xlsx,.xls'} type={'addApp'} />
            </Form.Item>
            <Button
              style={{ margin: '20px 0 0 25%' }}
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
