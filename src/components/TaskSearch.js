import React, { memo, useState } from 'react';
import { Button, Form, Row } from 'antd';
import { Col, Select } from 'antd';
import { formatMessage, generateVehicleTypeOptions } from '@/utils/util';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

const TaskSearch = (props) => {
  const { vehicles = [], form, gutter, span, onSearch, children } = props;

  const [typeVehicles, setTypeVehicles] = useState([]);

  function search() {
    form.validateFields().then((values) => {
      onSearch(values);
    });
  }

  function getTypeVehicles(type) {
    const _typeVehicles = vehicles.filter((item) => item.vehicleType === type);
    setTypeVehicles(_typeVehicles);
  }

  return (
    <Form form={form}>
      <Row gutter={gutter}>
        <Col span={span}>
          <Form.Item
            name={'vehicleType'}
            label={formatMessage({ id: 'app.vehicleType' })}
            getValueFromEvent={(value) => {
              getTypeVehicles(value);
              return value;
            }}
          >
            <Select allowClear>{generateVehicleTypeOptions(vehicles)}</Select>
          </Form.Item>
        </Col>
        <Col span={span}>
          <Form.Item name={'vehicleId'} label={formatMessage({ id: 'vehicle.id' })}>
            <Select allowClear mode={'tags'}>
              {typeVehicles.map(({ vehicleId }) => (
                <Select.Option key={vehicleId} value={vehicleId}>
                  {vehicleId}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        {/* 额外的字段 */}

        {React.isValidElement(children) ? (
          <Col span={span}>{children}</Col>
        ) : (
          children.map((child, index) => (
            <Col key={index} span={span}>
              {child}
            </Col>
          ))
        )}

        <Form.Item>
          <Button type='primary' onClick={search}>
            <SearchOutlined /> <FormattedMessage id='app.button.search' />
          </Button>
          <Button
            style={{ marginLeft: 24 }}
            onClick={() => {
              form.resetFields();
              onSearch({}, true);
            }}
          >
            <ReloadOutlined /> <FormattedMessage id='app.button.reset' />
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
export default memo(TaskSearch);
