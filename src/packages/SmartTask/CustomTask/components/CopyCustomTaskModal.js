import React, { memo, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import CommonModal from '@/components/CommonModal';
import { Form, Input } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse, formatMessage, getRandomString, isStrictNull } from '@/utils/util';
import { saveCustomTask } from '@/services/commonService';

const CopyCustomTaskModal = (props) => {
  const { dispatch, editingRow, visible, onCancel } = props;

  const [name, setName] = useState(null);

  function onOk() {
    const requestBody = {
      name,
      code: `cst_${getRandomString(8)}`,
      codes: editingRow.codes,
      customStart: editingRow.customStart,
      customActions: editingRow.customActions,
      customWaits: editingRow.customWaits,
      customPodStatus: editingRow.customPodStatus,
      customEnd: editingRow.customEnd,
      priority: editingRow.priority,
      desc: editingRow.desc,
      sample: editingRow.sample,
      sectionId: editingRow.sectionId,
      type: editingRow.type,
    };
    saveCustomTask(requestBody).then((response) => {
      if (!dealResponse(response)) {
        closeModal();
        dispatch({ type: 'customTask/getCustomTaskList' });
      }
    });
  }

  function closeModal() {
    dispatch({ type: 'customTask/saveEditingRow', payload: null });
    onCancel();
  }

  return (
    <CommonModal
      visible={visible}
      title={`${formatMessage('app.button.copy')}${formatMessage('menu.customTask')}`}
      onCancel={closeModal}
      onOk={onOk}
      okButtonProps={{ disabled: isStrictNull(name) }}
    >
      <Form.Item label={<FormattedMessage id={'customTask.form.name'} />}>
        <Input value={name} onChange={(ev) => setName(ev.target.value)} />
      </Form.Item>
    </CommonModal>
  );
};
export default connect(({ customTask }) => ({
  editingRow: customTask.editingRow,
}))(memo(CopyCustomTaskModal));
