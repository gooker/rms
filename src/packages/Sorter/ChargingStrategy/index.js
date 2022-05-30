import React, { memo } from 'react';
import ChargingStrategyComponent from '@/pages/ChargingStrategy/ChargingStrategyComponent';
import { VehicleType } from '@/config/config';

const TaskVehicleType = VehicleType.Sorter;

const ChargeManagement = () => {
  return <ChargingStrategyComponent vehicleType={TaskVehicleType} />;
};
export default memo(ChargeManagement);
