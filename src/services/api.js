import request from '@/utils/request';
import { NameSpace } from '@/config/config';

// ************************************** 用户管理  ************************************** //
//获取当前登陆对象
export async function getCurrentUser() {
  return request('/sso/user/getUser', {
    method: 'GET',
  });
}

// ************************************** 执行队列  ************************************** //
// 获取执行队列数据-sorter
export async function fetchExecutingTaskList(agvType, params) {
  return request(`/${NameSpace[agvType]}/redis/getExecutingTaskList/${params}`, {
    method: `GET`,
  });
}

// 获取执行队列数据-tote TODO: 后端兼容之后要删除
export async function fetchToteExecutingTaskList(agvType) {
  return request(`/${NameSpace[agvType]}/redis/getExecutingTaskList`, {
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

// 获取等待队列任务-Tote   TODO: 后端兼容之后要删除
export async function fetchToteTaskQueueList(agvType) {
  return request(`/${NameSpace[agvType]}/redis/getPipeLineTaskList`, {
    method: `GET`,
  });
}
// 获取当前区域小车状态总体数据  TODO: 后端兼容之后要删除
export async function fetchToteAgvOverallStatus(agvType) {
  return request(`/${NameSpace[agvType]}/agv/getStandByAndAvailableAgvNumber`, {
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
    data: params,
  });
}

// ************************************** 小车相关  ************************************** //
// 获取小车列表
export async function fetchAgvList(agvType, sectionId) {
  return request(`/${NameSpace[agvType]}/agv/${sectionId}`, {
    method: 'GET',
  });
}

// 请求WCS端小车实时信息
export async function fetchAgvInfo(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/${params.sectionId}/${params.agvId}`, {
    method: `GET`,
  });
}

// 请求Coordinator端小车实时信息
export async function fetchCoordAgvInfo(agvId) {
  return request(`/${NameSpace.Coordinator}/traffic/getAGV/${agvId}`, {
    method: `GET`,
  });
}

// 请求小车的硬件状态
export async function fetchAgvHardwareInfo(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/agvHardware/${params.sectionId}/${params.agvId}`, {
    method: `GET`,
  });
}

// 请求删除小车(批量)
export async function fetchDeleteAgvList(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/deleteAgv`, {
    method: `POST`,
    data: params,
  });
}

// 小车移出地图
export async function fetchMoveoutAGVs(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/robotRemoveFromMap`, {
    method: 'POST',
    data: params,
  });
}

// ************************************** 任务查询 ************************************** //
// 查询当前区域小车任务列表
export async function fetchAgvTaskList(agvType, params) {
  return request(`/${NameSpace[agvType]}/api/agvTask`, {
    method: 'POST',
    data: params,
  });
}

// 获取任务详情数据
export async function fetchTaskDetailByTaskId(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv-task/agvTaskDetail`, {
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

// 请求取消任务
export async function fetchBatchCancelTask(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv-task/batchCancelTask`, {
    method: 'POST',
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

// ************************************** 充电策略 ************************************** //
// 查询充电策略
export async function getChargeStrategy(agvType, type) {
  const sectionId = window.localStorage.getItem('sectionId');
  return request(`/${NameSpace[agvType]}/charger/getChargingStrategy/${sectionId}/${type}`, {
    method: 'GET',
  });
}
// 获取当前状态
export async function getCurrentChargerType(agvType) {
  return request(`/${NameSpace[agvType]}/charger/getCurrentChargerType`, {
    method: 'GET',
  });
}
// 保存充电策略
export async function saveChargeStrategy(agvType, params) {
  return request(`/${NameSpace[agvType]}/charger/updateChargingStrategy`, {
    method: `POST`,
    data: params,
  });
}
// 默认充电策略
export async function getDefaultChargingStrategy(agvType) {
  return request(`/${NameSpace[agvType]}/charger/getDefaultChargingStrategy`, {
    method: 'GET',
  });
}
// 保存闲时充电策略
export async function saveIdleChargingStrategy(agvType, params) {
  return request(`/${NameSpace[agvType]}/charger/updateIdleHours`, {
    method: 'POST',
    data: params,
  });
}
// 获取已配置的闲时充电策略信息
export async function getIdleHoursBySectionId(agvType) {
  return request(`/${NameSpace[agvType]}/charger/getIdleHoursBySectionId`, {
    method: 'GET',
  });
}

//// 获取参数模版
export async function fetchSystemParamFormData(agvType,params) {
  return request(`/${NameSpace[agvType]}/formTemplate/getFormTemplate`, {
    method: 'GET',
    data:params,
  });
}

//// 更新系统参数
export async function updateSystemParams(agvType, params) {
  return request(`/${NameSpace[agvType]}/formTemplate/updateFormTemplateValue`, {
    method: 'POST',
    data: params,
  });
}


/******料箱池任务 start*********/ 
// 数据库中所有料箱池任务-废弃
export async function dbPoolTasks(agvType,params) {
  return request(`/${NameSpace[agvType]}/pool/queryDbTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
//内存中的料箱池任务信息-废弃
export async function memPoolTasks(agvType,params) {
  return request(`/${NameSpace[agvType]}/pool/queryMemoryTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
//红外料箱任务池任务查询
export async function fetchPoolTasks(agvType,params) {
  return request(`/${NameSpace[agvType]}/pool/queryTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
//任务取消
export async function cancelTotePoolTask(agvType,params) {
  return request(`/${NameSpace[agvType]}/pool/cancelTotePoolTasks`, {
    method: 'POST',
    data: params,
  });
}

/******料箱池任务 end*********/ 


/**tote agv列表***/ 

export async function fetchToteAgvList(agvType) {
  return request(`/${NameSpace[agvType]}/agv/getToteAGV`, {
    method: 'GET',
  });
}


