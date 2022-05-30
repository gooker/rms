import React, { memo } from 'react';
import LatentToteOrderComponent from './components/LatentToteOrderComponent';
import { VehicleType } from '@/config/config';

const LatentToteTaskManagement = () => {
  return (
    <LatentToteOrderComponent
      vehicleType={VehicleType.LatentTote} // 标记当前页面的车型
    />
  );
};
export default memo(LatentToteTaskManagement);
