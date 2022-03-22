import React, { memo } from 'react';
import TaskLibraryComponent from '@/pages/TaskLibrary/TaskLibraryComponent';
import { AGVType } from '@/config/config';

const TaskExecuted = () => {
  return (
    <TaskLibraryComponent
      agvType={AGVType.LatentLifting} // 标记当前页面的车型
      cancel={true} // 标记该页面是否允许执行取消操作
    />
  );
};
export default memo(TaskExecuted);
