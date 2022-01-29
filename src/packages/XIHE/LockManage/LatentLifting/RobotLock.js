import React from 'react';
import RobotLockComponent from '../components/RobotLockComponent';
import { AGVType } from '@/config/config';
<<<<<<< HEAD
import { isNull } from '@/utils/util';
import commonStyles from '@/common.module.less';
=======
>>>>>>> cf3dc1b4ea3b12ca673fed19394661f414d886ac

const RobotLock = () => {
  return (
    <RobotLockComponent
      agvType={AGVType.LatentLifting} // 标记当前页面的车型
    />
  );
};

export default React.memo(RobotLock);
