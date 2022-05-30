import React, { memo } from 'react';
import SystemParamsManager from '@/pages/SystemParams/SystemParamsComponent';
import { VehicleType } from '@/config/config';
import { fetchLatentToteParamFormData,updateLatentToteSystemParams } from '@/services/api';

const SystemParameters = (props) => {
  return <SystemParamsManager vehicleType={VehicleType.LatentTote} getApi={fetchLatentToteParamFormData} updateApi={updateLatentToteSystemParams}/>;
};
export default memo(SystemParameters);
