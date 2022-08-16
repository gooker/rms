import React, { memo, useEffect } from 'react';
import { Form, Input } from 'antd';
import { connect } from '@/utils/RmsDva';
import CommonModal from '@/components/CommonModal';
import { dealResponse, formatMessage, getRandomString, renderLabel } from '@/utils/util';
import { saveCustomTask } from '@/services/commonService';

const CopyCustomTaskModal = (props) => {
  const { dispatch, editingRow, visible, onCancel } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
    if (visible) {
      formRef.setFieldsValue({
        name: `${renderLabel(editingRow.name, true)}_copy`,
      });
    } else {
      formRef.resetFields();
    }
  }, [visible]);

  function onOk() {
    formRef
      .validateFields()
      .then((value) => {
        const requestBody = {
          name: value.name,
          code: `cst_${getRandomString(8)}`,
          codes: editingRow.codes,
          customStart: editingRow.customStart,
          customActions: editingRow.customActions,
          customPreActions: editingRow.customPreActions,
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
      })
      .catch(() => {
      });
  }

  function closeModal() {
    dispatch({ type: 'customTask/saveEditingRow', payload: null });
    onCancel();
  }

  return (
    <CommonModal
      visible={visible}
      title={`${formatMessage('app.button.clone')}${formatMessage('menu.customTask')}`}
      onCancel={closeModal}
      onOk={onOk}
    >
      <Form form={formRef}>
        <Form.Item
          name={'name'}
          label={formatMessage('customTask.form.name')}
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Form>
    </CommonModal>
  );
};
export default connect(({ customTask }) => ({
  editingRow: customTask.editingRow,
}))(memo(CopyCustomTaskModal));
