import React, { memo } from 'react';
import { Button, Col, Form, Input, Row, Space } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const VehicleTargetSearch = (props) => {
  const { onSearch } = props;

  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      onSearch(values);
    });
  }

  function onClear() {
    form.resetFields();
    onSearch({});
  }

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item name={'chargerCode'} label={formatMessage('charger.code')}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'vehicleCode'} label={formatMessage('vehicle.code')}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Space>
            <Button type="primary" onClick={onFinish}>
              <SearchOutlined /> <FormattedMessage id="app.button.search" />
            </Button>
            <Button onClick={onClear}>
              <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
            </Button>
          </Space>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(VehicleTargetSearch);
