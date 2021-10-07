import React from 'react';
import { InputNumber, Button, Form, Col } from 'antd';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse } from '@/utils/utils';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const noLabelLayout = { wrapperCol: { span: 16, offset: 6 } };

const LatentTransport = (props) => {
  const [form] = Form.useForm();
  const { agvType } = props;

  function goTransport() {
    form.validateFields().then((value) => {
      //
    });
  }

  return (
    <Form form={form}>
      <Form.Item
        {...layout}
        name={'podId'}
        label={formatMessage({ id: 'app.monitorOperation.pod' })}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        {...layout}
        name={'targetCellId'}
        label={formatMessage({ id: 'app.monitorOperation.targetCell' })}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item
        {...layout}
        name={'robotId'}
        label={formatMessage({ id: 'app.monitorOperation.robotId' })}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item {...noLabelLayout}>
        <Col span={12}>
          <Button type="primary" onClick={goTransport}>
            <FormattedMessage id="app.monitorOperation.carryPod" />
          </Button>
        </Col>
      </Form.Item>
    </Form>
  );
};
export default LatentTransport;
