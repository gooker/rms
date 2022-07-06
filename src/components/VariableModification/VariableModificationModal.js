import React, { memo, useEffect } from 'react';
import { Form } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import FormModal from '@/components/FormModal';
import VariableModification, { formatVariableFormValues } from './QuickTaskVariableModification';

const VariableModificationModal = (props) => {
  const { quickTask, visible, customTask, onOk, onCancel, loadSpecification } = props;

  const [formRef] = Form.useForm();

  useEffect(() => {
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
    <FormModal
      title={formatMessage({ id: 'variable.task.edit' })}
      visible={visible}
      width={900}
      onOk={confirm}
      onCancel={onCancel}
    >
      <VariableModification
        form={formRef}
        variable={quickTask?.variable}
        customTask={customTask}
        loadSpecification={loadSpecification}
      />
    </FormModal>
  );
};
export default connect(({ quickTask }) => ({
  loadSpecification: quickTask.loadSpecification,
}))(memo(VariableModificationModal));
