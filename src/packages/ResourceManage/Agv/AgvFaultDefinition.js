import React, { memo } from 'react';
import FaultDefinitionComponent from '@/pages/FaultDefinition/FaultDefinitionComponent';
import { AGVType } from '@/config/config';

const AgvFaultDefinition = (props) => {
  const {} = props;
  return <FaultDefinitionComponent agvType={AGVType.LatentLifting} />;
};
export default memo(AgvFaultDefinition);
