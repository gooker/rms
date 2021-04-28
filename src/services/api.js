import request from '@/utils/request';

// ************************************** 执行队列  ************************************** //
// 获取执行队列数据
export async function fetchExecutingTaskList(namespace, params) {
  return request(`/${namespace}/redis/getExecutingTaskList/${params}`, {
    method: `GET`,
  });
}

// 删除执行队列任务
export async function deleteExecutionQTasks(namespace, params) {
  return request(`/${namespace}/redis/batchDeleteExecutingTask`, {
    method: `POST`,
    data: params,
  });
}

// ************************************** 等待队列  ************************************** //
// 获取等待队列任务
export async function fetchTaskQueueList(namespace, params) {
  return request(`/${namespace}/redis/getPipeLineTaskList/${params}`, {
    method: `GET`,
  });
}

// 删除等待队列任务
export async function deleteTaskQueueItems(namespace, params) {
  return request(`/${namespace}/redis/batchDeletePipeLineTask`, {
    method: `POST`,
    body: params,
  });
}

// 获取当前区域小车状态总体数据
export async function fetchAgvOverallStatus(namespace, params) {
  return request(`/${namespace}/agv/getStandByAndAvailableAgvNumber/${params}`, {
    method: `GET`,
  });
}

// 修改任务优先级
export async function fetchUpdateTaskPriority(namespace, params) {
  return request(`/${namespace}/redis/batchUpdatePipeLineTaskPriority`, {
    method: 'POST',
    body: params,
  });
}

// ************************************** 任务详情弹窗  ************************************** //
// 获取任务详情数据
export async function fetchTaskDetailByTaskId(namespace, params) {
  return request(`/${namespace}/agv-task/agvTaskDetail`, {
    method: `GET`,
    data: params,
  });
}

// 请求重发任务
export async function fetchRestartTask(namespace, params) {
  return request(`/${namespace}/agv-task/action/restartTask`, {
    method: `GET`,
    data: params,
  });
}

// 请求重置任务
export async function fetchResetTask(namespace, params) {
  return request(`/${namespace}/agv-task/action/resetTask`, {
    method: `GET`,
    data: params,
  });
}

// 请求取消任务
export async function fetchCancelTask(namespace, params) {
  return request(`/${namespace}/agv-task/action/cancelTask`, {
    method: `GET`,
    data: params,
  });
}

// 请求恢复任务
export async function fetchRestoreTask(namespace, params) {
  return request(`/${namespace}/agv-task/action/restoreTask`, {
    method: `GET`,
    data: params,
  });
}

//请求小车错误日志
export async function fetchAgvErrorRecord(namespace, params) {
  return request(`/${namespace}/api/agvErrorRecord`, {
    method: 'POST',
    data: params,
  });
}
