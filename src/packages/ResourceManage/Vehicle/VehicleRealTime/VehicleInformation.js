import React, { memo } from 'react';
import { Col, Form, Row } from 'antd';
import { formatMessage } from '@/utils/util';

const VehicleInformation = (props) => {
  const { data } = props;

  return (
    <Row>
      {/************ 唯一ID ************/}
      <Col span={6}>
        <Form.Item label={formatMessage({ id: 'vehicle.uniqueId' })}>{data.vehicle?.id}</Form.Item>
      </Col>

      {/************ 小车ID ************/}
      <Col span={6}>
        <Form.Item label={formatMessage({ id: 'vehicle.id' })}>{data.vehicle?.vehicleId}</Form.Item>
      </Col>

      {/************ 品牌 ************/}
      <Col span={6}>
        <Form.Item label={formatMessage({ id: 'vehicle.brand' })}>{data.vehicle?.brand}</Form.Item>
      </Col>

      {/************ 车辆类型 ************/}
      <Col span={6}>
        <Form.Item label={formatMessage({ id: 'app.vehicleType' })}>
          {data.vehicle?.vehicleType}
        </Form.Item>
      </Col>

      {/************ 适配器类型 ************/}
      <Col span={6}>
        <Form.Item label={formatMessage({ id: 'app.adapterType' })}>
          {data.vehicle?.adapterType}
        </Form.Item>
      </Col>

      {/************ 服务器标识 ************/}
      <Col span={6}>
        <Form.Item label={formatMessage({ id: 'vehicle.serverIdentity' })}>
          {data.vehicle?.clusterIndex}
        </Form.Item>
      </Col>

      {/************ IP ************/}
      <Col span={6}>
        <Form.Item label={'IP'}>{data.vehicle?.ip}</Form.Item>
      </Col>

      {/************ 端口号 ************/}
      <Col span={6}>
        <Form.Item label={formatMessage({ id: 'vehicle.port' })}>{data.vehicle?.port}</Form.Item>
      </Col>
    </Row>
  );
};
export default memo(VehicleInformation);
