import React, { memo } from 'react';
import SystemParamsComponent from '@/pages/SystemParams/SystemParamsComponent';

const SystemParamsTimeZone = (props) => {
  const {} = props;
  return <SystemParamsComponent agvType={"Coordinator"} />;
};
export default memo(SystemParamsTimeZone);

