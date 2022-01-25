import React from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';

const RobotLockSearch = (props) => {
  const [form] = Form.useForm();

  const { search, data, type } = props;
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
        {type === 'storagelock' && (
          <Col span={4}>
            <Form.Item
              name="cellId"
              label={formatMessage({ id: 'app.map.cell' })}
              rules={[
                {
                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                  message: formatMessage({ id: 'lockManage.robot.number.required' }),
                },
              ]}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
        )}
        <Col span={4}>
          {/* 货架 */}
          <Form.Item name={'podId'} label={formatMessage({ id: 'app.pod.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>

        {/* 任务id*/}
        <Col span={4}>
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
              {/* <Col>
                <Button htmlType="reset">
                  <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
                </Button>
              </Col> */}
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default React.memo(RobotLockSearch);
