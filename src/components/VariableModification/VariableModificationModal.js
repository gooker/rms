/* TODO: I18N */
import React, { memo, useEffect } from 'react';
import { Form, message, Modal } from 'antd';
import { isNull } from '@/utils/util';
import VariableModification, {
  formatVariableFormValues,
} from '@/components/VariableModification/VariableModification';

const VariableModificationModal = (props) => {
  const { quickTask, customTask, visible, onOk, onCancel } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
    if (visible && isNull(customTask)) {
      message.error('自定义任务数据丢失');
    }
  }, [visible]);

  function confirm() {
    formRef
      .validateFields()
      .then((values) => {
        onOk(formatVariableFormValues(values));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Modal
      title={'编辑任务变量'}
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
