import React, { memo } from 'react';
import LatentToteOrderComponent from './components/LatentToteOrderComponent';
import { AGVType } from '@/config/config';

const LatentToteTaskManagement = () => {
  return (
    <LatentToteOrderComponent
      agvType={AGVType.LatentTote} // 标记当前页面的车型
    />
  );
};
export default memo(LatentToteTaskManagement);
