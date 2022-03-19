import React, { memo } from 'react';
import WaitingQueueComponent from '@/pages/TaskQueue/WaitingQueueComponent';
import { AGVType } from '@/config/config';

const SortTaskQueue = () => {
  return (
    <WaitingQueueComponent
      agvType={AGVType.Sorter} // 标记当前页面的车型
      deleteFlag={true} // 标记该页面是否允许执行删除操作
      priority={true} // 标记该页面是否允许执行调整优先级操作
    />
  );
};
export default memo(SortTaskQueue);
