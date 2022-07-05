import React, { memo } from 'react';
import FaultListComponent from '@/pages/FaultList/FaultListComponent';

const VehicleFaultManagement = (props) => {
  const {} = props;
  return <FaultListComponent type={'VEHICLE'} />;
};
export default memo(VehicleFaultManagement);
