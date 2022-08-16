import React, { memo, useEffect, useState } from 'react';
import { Col, Form, Button, Select, Input, InputNumber, Row, Space } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { dealResponse, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAllVehicleList } from '@/services/commonService';

const VehicleTargetLockSearch = (props) => {
  const { onSearch } = props;

  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    fetchAllVehicleList().then((response) => {
      if (!dealResponse(response)) {
        setVehicles(response);
      }
    });
  }, []);

  function renderVehicleCodeOptions() {
    return vehicles.map(({ vehicleId, vehicleType }) => (
      <Select.Option key={`${vehicleId}-${vehicleType}`} value={vehicleId}>
        {`${vehicleId} - ${vehicleType}`}
      </Select.Option>
    ));
  }

  function renderVehicleTypeOptions() {
    const allVehicleTypes = new Set(vehicles.map(({ vehicleType }) => vehicleType));
    return [...allVehicleTypes].map((vehicleType) => (
      <Select.Option key={vehicleType} value={vehicleType}>
        {vehicleType}
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
          <Form.Item name={'vehicleType'} label={formatMessage('app.vehicleType')}>
            <Select allowClear>{renderVehicleTypeOptions()}</Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'vehicleCode'} label={formatMessage('vehicle.code')}>
            <Select allowClear mode={'tags'}>
              {renderVehicleCodeOptions()}
            </Select>
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
export default memo(VehicleTargetLockSearch);
