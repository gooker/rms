import React, { memo } from 'react';
import FaultListComponent from '@/pages/FaultList/FaultListComponent';
import { AGVType } from '@/config/config';

const AgvFaultManagement = (props) => {
  const {} = props;
  return <FaultListComponent agvType={AGVType.LatentLifting} />;
};
export default memo(AgvFaultManagement);
