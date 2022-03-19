import React, { memo, useState } from 'react';
import { Button, Divider, Form, InputNumber, message } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import LatentPodUpdater from '../Simulator/LatentPodUpdater';
import { updateLatentPodPosition } from '@/services/XIHE';
import { dealResponse, formatMessage, getFormLayout } from '@/utils/util';

const { formItemLayout, formItemLayoutNoLabel } = getFormLayout(6, 16);

const MoveLatentPod = () => {
  const [form] = Form.useForm();
  const [angle, setAngle] = useState(0);

  function movePod() {
    form
      .validateFields()
      .then((values) => {
        updateLatentPodPosition({ ...values }).then((response) => {
          if (!dealResponse(response)) {
            message.success(formatMessage({ id: 'app.common.operationSuccess' }));
          } else {
            message.error(formatMessage({ id: 'app.message.operateFailed' }));
          }
        });
      })
      .catch(() => {});
  }

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Form form={form} {...formItemLayout}>
        <LatentPodUpdater showInput={false} angle={angle} />
        <Divider style={{ margin: '10px 0' }} />
        <Form.Item
          name={'podId'}
          label={formatMessage({ id: 'app.pod.id' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={'cellId'}
          label={formatMessage({ id: 'app.common.targetCell' })}
          rules={[{ required: true }]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          name={'angle'}
          initialValue={0}
          label={formatMessage({ id: 'app.direction' })}
          rules={[{ required: true }]}
        >
          <InputNumber min={0} max={359} step={1} onChange={setAngle} />
        </Form.Item>
        <Form.Item {...formItemLayoutNoLabel}>
          <Button type="primary" onClick={movePod}>
            <FormattedMessage id="app.button.update" />
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};
export default memo(MoveLatentPod);
