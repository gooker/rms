import React, { memo } from 'react';
import ChargingStrategyComponent from '@/pages/ChargingStrategy/ChargingStrategyComponent';
import { VehicleType } from '@/config/config';

const ChargingStrategy = (props) => {
  const {} = props;
  return <ChargingStrategyComponent vehicleType={VehicleType.LatentLifting} />;
};
export default memo(ChargingStrategy);
