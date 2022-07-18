import React, { useState } from 'react';
import { Button, Form, Input, InputNumber } from 'antd';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { fetchSimulatorErrorMessage } from '@/services/monitorService';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

export default function SimulatorError(props) {
  const { selectIds = [], onCancel } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  function confirm() {
    formRef
      .validateFields()
      .then(async (values) => {
        const { msgCode } = values;

        const params = { msgCode, vehicleUniqueIds: selectIds };
        setExecuting(true);
        const response = await fetchSimulatorErrorMessage(params);
        if (!dealResponse(response, 1)) {
          onCancel(false);
        }
        setExecuting(false);
      })
      .catch(() => {});
  }

  return (
    <div>
      <Form form={formRef}>
        <Form.Item
          {...formItemLayout}
          name={'msgCode'}
          label={formatMessage({ id: 'monitor.simulator.errorCode' })}
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: 200 }} />
        </Form.Item>

        <Form.Item {...formItemLayoutNoLabel}>
          <Button onClick={confirm} loading={executing} disabled={executing}>
            <FormattedMessage id={'app.button.confirm'} />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
