import React, { memo } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';

const { Option } = Select;

const TaskSearch = (props) => {
  const { search, allTaskTypes } = props;

  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      const params = {};
      search({ ...values, ...params });
    });
  }

  function renderVehicleTaskTypeOption() {
    return Object.keys(allTaskTypes).map((type) => (
      <Option key={type} value={type}>
        {allTaskTypes[type]}
      </Option>
    ));
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <Row style={{ width: '100%' }} gutter={24}>
        <Col span={5}>
          <Form.Item name={'vehicleId'} label={formatMessage({ id: 'vehicle.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item name={'vehicleTaskType'} label={formatMessage({ id: 'app.task.type' })}>
            <Select mode="multiple" allowClear>
              {renderVehicleTaskTypeOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
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
export default memo(TaskSearch);
