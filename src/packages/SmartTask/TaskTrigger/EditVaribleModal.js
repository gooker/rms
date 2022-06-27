import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import find from 'lodash/find';
import { Card, Form, Modal } from 'antd';
import { CustomNodeTypeFieldMap } from '@/packages/SmartTask/CustomTask/customTaskConfig';
import { formatMessage } from '@/utils/util';
import VariableModification, {
  formatVariableFormValues,
} from '@/components/VariableModification/VariableModification';

const reversedModelTypeFieldMap = {};
Object.keys(CustomNodeTypeFieldMap).forEach((key) => {
  const value = CustomNodeTypeFieldMap[key];
  reversedModelTypeFieldMap[value] = key;
});

const EditVaribleModal = (props) => {
  const { data, customTaskList, visible, onCancel, onSubmit } = props;

  const [form] = Form.useForm();

  function submit() {
    form.validateFields().then((values) => {
      const currentValues = formatVariableFormValues(values, true);
      const newParams = {};
      Object.keys(data)?.map((code) => {
        newParams[code] = {
          code,
          customParams: currentValues[code],
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
          Object.keys(data)?.map((code) => {
            const customTask = find(customTaskList, { code });
            const sample = data[code];
            return (
              <Card hoverable key={code} title={customTask?.name} style={{ marginTop: 13 }}>
                <VariableModification
                  prefix={code}
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
export default connect(({ taskTriger }) => ({
  modelTypes: taskTriger.modelTypes,
  customTypes: taskTriger.customTypes,
}))(memo(EditVaribleModal));
