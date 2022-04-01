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

/******料箱池订单任务*******/
// 查询订单列表
export async function fetchLatentToteOrders() {
  return request(`/${LatentTote}/orders`, {
    method: 'GET',
  });
}
/*
 *查询订单详情-GET
 */
export async function fetchLatentToteOrderDetail(id) {
  return request(`/${LatentTote}/order/${id}`, {
    method: 'GET',
  });
}

// 取消任务/修改任务 editType编辑类型：edit(修改),cancel(取消任务)
export async function updateLatentToteOrder(params) {
  return request(`/${LatentTote}/order/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}
