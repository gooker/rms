import request from '@/utils/request';

// 执行队列
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

// 任务相关
export async function fetchTaskDetailByTaskId(namespace, params) {
  return request(`/${namespace}/agv-task/agvTaskDetail`, {
    method: `GET`,
    data: params,
  });
}
//请求重发任务
export async function fetchRestartTask(namespace, params) {
  return request(`/${namespace}/agv-task/action/restartTask`, {
    method: `GET`,
    data: params,
  });
}
export async function fetchResetTask(namespace, params) {
  return request(`/${namespace}/agv-task/action/resetTask`, {
    method: `GET`,
    data: params,
  });
}
export async function fetchCancelTask(namespace, params) {
  return request(`/${namespace}/agv-task/action/cancelTask`, {
    method: `GET`,
    data: params,
  });
}
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
