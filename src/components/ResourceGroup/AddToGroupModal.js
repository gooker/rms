/* TODO: I18N */
import React, { memo, useEffect, useState } from 'react';
import { message, Modal, Select } from 'antd';

const AddToGroupModal = (props) => {
  const { visible, groups, onCancel, onOk } = props;

  const [selection, setSelections] = useState([]);

  useEffect(() => {
    if (!visible) {
      setSelections([]);
    }
  }, [visible]);

  function submit() {
    if (selection.length === 0) {
      message.warn('请选择一个或多个组');
    } else {
      onOk(selection);
    }
  }

  return (
    <Modal
      visible={visible}
      title={'添加资源到组'}
      maskClosable={false}
      onOk={submit}
      onCancel={onCancel}
    >
      <Select
        allowClear
        mode={'multiple'}
        value={selection}
        onChange={setSelections}
        placeholder={'请选择一个或多个组'}
        style={{ width: '100%' }}
      >
        {groups.map(({ code, groupName }) => (
          <Select.Option key={code} value={code}>
            {groupName}
          </Select.Option>
        ))}
      </Select>
    </Modal>
  );
};
export default memo(AddToGroupModal);
