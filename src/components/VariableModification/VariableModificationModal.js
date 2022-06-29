import React, { memo, useEffect } from 'react';
import { Form, message, Modal } from 'antd';
import { formatMessage, isNull } from '@/utils/util';
import VariableModification, {
  formatVariableFormValues,
} from '@/components/VariableModification/VariableModification';

const VariableModificationModal = (props) => {
  const { quickTask, customTask, visible, onOk, onCancel } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
    if (visible && isNull(customTask)) {
      message.error(formatMessage({ id: 'variable.customTaskData.missing' }));
    }
    if (!visible) {
      formRef.resetFields();
    }
  }, [visible]);

  function confirm() {
    formRef
      .validateFields()
      .then((values) => {
        onOk(formatVariableFormValues(values));
      })
      .catch(console.log);
  }

  return (
    <Modal
      title={formatMessage({ id: 'variable.task.edit' })}
      visible={visible}
      width={800}
      maskClosable={false}
      closable={false}
      onOk={confirm}
      onCancel={onCancel}
      bodyStyle={{ maxHeight: '80vh', overflow: 'auto' }}
    >
      <VariableModification form={formRef} variable={quickTask?.variable} customTask={customTask} />
    </Modal>
  );
};
export default memo(VariableModificationModal);
