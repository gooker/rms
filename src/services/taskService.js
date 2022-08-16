import request from '@/utils/request';
import { NameSpace } from '@/config/config';

// 获取任务类型
export async function fetchTaskTypes() {
  return request(`/${NameSpace.Platform}/task/getTaskType`, {
    method: 'GET',
  });
}

// 查询任务详情（如果任务是充电任务，将充电记录也查出来封装返回出去）
export function fetchTaskDetail(taskId) {
  return request(`/${NameSpace.Platform}/task/vehicleTaskDetail`, {
    method: 'GET',
    data: { taskId },
  });
}

// 根据小车获取当前执行的任务(vehicleId为唯一ID)
export function fetchVehicleCurrentTask(vehicleId) {
  return request(`/${NameSpace.Platform}/task/getVehicleCurrentTask`, {
    method: 'GET',
    data: { vehicleId },
  });
}

/**
 * 小车动作
 */
// 空跑
export function emptyRun(param) {
  return request(`/${NameSpace.Platform}/task/empty-run`, {
    method: 'POST',
    data: param,
  });
}

// 小车回休息区
export function goToRest(param) {
  return request(`/${NameSpace.Platform}/task/rest`, {
    method: 'POST',
    data: param,
  });
}

// 无视当前电量，尝试充电
export function goToCharge(param) {
  return request(`/${NameSpace.Platform}/task/tryToCharge`, {
    method: 'POST',
    data: param,
  });
}

/**
 * 标准排程池、执行队列、任务查询
 */
// 查询任务排程池任务
export function fetchPipeLineTasks() {
  return request(`/${NameSpace.Platform}/task/getPipeLineTaskList`, {
    method: 'GET',
  });
}

// 查询执行任务
export function fetchExecutingTasks() {
  return request(`/${NameSpace.Platform}/task/getExecutingTaskList`, {
    method: 'GET',
  });
}

// 分页查询任务记录
export function fetchTaskRecord(param) {
  return request(`/${NameSpace.Platform}/task/vehicleTaskInfo`, {
    method: 'POST',
    data: param,
  });
}

// 取消任务: {taskIdList:[]}
export function cancelTask(param) {
  return request(`/${NameSpace.Platform}/platform/task/cancelTask`, {
    method: 'POST',
    data: param,
  });
}

// 批量更新排程池任务优先级: {taskIdList:[], value: int}
export function updateTaskPriority(param) {
  return request(`/${NameSpace.Platform}/task/batchUpdatePipeLineTaskPriority`, {
    method: 'POST',
    data: param,
  });
}
