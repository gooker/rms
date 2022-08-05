import request from '@/utils/request';
import { NameSpace } from '@/config/config';
import { isStrictNull } from '@/utils/util';

export async function fetchAlertCount() {
  return request(`/${NameSpace.Platform}/alertCenter/getAlertCenterCount`, {
    method: 'GET',
  });
}

export async function fetchGetProblemDetail(problemId) {
  return request(`/${NameSpace.Platform}/alertCenter/getAlertCenterById/${problemId}`, {
    method: 'GET',
  });
}

// ************************************** 地图  ************************************** //
export async function activeMap(mapId) {
  const sectionId = window.localStorage.getItem('sectionId');
  return request(`/${NameSpace.Platform}/map/active`, {
    method: 'POST',
    data: { id: mapId, sectionId },
  });
}

// 获取当前已激活的地图
export async function fetchActiveMap() {
  return request(`/${NameSpace.Platform}/map/getActiveMap`, {
    method: 'GET',
  });
}

// ************************************** 小车相关  ************************************** //
export async function fetchAllVehicleList() {
  return request(`/${NameSpace.Platform}/vehicle/getAllVehicles`, {
    method: 'GET',
  });
}

// 获取section的指定小车当前信息
export async function fetchVehicleInfo(vehicleId, vehicleType) {
  return request(`/${NameSpace.Platform}/vehicle/getVehicle/${vehicleId}/${vehicleType}`, {
    method: `GET`,
  });
}

// 请求小车的硬件状态
export async function fetchVehicleHardwareInfo(vehicleType, params) {
  return request(
    `/${NameSpace[vehicleType]}/vehicle/vehicleHardware/${params.sectionId}/${params.vehicleId}`,
    {
      method: `GET`,
    },
  );
}

// 获取当前小车实时运行信息
export async function fetchVehicleRunningInfo(params) {
  return request(`/${NameSpace.Platform}/problemHandling/getVehicleErrorMessage`, {
    method: 'GET',
    data: params,
  });
}

// ************************************** 执行队列  ************************************** //
// 获取执行队列数据
export async function fetchExecutingTaskList(vehicleType, params) {
  return request(
    `/${NameSpace[vehicleType]}/redis/getExecutingTaskList/${window.localStorage.getItem(
      'sectionId',
    )}`,
    {
      method: `GET`,
    },
  );
}

// 删除执行队列任务
export async function deleteExecutionQTasks(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/redis/batchDeleteExecutingTask`, {
    method: `POST`,
    data: params,
  });
}

// ************************************** 等待队列  ************************************** //
// 获取等待队列任务
export async function fetchTaskQueueList(vehicleType) {
  return request(
    `/${NameSpace[vehicleType]}/redis/getPipeLineTaskList/${window.localStorage.getItem(
      'sectionId',
    )}`,
    {
      method: `GET`,
    },
  );
}

// 删除等待队列任务
export async function deleteTaskQueueItems(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/redis/batchDeletePipeLineTask`, {
    method: `POST`,
    data: params,
  });
}

// 获取当前区域小车状态总体数据
export async function fetchVehicleOverallStatus(vehicleType) {
  return request(
    `/${
      NameSpace[vehicleType]
    }/vehicle/getStandByAndAvailableVehicleNumber/${window.localStorage.getItem('sectionId')}`,
    {
      method: `GET`,
    },
  );
}

// 修改任务优先级
export async function fetchUpdateTaskPriority(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/redis/batchUpdatePipeLineTaskPriority`, {
    method: 'POST',
    data: params,
  });
}

// ************************************** 任务查询 ************************************** //
// 查询当前区域小车任务列表
export async function fetchVehicleTaskList(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/api/vehicleTask`, {
    method: 'POST',
    data: params,
  });
}

// 小车-任务日志
export async function getVehicleTaskLog(param) {
  return request(`/${NameSpace.Platform}/alertCenter/getVehicleTaskLog`, {
    method: 'GET',
    data: param,
  });
}

// 小车详情-告警信息
export async function getAlertCentersByTaskIdOrVehicleId(param) {
  return request(`/${NameSpace.Platform}/alertCenter/getAlertCentersByTaskIdOrVehicleId`, {
    method: 'GET',
    data: param,
  });
}

