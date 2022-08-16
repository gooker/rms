import React, { memo } from 'react';
import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const VehicleTargetSearch = (props) => {
  const { onSearch, loadTypes } = props;

  const [form] = Form.useForm();

  function renderVehicleCodeOptions() {
    return loadTypes.map(({ vehicleId, vehicleType }) => (
      <Select.Option key={`${vehicleId}-${vehicleType}`} value={vehicleId}>
        {`${vehicleId} - ${vehicleType}`}
      </Select.Option>
    ));
  }

  function renderLoadTypeOptions() {
    return loadTypes.map(({ code, name }) => (
      <Select.Option key={code} value={code}>
        {name}
      </Select.Option>
    ));
  }

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
          <Form.Item name={'taskId'} label={formatMessage('app.task.id')}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'cellId'} label={formatMessage('app.map.cell')}>
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'loadType'} label={formatMessage('resource.load.type')}>
            <Select allowClear>{renderLoadTypeOptions()}</Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'loadCode'} label={formatMessage('resource.load.code')}>
            <Input />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'storageCode'} label={formatMessage('resource.storage.code')}>
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
