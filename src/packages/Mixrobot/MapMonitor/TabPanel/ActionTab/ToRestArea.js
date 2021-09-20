import React from 'react';
import { InputNumber, Button, Form, Col } from 'antd';
import { formatMessage, FormattedMessage } from '@/utils/Lang';
import { dealResponse } from '@/utils/utils';

const layout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const noLabelLayout = { wrapperCol: { span: 16, offset: 6 } };

const ToRestArea = (props) => {
  const [form] = Form.useForm();
  const { sectionId, api } = props;

  function toRest() {
    form.validateFields().then((value) => {
      api({ sectionId, ...value }).then((response) => {
        dealResponse(
          response,
          true,
          formatMessage({ id: 'app.monitorOperation.toRestAreaSuccess' }, { value: value.robotId }),
        );
      });
    });
  }

  return (
    <Form form={form}>
      <Form.Item
        {...layout}
        name={'robotId'}
        label={formatMessage({ id: 'app.monitorOperation.robotId' })}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item {...noLabelLayout}>
        <Col span={12}>
          <Button type="primary" onClick={toRest}>
            <FormattedMessage id="app.monitorOperation.toRestArea" />
          </Button>
        </Col>
      </Form.Item>
    </Form>
  );
};
export default ToRestArea;
