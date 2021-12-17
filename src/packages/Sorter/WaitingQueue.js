import React, { memo } from 'react';
import { hasPermission } from '@/utils/Permission';
import WaitingQueueComponent from '@/pages/TaskQueue/WaitingQueueComponent';
import { AGVType } from '@/config/config';

const WaitingQueue = () => {
  const deleteFlag = hasPermission('/sorter/task/taskQueue/delete');
  const priority = hasPermission('/sorter/task/taskQueue/updatePipLine');
  return (
    <WaitingQueueComponent
      agvType={AGVType.Sorter} // 标记当前页面的车型
      deleteFlag={deleteFlag} // 标记该页面是否允许执行删除操作
      priority={priority} // 标记该页面是否允许执行调整优先级操作
    />
  );
};
export default memo(WaitingQueue);
