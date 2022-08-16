import React, { memo } from 'react';
import { Card, Descriptions } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';

const VehicleModuleInformation = (props) => {
  const { data } = props;

  return (
    <Card title={<FormattedMessage id={'vehicle.moduleInformation'} />}>
      <Descriptions>
        {/*<Descriptions.Item label={formatMessage({ id: 'app.adapterType' })}>*/}
        {/*  {data.vehicle?.adapterType}*/}
        {/*</Descriptions.Item>*/}
      </Descriptions>
    </Card>
  );
};
export default memo(VehicleModuleInformation);
