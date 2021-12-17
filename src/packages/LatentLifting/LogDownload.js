import React, { memo } from 'react';
import LogDownLoadComponent from '@/pages/LogDownLoad/LogDownLoadComponent';
import { AGVType } from '@/config/config';

const LogDownload = () => {
  return <LogDownLoadComponent agvType={AGVType.LatentLifting} />;
};
export default memo(LogDownload);
