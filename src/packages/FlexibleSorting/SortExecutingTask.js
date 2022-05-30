import React, { memo } from 'react';
import ExecutionQueueComponent from '@/pages/TaskQueue/ExecutionQueueComponent';
import { VehicleType } from '@/config/config';

const SortExecutingTask = (props) => {
  return (
    <ExecutionQueueComponent
      vehicleType={VehicleType.Sorter} // 标记当前页面的车型
      deleteFlag={true} // 标记该页面是否允许执行删除操作
    />
  );
};
export default memo(SortExecutingTask);
