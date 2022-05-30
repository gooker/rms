import React from 'react';
import VehicleLockComponent from '../component/VehicleLockComponent';
import { VehicleType } from '@/config/config';

const VehicleLock = () => {
  return (
    <VehicleLockComponent
      vehicleType={VehicleType.LatentLifting} // 标记当前页面的车型
    />
  );
};
export default React.memo(VehicleLock);
