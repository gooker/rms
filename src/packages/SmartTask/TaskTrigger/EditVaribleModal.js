import React, { memo, useEffect } from 'react';
import find from 'lodash/find';
import { Card, Form, Modal } from 'antd';
import { CustomNodeTypeFieldMap } from '@/packages/SmartTask/CustomTask/customTaskConfig';
import { formatMessage } from '@/utils/util';
import VariableModification, {
  formatVariableFormValues,
} from '@/components/VariableModification/CommonVariableModification';

const reversedModelTypeFieldMap = {};
Object.keys(CustomNodeTypeFieldMap).forEach((key) => {
  const value = CustomNodeTypeFieldMap[key];
  reversedModelTypeFieldMap[value] = key;
});

const EditVaribleModal = (props) => {
  const { data, customTaskList, allTaskList, visible, onCancel, onSubmit } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible]);

  function submit() {
    form.validateFields().then((values) => {
      const currentValues = formatVariableFormValues(values, true);
      const newParams = {};
      Object.keys(data)?.map((idcode) => {
        const [id, code] = idcode.split('-');
        newParams[idcode] = {
          code,
          ...currentValues[idcode],
        };
      });

      onSubmit(newParams);
    });
  }

  return (
    <Modal
      destroyOnClose
      mask={false}
      width={710}
      style={{ top: 30 }}
      visible={visible}
      onCancel={onCancel}
      onOk={submit}
      okText={formatMessage({ id: 'app.button.update' })}
      title={formatMessage({ id: 'taskTrigger.editVariable' })}
    >
      <Form form={form} labelWrap>
        {data &&
          Object.keys(data)?.map((idcode) => {
            const [id, code] = idcode.split('-');
            const customTask = find(customTaskList, { code });
            const { name } = find(allTaskList, { id });
            const sample = data[idcode];
            return (
              <Card hoverable key={id} title={name} style={{ marginTop: 13 }}>
                <VariableModification
                  prefix={`${id}-${code}`}
                  form={form}
                  variable={sample}
                  customTask={customTask}
                />
              </Card>
            );
          })}
      </Form>
    </Modal>
  );
};
export default memo(EditVaribleModal);
