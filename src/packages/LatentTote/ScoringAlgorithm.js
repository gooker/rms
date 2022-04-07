import React, { memo } from 'react';
import SystemParamsManager from '@/pages/SystemParams/SystemParamsComponent';
import { AGVType } from '@/config/config';
import { fetchLatentToteParamFormData,updateLatentToteSystemParams } from '@/services/api';

const SystemParameters = (props) => {
  return <SystemParamsManager agvType={AGVType.LatentTote} getApi={fetchLatentToteParamFormData} updateApi={updateLatentToteSystemParams}/>;
};
export default memo(SystemParameters);
