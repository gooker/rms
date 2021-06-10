import request from '@/utils/Request';
import { NameSpace } from '@/config/Config';

// ************************************** 执行队列  ************************************** //
// 获取执行队列数据
export async function fetchExecutingTaskList(agvType, params) {
  return request(`/${NameSpace[agvType]}/redis/getExecutingTaskList/${params}`, {
    method: `GET`,
  });
}

// 删除执行队列任务
export async function deleteExecutionQTasks(agvType, params) {
  return request(`/${NameSpace[agvType]}/redis/batchDeleteExecutingTask`, {
    method: `POST`,
    data: params,
  });
}

// ************************************** 等待队列  ************************************** //
// 获取等待队列任务
export async function fetchTaskQueueList(agvType, params) {
  return request(`/${NameSpace[agvType]}/redis/getPipeLineTaskList/${params}`, {
    method: `GET`,
  });
}

// 删除等待队列任务
export async function deleteTaskQueueItems(agvType, params) {
  return request(`/${NameSpace[agvType]}/redis/batchDeletePipeLineTask`, {
    method: `POST`,
    data: params,
  });
}

// 获取当前区域小车状态总体数据
export async function fetchAgvOverallStatus(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/getStandByAndAvailableAgvNumber/${params}`, {
    method: `GET`,
  });
}

// 修改任务优先级
export async function fetchUpdateTaskPriority(agvType, params) {
  return request(`/${NameSpace[agvType]}/redis/batchUpdatePipeLineTaskPriority`, {
    method: 'POST',
    body: params,
  });
}

// ************************************** 任务查询 ************************************** //
// 查询当前区域小车任务列表
export async function fetchTaskListByParams(agvType, params) {
  return request(`/${NameSpace[agvType]}/api/agvTask`, {
    method: 'POST',
    data: params,
  });
}

// 取消小车任务
export async function fetchBatchCancelTask(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv-task/batchCancelTask`, {
    method: 'POST',
    data: params,
  });
}

// 获取小车列表
export async function fetchAgvList(agvType, sectionId) {
  return request(`/${NameSpace[agvType]}/agv/${sectionId}`, {
    method: 'GET',
  });
}

// ************************************** 小车列表  ************************************** //
// 请求小车的硬件状态
export async function fetchAgvHardwareInfoById(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/agvHardware/${params.sectionId}/${params.agvId}`, {
    method: `GET`,
  });
}

// 请求删除小车(批量)
export async function fetchDeleteAgvList(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/deleteAgv`, {
    method: `POST`,
    body: params,
  });
}

// 小车移出地图
export async function fetchMoveoutAGVs(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/robotRemoveFromMap`, {
    method: 'POST',
    body: params,
  });
}

// ************************************** 任务详情弹窗  ************************************** //
// 获取任务详情数据
export async function fetchTaskDetailByTaskId(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv-task/agvTaskDetail`, {
    method: `GET`,
    data: params,
  });
}

// 请求重发任务
export async function fetchRestartTask(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv-task/action/restartTask`, {
    method: `GET`,
    data: params,
  });
}

// 请求重置任务
export async function fetchResetTask(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv-task/action/resetTask`, {
    method: `GET`,
    data: params,
  });
}

// 请求取消任务
export async function fetchCancelTask(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv-task/action/cancelTask`, {
    method: `GET`,
    data: params,
  });
}

// 请求恢复任务
export async function fetchRestoreTask(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv-task/action/restoreTask`, {
    method: `GET`,
    data: params,
  });
}

//请求小车错误日志
export async function fetchAgvErrorRecord(agvType, params) {
  return request(`/${NameSpace[agvType]}/api/agvErrorRecord`, {
    method: 'POST',
    data: params,
  });
}
