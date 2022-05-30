import React, { memo } from 'react';
import FaultListComponent from '@/pages/FaultList/FaultListComponent';
import { VehicleType } from '@/config/config';

const VehicleFaultManagement = (props) => {
  const {} = props;
  return <FaultListComponent vehicleType={VehicleType.LatentLifting} />;
};
export default memo(VehicleFaultManagement);
