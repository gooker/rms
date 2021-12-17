import React, { memo } from 'react';
import ChargingStrategyComponent from '@/pages/ChargingStrategy/ChargingStrategyComponent';
import { AGVType } from '@/config/config';

const ChargingStrategy = (props) => {
  const {} = props;
  return <ChargingStrategyComponent agvType={AGVType.LatentLifting} />;
};
export default memo(ChargingStrategy);
