import React, { memo } from 'react';
import SystemParamsComponent from '@/pages/SystemParams/SystemParamsComponent';
import { AGVType } from '@/config/config';

const SystemParams = (props) => {
  const {} = props;
  return <SystemParamsComponent agvType={AGVType.LatentLifting} />;
};
export default memo(SystemParams);
