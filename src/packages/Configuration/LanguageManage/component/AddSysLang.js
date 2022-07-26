import React, { memo } from 'react';
import { Form, Modal, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import LocalsKeys from '@/locales/LocaleKeys';
import { getFormLayout } from '@/utils/util';

const { formItemLayout } = getFormLayout(6, 15);

const AddSysLang = (props) => {
  const { onCancel, visible, existKeys, onAddLang } = props;

  const [formRef] = Form.useForm();

  function renderOption() {
    let data = [];
    Object.keys(LocalsKeys).forEach((key) => {
      if (!existKeys.includes(key)) {
        return data.push(<Select.Option key={key}>{LocalsKeys[key]}</Select.Option>);
      }
    });
    return data;
  }

  function onSubmitLang() {
    formRef
      .validateFields()
      .then((allValues) => {
        const currentValue = { ...allValues };
        currentValue.name = LocalsKeys[allValues.code];
        onAddLang(currentValue);
      })
      .catch(() => {});
  }

  return (
    <Modal
      destroyOnClose
      title={<FormattedMessage id="translator.languageManage.addLanguage" />}
      maskClosable={false}
      closable={false}
      width={400}
      onCancel={onCancel}
      onOk={onSubmitLang}
      visible={visible}
    >
      <Form {...formItemLayout} form={formRef}>
        <Form.Item
          name="code"
          label={<FormattedMessage id="translator.languageManage.langType" />}
          rules={[{ required: true }]}
        >
          <Select style={{ width: '100%' }}>{renderOption()}</Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default memo(AddSysLang);
