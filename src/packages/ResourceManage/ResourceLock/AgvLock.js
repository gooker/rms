import React from 'react';
import RobotLockComponent from '../component/AgvLockComponent';
import { AGVType } from '@/config/config';

const AgvLock = () => {
  return (
    <RobotLockComponent
      agvType={AGVType.LatentLifting} // 标记当前页面的车型
    />
  );
};
export default React.memo(AgvLock);
