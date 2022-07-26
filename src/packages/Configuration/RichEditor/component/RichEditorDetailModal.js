import React from 'react';
import { Modal, Tabs } from 'antd';
import { adaptModalHeight, adaptModalWidth, formatMessage } from '@/utils/util';
import LocalsKeys from '@/locales/LocaleKeys';

const { TabPane } = Tabs;

const RichEditorFormModal = (props) => {
  const { data, visible, onClose } = props;

  const title = formatMessage({ id: 'richEditor.text.detail' });

  const language = window.localStorage.getItem('currentLocale');

  return (
    <Modal
      title={title}
      width={adaptModalWidth() + 100}
      style={{ top: 8 }}
      bodyStyle={{ height: adaptModalHeight(), overflow: 'auto' }}
      visible={visible}
      onCancel={() => {
        onClose();
      }}
      destroyOnClose
      footer={null}
    >
      <Tabs defaultActiveKey={LocalsKeys[language]}>
        {data?.languageAndContent.map((item, index) => {
          return (
            <TabPane tab={LocalsKeys[item.type]} key={LocalsKeys[item.type]}>
              <div dangerouslySetInnerHTML={{ __html: item.content }}></div>
            </TabPane>
          );
        })}
      </Tabs>
    </Modal>
  );
};
export default RichEditorFormModal;
