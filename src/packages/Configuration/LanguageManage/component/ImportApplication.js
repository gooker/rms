import React, { memo } from 'react';
import { Form, Radio } from 'antd';
import { getFormLayout } from '@/utils/util';
import ImportI18nLanguage from './ImportI18nLanguage';
import FormattedMessage from '@/components/FormattedMessage';
import CommonModal from '@/components/CommonModal';

const { formItemLayout } = getFormLayout(5, 16);

const ImportApplication = (props) => {
  const { visible, onCancel, onOk } = props;
  const [formRef] = Form.useForm();

  function onSubmit() {
    formRef
      .validateFields()
      .then((allValues) => {
        formRef.resetFields();
        onOk(allValues);
      })
      .catch(() => {});
  }

  return (
    <CommonModal
      title={<FormattedMessage id="app.button.import" />}
      width={600}
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit}
    >
      <Form {...formItemLayout} form={formRef}>
        <Form.Item
          name="merge"
          label={<FormattedMessage id="translator.languageManage.importType" />}
          initialValue={true}
          rules={[{ required: true }]}
        >
          <Radio.Group optionType="button" buttonStyle="solid">
            <Radio value={true}>
              <FormattedMessage id="translator.languageManage.merge" />
            </Radio>
            <Radio value={false}>
              <FormattedMessage id="translator.languageManage.replace" />
            </Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label={<FormattedMessage id="app.common.file" />}
          name="languages"
          rules={[
            {
              required: true,
              message: <FormattedMessage id="translator.languageManage.uploadFile" />,
            },
          ]}
        >
          <ImportI18nLanguage accept={'.xlsx,.xls'} type={'addApp'} />
        </Form.Item>
      </Form>
    </CommonModal>
  );
};
export default memo(ImportApplication);
