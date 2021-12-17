import React, { memo } from 'react';
import FaultDefinitionComponent from '@/pages/FaultDefinition/FaultDefinitionComponent';
import { AGVType } from '@/config/config';

const FaultDefinition = (props) => {
  const {} = props;
  return <FaultDefinitionComponent agvType={AGVType.LatentLifting} />;
};
export default memo(FaultDefinition);
