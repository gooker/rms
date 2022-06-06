import React, { memo, useEffect, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { connect } from '@/utils/RmsDva';
import { fetchLanguageByAppCode } from '@/services/translatorService';
import { convertMapToArrayMap, dealResponse, formatMessage, getFormLayout, isStrictNull } from '@/utils/util';

const { formItemLayout } = getFormLayout(5, 18);
const I18NEditor = (props) => {
  const { dispatch, editI18NKey } = props;

  const [datasource, setDatasource] = useState([]);
  const [formRef] = Form.useForm();

  useEffect(() => {
    getTranslation();
  }, []);

  useEffect(() => {
    getTranslation();
  }, [editI18NKey]);

  function getTranslation() {
    if (isStrictNull(editI18NKey)) return;
    fetchLanguageByAppCode({ appCode: 'FE', languageKey: editI18NKey }).then((response) => {
      if (!dealResponse(response)) {
        const { languageKey, languageMap } = response[0];
        formRef.setFieldsValue({ languageKey });
        setDatasource(convertMapToArrayMap(languageMap));
      } else {
        formRef.resetFields();
      }
    });
  }

  function closeModal() {
    dispatch({ type: 'global/updateEditI18NKey', payload: null });
  }

  function submit() {
    closeModal();
  }

  return (
    <Modal
      closable={false}
      visible={!isStrictNull(editI18NKey)}
      title={formatMessage({ id: 'translator.languageManage.edit' })}
      onCancel={closeModal}
    >
      <Form form={formRef} {...formItemLayout}>
        <Form.Item label={'Key'} name={'languageKey'}>
          <Input disabled />
        </Form.Item>

        {datasource.map((item, index) => (
          <Form.Item key={index} label={item.key} name={item.key} initialValue={item.value}>
            <Input />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};
export default connect(({ global }) => ({
  editI18NKey: global.editI18NKey,
}))(memo(I18NEditor));
