import React, { memo } from 'react';
import { Modal, List } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';

/**
 * @description: 删除系统语言
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const DeleteSysLang = (props) => {
  const { systemLanguage, visible, onDelete, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title={<FormattedMessage id="translator.languageManage.deleteLanguage" />}
      width={400}
      footer={null}
      onCancel={onCancel}
      visible={visible}
    >
      <List
        size="small"
        dataSource={systemLanguage}
        renderItem={(item) => <List.Item>{item.name}</List.Item>}
      />
    </Modal>
  );
};
export default connect(({ global }) => ({
  systemLanguage: global.systemLanguage,
}))(memo(DeleteSysLang));
