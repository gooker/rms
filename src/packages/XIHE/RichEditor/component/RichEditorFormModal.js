import React, { useState } from 'react';
import { Modal, Form, Input, Tabs } from 'antd';
import { adaptModalWidth, adaptModalHeight, formatMessage } from '@/utils/util';
import Editor from './editor.js';
import LocaleKeys from '@/locales/LocaleKeys';

const { Item } = Form;

const { TabPane } = Tabs;

const formLayout = { labelCol: { span: 2 }, wrapperCol: { span: 25 } };

const RichEditorFormModal = (props) => {
  const { data, visible, onSubmit, onClose, webHooks } = props;
  const [form] = Form.useForm();

  const language = window.localStorage.getItem('currentLocale');
  const [selectLanguage, setSelectLanguage] = useState(language);

  //提交
  function submit() {
    form
      .validateFields()
      .then((values) => {
        values.languageAndContent = data.languageAndContent;
        onSubmit(values);
        form.resetFields();
      })
      .catch(() => {});
  }

  //关闭
  function closeModal() {
    form.resetFields();
    onClose();
  }

  //富文本 change 调用
  function editorContent(content) {
    data?.languageAndContent.forEach((item) => {
      if (item.type === selectLanguage) {
        return (item.content = content);
      }
    });
  }

  function onTabChange(e) {
    setSelectLanguage(e);
  }

  const title = `${formatMessage({
    id: !data.errorCode ? 'app.button.add' : 'app.button.update',
  })}${formatMessage({ id: 'richEditor.richtext' })}`;

  return (
    <Modal
      title={title}
      width={adaptModalWidth() + 100}
      style={{ top: 8 }}
      bodyStyle={{ height: adaptModalHeight(), overflow: 'auto' }}
      visible={visible}
      onOk={submit}
      onCancel={closeModal}
      destroyOnClose
    >
      <Form form={form} preserve={false}>
        <Item
          {...formLayout}
          name="errorCode"
          label={formatMessage({ id: 'rolemanager.code' })}
          initialValue={data?.errorCode}
          rules={[
            {
              required: true,
            },
            {
              validator: (_, value) => {
                //错误编码唯一验证
                let isErrorCodeList = webHooks.filter((item) => item.errorCode === value);
                if (!data.errorCode && isErrorCodeList.length > 0) {
                  return Promise.reject(
                    new Error(formatMessage({ id: 'richEditor.code.duplicate' })),
                  );
                } else {
                  return Promise.resolve();
                }
              },
            },
          ]}
        >
          <Input />
        </Item>

        <Item {...formLayout} label={formatMessage({ id: 'richEditor.content' })}>
          <Tabs defaultActiveKey={language} onChange={onTabChange}>
            {data?.languageAndContent.map((item, index) => {
              return (
                <TabPane tab={LocaleKeys[item.type]} key={item.type}>
                  <Editor content={item.content} index={index} onEditorContent={editorContent} />
                </TabPane>
              );
            })}
          </Tabs>
        </Item>
      </Form>
    </Modal>
  );
};
export default RichEditorFormModal;