// 请求取消任务
export async function fetchBatchCancelTask(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle-task/batchCancelTask`, {
    method: 'POST',
    data: params,
  });
}

// 请求重发任务
export async function fetchRestartTask(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle-task/action/restartTask`, {
    method: `GET`,
    data: params,
  });
}

// 请求重置任务
export async function fetchResetTask(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle-task/action/resetTask`, {
    method: `GET`,
    data: params,
  });
}

// 请求取消任务
export async function fetchCancelTask(params) {
  return request(`/${NameSpace.Platform}/task/cancelTask`, {
    method: `POST`,
    data: params,
  });
}

// 请求恢复任务
export async function fetchRestoreTask(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle-task/action/restoreTask`, {
    method: `GET`,
    data: params,
  });
}

//// 获取参数模版
export async function fetchSystemParamFormData(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/formTemplate/getFormTemplate`, {
    method: 'GET',
    data: params,
  });
}

//// 更新系统参数
export async function updateSystemParams(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/formTemplate/updateFormTemplateValue`, {
    method: 'POST',
    data: params,
  });
}

// 获取打分算法模版
export async function fetchLatentToteParamFormData(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/paramTemplate/getParamTemplate`, {
    method: 'GET',
    data: params,
  });
}

// 更新打分算法
export async function updateLatentToteSystemParams(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/paramTemplate/updateParamTemplateValue`, {
    method: 'POST',
    data: params,
  });
}

/******料箱池任务 start*********/
//红外料箱任务池任务查询
export async function fetchPoolTasks(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/pool/queryTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
//任务取消
export async function cancelTotePoolTask(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/pool/cancelTotePoolTasks`, {
    method: 'POST',
    data: params,
  });
}
/******料箱池任务 end*********/

/**tote vehicle列表***/
/***批量升级***/
export async function fetchVehicleFileStatusList(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/vehicle/getVehicleFileStatusList`, {
    method: 'GET',
  });
}
export async function fetchUpdateFileTask(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/file/updateFileTask`, {
    method: 'POST',
    data: params,
  });
}


// 请求切换小车手动模式
export async function fetchManualMode(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle/action/manualMode`, {
    method: 'GET',
    data: params,
  });
}


/**** 日志下载 ****/
// 下载小车上的日志文件到云端SFTP
export async function startCreatingLog(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/file/downLoadLogToSFTP`, {
    method: `GET`,
    data: {
      sectionId: window.localStorage.getItem('sectionId'),
      ...params,
    },
  });
}

// SFTP上查询下载日志文件
export async function fetchVehicleLog(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/file/selectFileTaskList`, {
    method: 'GET',
    data: { sectionId: window.localStorage.getItem('sectionId'), ...params },
  });
}

// 强制重置
export async function forceResetLogGeneration(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/file/updateFileTask`, {
    method: `POST`,
    data: params,
  });
}

// 下载日志
export async function downloadLogFromSFTP(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/file/downloadFileFromSFTP`, {
    method: `GET`,
    data: { sectionId: window.localStorage.getItem('sectionId'), ...params },
  });
}

/**** 故障信息 ****/
// 提交故障定义
export async function submitFaultDefinition(vehicleType, params) {
  return request(
    `/${NameSpace[vehicleType]}/api/addErrorDefinition/${window.localStorage.getItem('sectionId')}`,
    {
      method: `POST`,
      data: params,
    },
  );
}

// 删除故障定义
export async function deleteFaultDefinition(vehicleType, params) {
  return request(
    `/${NameSpace[vehicleType]}/api/batchDeleteErrorDefinition/${window.localStorage.getItem(
      'sectionId',
    )}`,
    {
      method: `POST`,
      data: params,
    },
  );
}

// 获取故障定义
export async function fetchDefinedFaults(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/api/selectErrorDefinitionList`, {
    method: `GET`,
    data: { sectionId: window.localStorage.getItem('sectionId') },
  });
}

// 获取小车故障信息
export async function fetchVehicleErrorRecord(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/api/vehicleErrorRecord`, {
    method: 'POST',
    data: {
      ...params,
      sectionId: window.localStorage.getItem('sectionId'),
    },
  });
}

