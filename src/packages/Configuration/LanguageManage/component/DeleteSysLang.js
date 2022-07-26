import React, { memo } from 'react';
import { List, Modal, Popconfirm } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { connect } from '@/utils/RmsDva';
import { DeleteOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';

/**
 * @description: 删除系统语言
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const DeleteSysLang = (props) => {
  const { dispatch, systemLanguage, visible, onCancel } = props;

  // 筛选掉中文和英文
  const filterLang = systemLanguage.filter((item) => !['zh-CN', 'en-US'].includes(item.code));

  function deleteSysLang(code) {
    dispatch({
      type: 'global/deleteSystemLang',
      payload: code,
    });
  }

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
        dataSource={filterLang}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Popconfirm
                key={'delete'}
                title={formatMessage({ id: 'app.message.delete.confirm' })}
                onConfirm={() => deleteSysLang(item.code)}
              >
                <DeleteOutlined style={{ color: 'red', fontSize: 15 }} />
              </Popconfirm>,
            ]}
          >
            {item.name}
          </List.Item>
        )}
      />
    </Modal>
  );
};
export default connect(({ global }) => ({
  systemLanguage: global.systemLanguage,
}))(memo(DeleteSysLang));
