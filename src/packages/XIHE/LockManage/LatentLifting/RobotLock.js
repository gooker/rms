import React from 'react';
import RobotLockComponent from '../components/RobotLockComponent';
import { AGVType } from '@/config/config';

const RobotLock = () => {
  return (
    <RobotLockComponent
      agvType={AGVType.LatentLifting} // 标记当前页面的车型
    />
  );
};

export default React.memo(RobotLock);
