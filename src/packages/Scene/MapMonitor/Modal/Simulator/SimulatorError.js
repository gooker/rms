import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';
import { fetchSimulatorErrorMessage } from '@/services/monitorService';
import FormattedMessage from '@/components/FormattedMessage';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

export default function SimulatorError(props) {
  const { selectIds = [], logicId, dispatch, onCancel } = props;
  const [formRef] = Form.useForm();
  const [executing, setExecuting] = useState(false);

  function confirm() {
    formRef
      .validateFields()
      .then((values) => {
        const { msgCode } = values;
        const params = { logicId, msgCode, vehicleId: selectIds.join(',') };
        setExecuting(true);
        fetchSimulatorErrorMessage(params).then((res) => {
          if (!dealResponse(res, 1, formatMessage({ id: 'monitor.simulator.errorCode.success' }))) {
            onCancel(false);
          }
        });

        setExecuting(false);
      })
      .catch(() => {});
  }

  return (
    <div>
      <Form form={formRef}>
        <Form.Item
          {...formItemLayout}
          name={'vehicleId'}
          label={formatMessage({ id: 'monitor.simulator.errorCode' })}
          rules={[{ required: true }]}
        >
          <Input />
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
