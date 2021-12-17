import React, { memo } from 'react';
import MetaDataComponent from '@/pages/MetaDataComponent';
import { AGVType } from '@/config/config';

const MetaData = () => {
  return <MetaDataComponent agvType={AGVType.LatentLifting} />;
};
export default memo(MetaData);
