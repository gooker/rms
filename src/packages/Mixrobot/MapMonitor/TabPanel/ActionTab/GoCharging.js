import React from 'react';
import { InputNumber, Button, Form, Col } from 'antd';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { dealResponse } from '@/utils/utils';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const noLabelLayout = { wrapperCol: { span: 16, offset: 6 } };

const GoCharging = (props) => {
  const [form] = Form.useForm();
  const { agvType } = props;

  function goCharging() {
    form.validateFields().then((value) => {
      //
    });
  }

  return (
    <Form form={form}>
      <Form.Item
        {...layout}
        name={'agvId'}
        label={formatMessage({ id: 'app.monitorOperation.robotId' })}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item {...noLabelLayout}>
        <Col span={12}>
          <Button type="primary" onClick={goCharging}>
            <FormattedMessage id="app.monitorOperation.charger" />
          </Button>
        </Col>
      </Form.Item>
    </Form>
  );
};
export default GoCharging;
