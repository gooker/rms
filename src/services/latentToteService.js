import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { LatentTote: LatentToteService } = NameSpace;

// 查询所有模拟任务
export async function fetchAllSimulationTasks() {
  return request(`/${LatentToteService}/simulationTasks`, {
    method: 'GET',
  });
}

/*
 *新增 修改模拟任务
 *POST(新增)
 *PUT(修改)
 */
export async function updateSimulationTask(type, params) {
  return request(`/${LatentToteService}/simulationTask`, {
    method: type,
    data: params,
  });
}

// 批量删除模拟任务
export async function deleteSimulationTasks(ids) {
  return request(`/${LatentToteService}/simulationTasks?ids=${ids}`, {
    method: 'DELETE',
  });
}

/******料箱池订单任务*******/
// 查询订单列表
export async function fetchLatentToteOrders(params) {
  return request(`/${LatentToteService}/orders`, {
    method: 'GET',
    data: params,
  });
}
/*
 *查询订单详情-GET
 */
export async function fetchLatentToteOrderDetail(id) {
  return request(`/${LatentToteService}/order/${id}`, {
    method: 'GET',
  });
}

// 取消任务/修改任务 editType编辑类型：edit(修改),cancel(取消任务)
export async function updateLatentToteOrder(params) {
  return request(`/${LatentToteService}/order/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

/*
 *添加/修改 潜伏料箱货架类型
 *POST(新增)
 *PUT(修改)
 */

export async function addOrUpdateLatentTotePodType(type, params) {
  return request(`/${LatentToteService}/podType`, {
    method: type,
    data: params,
  });
}

export async function fetchLatentTotePodTypes() {
  return request(`/${LatentToteService}/podTypes`, {
    method: 'GET',
  });
}

export async function deleteLatentTotePodTypes(ids) {
  return request(`/${LatentToteService}/podTypes?ids=${ids}`, {
    method: 'DELETE',
  });
}

/******工作站接口*******/
// 查询工作站列表
export async function fetchLatentToteStations(params) {
  return request(`/${LatentToteService}/stations`, {
    method: 'GET',
    data: params,
  });
}

// 查询工作站详情
export async function fetchLatentToteStationDetail(id) {
  return request(`/${LatentToteService}/stations/${id}`, {
    method: 'GET',
  });
}

// 修改工作站
export async function updateLatentToteStation(params) {
  return request(`/${LatentToteService}/station/${params.id}`, {
    method: 'PUT',
    data: params,
  });
}

// 查询异常工作站列表
export async function fetchLatentToteFaultStations(params) {
  return request(`/${LatentToteService}/stationErrors`, {
    method: 'GET',
    data: params,
  });
}
