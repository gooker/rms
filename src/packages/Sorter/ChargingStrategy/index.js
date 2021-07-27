import React, { memo } from 'react';
import ChargingStrategyComponent from '@/components/pages/ChargingStrategy/ChargingStrategyComponent';
import { AGVType } from '@/config/config';

const TaskAgvType = AGVType.Sorter;

const ChargeManagement = () => {
  return <ChargingStrategyComponent agvType={TaskAgvType} />;
};
export default memo(ChargeManagement);
