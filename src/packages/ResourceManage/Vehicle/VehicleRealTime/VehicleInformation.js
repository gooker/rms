import React, { memo } from 'react';
import { Col, Form, Row } from 'antd';
import { formatMessage, getFormLayout, isStrictNull } from '@/utils/util';

const { formItemLayout } = getFormLayout(6, 18);
const VehicleInformation = (props) => {
  const { data } = props;

  function renderIsSimulator(value) {
    if (!isStrictNull(value)) {
      return formatMessage({ id: `app.common.${value}` });
    }
  }

  return (
    <Row>
      {/************ 品牌 ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'vehicle.brand' })}>
          {data.vehicle?.brand}
        </Form.Item>
      </Col>

      {/************ 是否模拟 ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.isSimulator' })}>
          {renderIsSimulator(data.vehicle?.isSimulator)}
        </Form.Item>
      </Col>

      {/************ 小车ID ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'vehicle.id' })}>
          {data.vehicle?.vehicleId}
        </Form.Item>
      </Col>

      {/************ 唯一ID ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'vehicle.uniqueId' })}>
          {data.vehicle?.id}
        </Form.Item>
      </Col>

      {/************ 车辆类型 ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.vehicleType' })}>
          {data.vehicle?.vehicleType}
        </Form.Item>
      </Col>

      {/************ 适配器类型 ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'app.adapterType' })}>
          {data.vehicle?.adapterType}
        </Form.Item>
      </Col>

      {/************ IP ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={'IP'}>
          {data.vehicle?.ip}
        </Form.Item>
      </Col>

      {/************ 端口号 ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'vehicle.port' })}>
          {data.vehicle?.port}
        </Form.Item>
      </Col>

      {/************ 服务器标识 ************/}
      <Col span={6}>
        <Form.Item {...formItemLayout} label={formatMessage({ id: 'vehicle.clusterIndex' })}>
          {data.vehicle?.clusterIndex}
        </Form.Item>
      </Col>
    </Row>
  );
};
export default memo(VehicleInformation);
