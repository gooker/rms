import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { LatentTote } = NameSpace;

// 查询所有模拟任务
export async function fetchAllSimulationTasks() {
  return request(`/${LatentTote}/simulationTasks`, {
    method: 'GET',
  });
}

/*
 *新增 修改模拟任务
 *POST(新增)
 *PUT(修改)
 */
export async function updateSimulationTask(type, params) {
  return request(`/${LatentTote}/simulationTask`, {
    method: type,
    data: params,
  });
}

// 批量删除模拟任务
export async function deleteSimulationTasks(ids) {
  return request(`/${LatentTote}/simulationTasks?ids=${ids}`, {
    method: 'DELETE',
  });
}