// 资源分组-分组管理
export async function getCustomGroupJson() {
  return request(`/${NameSpace.Platform}/custom/getCustomGroupJson`, {
    method: 'GET',
  });
}

export async function saveCustomGroup(param) {
  return request(`/${NameSpace.Platform}/custom/saveCustomGroup `, {
    method: 'POST',
    data: param,
  });
}

export async function getCustomGroup(params) {
  return request(`/${NameSpace.Platform}/custom/getCustomGroup`, {
    method: 'GET',
    data: params,
  });
}
// 根据mapId和Id删除 [{}]
export async function deleteCustomGroup(param) {
  return request(`/${NameSpace.Platform}/custom/batchDeleteCustomGroup `, {
    method: 'POST',
    data: param,
  });
}

// 保存单条数据
export async function saveOneCustomGroup(param) {
  return request(`/${NameSpace.Platform}/custom/saveOneCustomGroup `, {
    method: 'POST',
    data: param,
  });
}

// ********************** 任务触发器  ********************** //
// 保存任务触发器
export async function saveTaskTrigger(param) {
  return request(`/${NameSpace.Platform}/customTrigger/saveCustomTaskTrigger`, {
    method: 'POST',
    data: param,
  });
}

// 获取所有新增的任务触发器(参数status可选)
export async function getAllTaskTriggers(param) {
  return request(`/${NameSpace.Platform}/customTrigger/getAllCustomTaskTrigger`, {
    method: 'GET',
    data: param,
  });
}

// 删除任务触发器   GET(id)
export async function deleteTaskTrigger(param) {
  return request(`/${NameSpace.Platform}/customTrigger/deleteCustomTaskTriggerById`, {
    method: 'GET',
    data: param,
  });
}

// 切换任务触发器状态
export async function switchTriggerState(param) {
  return request(`/${NameSpace.Platform}/customTrigger/customTrigger`, {
    method: 'POST',
    data: param,
  });
}

// ********************** 自定义任务  ********************** //
// 获取自定义任务-用于选择任务触发
export async function fetchCustomTaskList() {
  return request(`/${NameSpace.Platform}/custom-task/getAllCustomTaskBySectionId`, {
    method: 'GET',
  });
}
// 保存自定义任务
export async function saveCustomTask(param) {
  return request(`/${NameSpace.Platform}/custom-task/saveCustomTask`, {
    method: 'POST',
    data: param,
  });
}

// 删除自定义任务
export async function deleteCustomTasksById(param) {
  return request(`/${NameSpace.Platform}/custom-task/deleteAllCustomTaskByIds`, {
    method: 'POST',
    data: param,
  });
}

// 执行自定义任务
export async function executeCustomTask(param) {
  return request(`/${NameSpace.Platform}/custom-task/runCustomTask`, {
    method: 'POST',
    data: param,
  });
}

// 获取业务模型数据
export async function fetchCustomParamType(param) {
  return request(`/${NameSpace.Platform}/custom-task/getCustomParamType`, {
    method: 'GET',
    data: param,
  });
}

// 获取业务模型可锁资源
export async function getFormModelLockResource() {
  return request(`/${NameSpace.Platform}/custom-task/getLockResource`, {
    method: 'GET',
  });
}

// ********************** 任务限流器  ********************** //
// 任务类型限流
export async function getVehicleTasksByType() {
  return request(`/${NameSpace.Platform}/customLimiter/getVehicleTaskType`, {
    method: 'GET',
  });
}
// 资源组限流
export async function getVehicleTasksByCustomGroup(param) {
  return request(`/${NameSpace.Platform}/customLimiter/getCustomGroup`, {
    method: 'GET',
    data: param,
  });
}

// 限流保存-编辑
export async function saveTaskLimit(param) {
  return request(`/${NameSpace.Platform}/customLimiter/saveTaskLimit`, {
    method: 'POST',
    data: param,
  });
}

// 任务限流器列表 参数mapId 选填type
export async function getTaskLimit(param) {
  return request(`/${NameSpace.Platform}/customLimiter/getTaskLimitByMapId`, {
    method: 'GET',
    data: param,
  });
}

// 任务限流器列表 ids
export async function deleteTaskLimit(param) {
  return request(`/${NameSpace.Platform}/customLimiter/deleteTaskLimitById`, {
    method: 'POST',
    data: param,
  });
}

