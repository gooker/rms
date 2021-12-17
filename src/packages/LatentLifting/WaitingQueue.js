import React from 'react';
import { AGVType } from '@/config/config';
import { hasPermission } from '@/utils/Permission';
import WaitingQueueComponent from '@/pages/TaskQueue/WaitingQueueComponent';

class TaskQueue extends React.PureComponent {
  render() {
    const deleteFlag = hasPermission('/tote/task/taskQueue/delete');
    const priority = hasPermission('/tote/task/taskQueue/updatePipLine');
    return (
      <WaitingQueueComponent
        agvType={AGVType.LatentLifting} // 标记当前页面的车型
        deleteFlag={true} // 标记该页面是否允许执行删除操作
        priority={true} // 标记该页面是否允许执行调整优先级操作
      />
    );
  }
}
export default TaskQueue;
