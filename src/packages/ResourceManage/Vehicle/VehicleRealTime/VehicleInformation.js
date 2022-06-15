import React, { memo } from 'react';
import { Card, Descriptions } from 'antd';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const VehicleInformation = (props) => {
  const { data } = props;

  return (
    <Card title={<FormattedMessage id={'vehicle.info'} />} extra={data.vehicle?.id}>
      <Descriptions>
        {/************ 适配器类型 ************/}
        <Descriptions.Item label={formatMessage({ id: 'app.adapterType' })} span={2}>
          {data.vehicle?.adapterType}
        </Descriptions.Item>

        {/************ 车辆类型 ************/}
        <Descriptions.Item label={formatMessage({ id: 'app.vehicleType' })} span={1}>
          {data.vehicle?.vehicleType}
        </Descriptions.Item>

        {/************ 小车ID ************/}
        <Descriptions.Item label={formatMessage({ id: 'vehicle.id' })}>
          {data.vehicle?.vehicleId}
        </Descriptions.Item>

        {/************ 品牌 ************/}
        <Descriptions.Item label={formatMessage({ id: 'vehicle.brand' })}>
          {data.vehicle?.brand}
        </Descriptions.Item>

        {/************ 服务器标识 ************/}
        <Descriptions.Item label={formatMessage({ id: 'vehicle.serverIdentity' })}>
          {data.vehicle?.clusterIndex}
        </Descriptions.Item>

        {/************ IP ************/}
        <Descriptions.Item label={'IP'}>{data.vehicle?.ip}</Descriptions.Item>

        {/************ 端口号 ************/}
        <Descriptions.Item label={formatMessage({ id: 'vehicle.port' })}>
          {data.vehicle?.port}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
};
export default memo(VehicleInformation);
