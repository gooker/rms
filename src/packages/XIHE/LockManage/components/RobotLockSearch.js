import React from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';

const RobotlockSearch = (props) => {
  const [form] = Form.useForm();

  const { search, data } = props;
  function onFinish() {
    form
      .validateFields()
      .then((values) => {
        search(data, { ...values });
      })
      .catch(() => {});
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <Row style={{ width: '100%' }} gutter={24}>
        <Col span={6}>
          {/* 小车id */}
          <Form.Item name={'robotId'} label={formatMessage({ id: 'app.agv' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        {/* 任务id*/}
        <Col md={6} sm={24}>
          <Form.Item name="taskId" label={formatMessage({ id: 'app.task.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Row gutter={24}>
              <Col>
                <Button type="primary" htmlType="submit">
                  <SearchOutlined /> <FormattedMessage id="app.button.search" />
                </Button>
              </Col>
              <Col>
                <Button htmlType="reset">
                  <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default React.memo(RobotlockSearch);