// 操作日志
export async function fetchUserActionLogs(params) {
  return request(`/${NameSpace.Platform}/apiLog/getApiLogs`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchAppModules(params) {
  return request(`/${NameSpace.Platform}/apiLog/getModules`, {
    method: 'GET',
    data: params,
  });
}

// 获取充电桩故障信息
export async function fetchChargerFaultList(params) {
  return request(`/${NameSpace.Platform}/charger/getChargerError`, {
    method: 'POST',
    data: params,
  });
}

// 查询所有MQ Queue
export async function getAllQueues() {
  return request(`/${NameSpace.Platform}/webHook/getAllQueue`, {
    method: 'GET',
  });
}

// 查询所有已创建的Web Hook接口
export async function getAllWebHooks() {
  return request(`/${NameSpace.Platform}/webHook/getAllWebHook`, {
    method: 'GET',
  });
}

// 保存Web Hook接口
export async function saveWebHook(param) {
  return request(`/${NameSpace.Platform}/webHook/saveWebHook`, {
    method: 'POST',
    data: param,
  });
}

// 删除 Web Hook
export async function deleteWebHooks(param) {
  return request(`/${NameSpace.Platform}/webHook/deleteWebHookById`, {
    method: 'POST',
    data: param,
  });
}

// 获取目标点锁
export async function fetchTargetCellLockList() {
  return request(`/${NameSpace.Platform}/resource/lock/getTargetCellLockList`, {
    method: 'GET',
  });
}

// 批量删除目标点锁
export async function fetchBatchDeleteTargetCellLock(params) {
  return request(`/${NameSpace.Platform}/resource/lock/batchDeleteTargetCellLock`, {
    method: 'POST',
    data: params,
  });
}

// 获取车辆锁
export async function fetchVehicleTaskLockList() {
  return request(`/${NameSpace.Platform}/resource/lock/getVehicleTaskLockList`, {
    method: `GET`,
  });
}
//车辆锁删除
export async function batchDeleteVehicleTaskLock(params) {
  return request(`/${NameSpace.Platform}/resource/lock/batchDeleteVehicleTaskLock`, {
    method: 'POST',
    data: params,
  });
}

// 获取存储点锁
export async function fetchStorageLockList() {
  return request(`/${NameSpace.Platform}/resource/lock/getStoreCellLockList`, {
    method: 'GET',
  });
}

// 批量删除存储点锁
export async function batchDeleteStorageLock(params) {
  return request(`/${NameSpace.Platform}/resource/lock/batchDeleteStoreCellLock`, {
    method: 'POST',
    data: params,
  });
}

// 获取载具任务锁
export async function fetchLoadTaskLockList() {
  return request(`/${NameSpace.Platform}/resource/lock/getLoadTaskLockList`, {
    method: 'GET',
  });
}
// 批量删除pod任务锁
export async function batchDeletePodTaskLock(params) {
  return request(`/${NameSpace.Platform}/resource/lock/batchDeleteLoadTaskLock`, {
    method: 'POST',
    data: params,
  });
}

/******* 广播频道  *******/
// 查看已创建的广播频道
export async function fetchBroadCastChannel() {
  return request(`/${NameSpace.Platform}/alertCenter/getBroadCastChannel`, {
    method: 'GET',
  });
}

// 保存广播频道
export async function saveBroadCastChannel(params) {
  return request(`/${NameSpace.Platform}/alertCenter/saveBroadCastChannel`, {
    method: 'POST',
    data: params,
  });
}

// 删除广播频道
export async function deleteBroadCastChannels(params) {
  return request(`/${NameSpace.Platform}/alertCenter/deleteBroadCastChannel`, {
    method: 'POST',
    data: params,
  });
}

// 获取用户频道订阅信息
export async function fetchChannelSubscription(userId) {
  return request(`/${NameSpace.Platform}/alertCenter/getChannelSubscription`, {
    method: 'GET',
    data: { userId },
  });
}

// 保存用户订阅
export async function saveChannelSubscription(params) {
  return request(`/${NameSpace.Platform}/alertCenter/saveChannelSubscription`, {
    method: 'POST',
    data: params,
  });
}

// 删除用户订阅
export async function deleteChannelSubscription(params) {
  return request(`/${NameSpace.Platform}/alertCenter/deleteChannelSubscription`, {
    method: 'POST',
    data: params,
  });
}

/******报表**********/
// 二维码健康
export async function fetchCodeHealth(params) {
  return request(`/${NameSpace.Platform}/statistic/getCellCode`, {
    method: 'POST',
    data: params,
  });
}

// 小车健康
export async function fetchVehicleHealth(params) {
  return request(`/${NameSpace.Platform}/statistic/getVehicleHealth`, {
    method: 'POST',
    data: params,
  });
}

// 小车负载报表
export async function fetchVehicleload(params) {
  return request(`/${NameSpace.Platform}/statistic/getVehicleLoad`, {
    method: 'POST',
    data: params,
  });
}
//任务负载报表
export async function fetchTaskLoad(params) {
  return request(`/${NameSpace.Platform}/statistic/getTaskLoad`, {
    method: 'POST',
    data: params,
  });
}

/************************ 清扫模块 ************************/
// 保存扫地策略
export async function saveCleanLatentStrategy(params, id) {
  let _urlStitching = '';
  if (!isStrictNull(id)) {
    _urlStitching = `/${id}`;
  }
  return request(`/${NameSpace.Platform}/cleanLatent/saveStrategy${_urlStitching}`, {
    method: 'PUT',
    data: params,
  });
}

// 查询清扫策略
export async function getCleanStrategy() {
  return request(`/${NameSpace.Platform}/cleanLatent/getCleanStrategy`, {
    method: 'GET',
  });
}

// 查询清扫记录
export async function fetchCleaningTaskHistory(params) {
  return request(`/${NameSpace.Platform}/cleanLatent/cleaningTaskHistory`, {
    method: 'POST',
    data: params,
  });
}

// 查询清扫计划
export async function fetchCleaningPlan() {
  return request(`/${NameSpace.Platform}/cleanLatent/cleaningPlan`, {
    method: 'GET',
  });
}

// 查询清扫计划当前模式
export async function fetchCleaningPlanMode() {
  return request(`/${NameSpace.Platform}/cleanLatent/cleaningPlanSchema`, {
    method: 'GET',
  });
}

// 请求器
export async function fetchRequestorList(params) {
  return request(`/${NameSpace.Platform}/api/getDataApi`, {
    method: 'GET',
    data: params,
  });
}
export async function fetchSaveAPI(params) {
  return request(`/${NameSpace.Platform}/api/saveDataApi`, {
    method: 'POST',
    data: params,
  });
}
export async function fetchBatchSaveAPI(params) {
  return request(`/${NameSpace.Platform}/api/batchSaveDataApi`, {
    method: 'POST',
    data: params,
  });
}
// vehicleType
export async function fetchUpdateAPI(params) {
  return request(`/${NameSpace.Platform}/api/updateDataApi`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchDeleteAPI(params) {
  return request(`/${NameSpace.Platform}/api/batchDeleteDataApi`, {
    method: 'DELETE',
    data: params,
  });
}

// 获取 编辑富文本list
export async function getAllRichText() {
  return request(`/${NameSpace.Platform}/richText/getAllRichText`, {
    method: 'GET',
  });
}

// 删除 编辑富文本
export async function deleteByRichIds(param) {
  return request(`/${NameSpace.Platform}/richText/deleteByIds`, {
    method: 'POST',
    data: param,
  });
}

// 保存 编辑富文本
export async function saveRichText(param) {
  return request(`/${NameSpace.Platform}/richText/saveRichText`, {
    method: 'POST',
    data: param,
  });
}

/************************** 时区 **************************/
// 获取系统时区
export async function fetchSystemTimeZone() {
  return request(`/${NameSpace.Platform}/sso/environment/getSystemTimeZone`, {
    method: 'GET',
  });
}

// 修改系统时区
export async function setSystemTimeZone(timeZone) {
  return request(`/${NameSpace.Platform}/sso/environment/setSystemTimeZone`, {
    method: 'POST',
    data: { timeZone },
  });
}

// 获取所有的时区时间
export async function fetchAllTimeZone() {
  return request(`/${NameSpace.Platform}/sso/environment/getAllTimeZone`, {
    method: 'GET',
  });
}
