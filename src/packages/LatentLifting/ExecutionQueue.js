import React, { memo } from 'react';
import ExecutionQueueComponent from '@/pages/TaskQueue/ExecutionQueueComponent';
import { hasPermission } from '@/utils/Permission';
import { AGVType } from '@/config/config';

const ExecutionQueue = () => {
  const deleteFlag = hasPermission('/tote/task/executionQueue/delete');
  return (
    <ExecutionQueueComponent
      agvType={AGVType.LatentLifting} // 标记当前页面的车型
      deleteFlag={true} // 标记该页面是否允许执行删除操作
    />
  );
};
export default memo(ExecutionQueue);
