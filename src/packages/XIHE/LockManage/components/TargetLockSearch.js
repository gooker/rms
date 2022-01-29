import React from 'react';
import { Form, Button, Input, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';

const TargetLockSearch = (props) => {
  const { search, data } = props;

  const [form] = Form.useForm();

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
        {/* 点位 */}
        <Col md={6} sm={24}>
          <Form.Item name="cellId" label={formatMessage({ id: 'app.map.cell' })}>
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
export default React.memo(TargetLockSearch);
