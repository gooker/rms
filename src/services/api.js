import request from '@/utils/request';
import { NameSpace } from '@/config/config';
import { isStrictNull } from '@/utils/util';

// ************************************** 国际化  ************************************** //
export async function fetchLanguageByAppCode(params) {
  return request(`/${NameSpace.I18N}/getTranslationByParam`, {
    method: 'POST',
    data: params,
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
  return request(`/${NameSpace.Platform}/map/getActiveMap`, { method: 'GET' });
}

// 获取存储区组
export async function fetchStoreCellGroup(mapId) {
  return request(`/${NameSpace.Platform}/map/getStoreCellGroup/${mapId}`, {
    method: 'GET',
  });
}

// 获取料箱货架布局
export async function fetchToteRackLayout() {
  return request(`/${NameSpace.Platform}/rack/getRackLayoutDetail`, {
    method: 'GET',
  });
}

// 获取叉车货架布局
export async function fetchForkLiftPodLayout() {
  return request(`/${NameSpace.Platform}/rack/rackLayout/getRackLayout`, {
    method: 'GET',
  });
}

// ************************************** 小车相关  ************************************** //
export async function fetchAllVehicleList() {
  return request(`/${NameSpace.Platform}/traffic/getAllVehicles`, {
    method: 'GET',
  });
}

// 获取section的指定小车当前信息
export async function fetchVehicleInfo(vehicleId, vehicleType) {
  return request(`/${NameSpace.Platform}/traffic/getVehicle/${vehicleId}/${vehicleType}`, {
    method: `GET`,
  });
}

// 请求Coordinator端小车实时信息
export async function fetchCoordVehicleInfo(vehicleId) {
  return request(`/${NameSpace.Platform}/traffic/getVehicle/${vehicleId}`, {
    method: `GET`,
  });
}

// 请求小车的硬件状态
export async function fetchVehicleHardwareInfo(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle/vehicleHardware/${params.sectionId}/${params.vehicleId}`, {
    method: `GET`,
  });
}

// 请求删除小车(批量)
export async function fetchDeleteVehicleList(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle/deleteVehicle`, {
    method: `POST`,
    data: params,
  });
}

// 小车移出地图
export async function fetchMoveoutVehicles(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle/vehicleRemoveFromMap`, {
    method: 'POST',
    data: params,
  });
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
    `/${NameSpace[vehicleType]}/redis/getExecutingTaskList/${window.localStorage.getItem('sectionId')}`,
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
    `/${NameSpace[vehicleType]}/redis/getPipeLineTaskList/${window.localStorage.getItem('sectionId')}`,
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
    `/${NameSpace[vehicleType]}/vehicle/getStandByAndAvailableVehicleNumber/${window.localStorage.getItem(
      'sectionId',
    )}`,
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

// 获取任务详情数据
export async function fetchTaskDetailByTaskId(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle-task/vehicleTaskDetail`, {
    method: `GET`,
    data: params,
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
export async function fetchCancelTask(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle-task/action/cancelTask`, {
    method: `GET`,
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

// ************************************** 充电策略 ************************************** //
// 查询充电策略
export async function getChargeStrategy(vehicleType, type) {
  const sectionId = window.localStorage.getItem('sectionId');
  return request(`/${NameSpace[vehicleType]}/charger/getChargingStrategy/${sectionId}/${type}`, {
    method: 'GET',
  });
}
// 获取当前状态
export async function getCurrentChargerType(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/charger/getCurrentChargerType`, {
    method: 'GET',
  });
}
// 保存充电策略
export async function saveChargeStrategy(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/charger/updateChargingStrategy`, {
    method: 'POST',
    data: params,
  });
}
// 默认充电策略
export async function getDefaultChargingStrategy(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/charger/getDefaultChargingStrategy`, {
    method: 'GET',
  });
}
// 保存闲时充电策略
export async function saveIdleChargingStrategy(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/charger/updateIdleHours`, {
    method: 'POST',
    data: params,
  });
}
// 获取已配置的闲时充电策略信息
export async function getIdleHoursBySectionId(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/charger/getIdleHoursBySectionId`, {
    method: 'GET',
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

//// 更新系统时区
export async function updateSystemTimezone(timeZone) {
  return request(`/${NameSpace.Platform}/formTemplate/updateFormTemplateValue`, {
    method: 'POST',
    data: { client_timezone_id: timeZone },
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
// 数据库中所有料箱池任务-废弃
export async function dbPoolTasks(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/pool/queryDbTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
//内存中的料箱池任务信息-废弃
export async function memPoolTasks(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/pool/queryMemoryTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
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

export async function fetchToteVehicleList(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/vehicle/getToteVehicle`, {
    method: 'GET',
  });
}

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

//维护/取消维护
export async function fetchMaintain(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/vehicle/action/maintain`, {
    method: 'GET',
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

// 下载固件--固件 查询SFTP上上传的文件名称
export async function fetchFirmWarList(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/file/selectUploadFileNameList`, {
    method: 'GET',
    data: params,
  });
}

// 下载固件--提交
export async function fetchUpgradeFirmwareFile(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/file/upLoadFirmwareFile`, {
    method: 'GET',
    data: params,
  });
}

// 升级
export async function upgradeVehicle(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/file/upgradeVehicle`, {
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

// 初始化故障定义列表
export async function initFaultDefinition(vehicleType) {
  return request(
    `/${NameSpace[vehicleType]}/api/addErrorDefinitionFormJsonFile/${window.localStorage.getItem(
      'sectionId',
    )}`,
    { method: `GET` },
  );
}

// 原始数据
export async function downloadMetaData(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/excel/getVehicleTraceExcel`, {
    method: 'POST',
    data: {
      ...params,
      sectionId: window.localStorage.getItem('sectionId'),
    },
  });
}

/**** 报表中心 ****/
export async function saveReportGroup(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/reportForm/saveFormTemplate`, {
    method: 'POST',
    body: { ...params, sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function deleteReportGroup(vehicleType, id) {
  return request(`/${NameSpace[vehicleType]}/reportForm/deleteFormTemplateById`, {
    method: 'GET',
    body: { id, sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function fetchReportGroupList(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getFormTemplateByUserId`, {
    method: 'GET',
    data: { sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function fetchDimensionDictionary(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getDimensionDictionary`, {
    method: `GET`,
  });
}

export async function fetchReportGroupDataById(vehicleType, params) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getFormTemplateById`, {
    method: `GET`,
    data: { ...params, sectionId: window.localStorage.getItem('sectionId') },
  });
}

//获取报表数据源
export async function fetchReportSourceURL(vehicleType) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getFormSource`, {
    method: 'GET',
    data: { sectionId: window.localStorage.getItem('sectionId') },
  });
}

//获取报表数据源详情(包含维度、筛选等等)
export async function fetchReportSourceDetail(vehicleType, id) {
  return request(`/${NameSpace[vehicleType]}/reportForm/getSourceDescribe`, {
    method: `GET`,
    body: { id, sectionId: window.localStorage.getItem('sectionId') },
  });
}

// 获取报表组报表数据
export async function fetchReportDetailByUrl(params) {
  return request(params.url, {
    method: 'POST',
    data: params,
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
export async function getCustomTaskList() {
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
// 获取小车任务类型集合
export async function fetchTaskTypes() {
  return request(`/${NameSpace.Platform}/task/getTaskType`, {
    method: 'GET',
  });
}

// 获取小车返回指定的区域集合
export async function getBackZone(param) {
  return request(`/${NameSpace.Platform}/vehicle-custom-task/getBackZone`, {
    method: 'GET',
    data: param,
  });
}

// 获取自定义任务可配置参数
export async function fetchCstParams(param) {
  return request(`/${NameSpace.Platform}/custom-task/getFixedVariable`, {
    method: 'POST',
    data: param,
  });
}

// 获取潜伏车动作集
export async function getLatentActions() {
  return request(`/${NameSpace.Platform}/vehicle-custom-task/getAddActions`, {
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

// 查询充电桩信息API
export async function fetchChargeManagerList(params) {
  return request(`/${NameSpace.Platform}/api/charger`, {
    method: 'GET',
    data: params,
  });
}

// 批量解绑充电桩
export async function batchUnbundChargerPile(params) {
  return request(`/${NameSpace.Platform}/charger/batchUnbundlingByHardwareIds`, {
    method: 'POST',
    data: params,
  });
}

// 批量删除充电桩
export async function batchDeleteChargerPile(params) {
  return request(`/${NameSpace.Platform}/charger/batchDeleteByHardwareIds`, {
    method: 'POST',
    data: params,
  });
}

// 新增充电桩
export async function AddChargerPile(params) {
  return request(`/${NameSpace.Platform}/api/saveBindingMapCharger`, {
    method: 'POST',
    data: params,
  });
}
// 清除故障
export async function clearChargerPileFaultById(id) {
  return request(`/${NameSpace.Platform}/charger/actions/clearError/${id}`, {
    method: 'GET',
  });
}
// 查询可用充电桩
export async function fetchAvailableMapChargerList() {
  return request(`/${NameSpace.Platform}/api/availableMapCharger`, {
    method: 'GET',
  });
}

// 获取充电桩故障信息
export async function fetchChargerFaultList(params) {
  return request(`/${NameSpace.Platform}/charger/getChargerError`, {
    method: 'POST',
    data: params,
  });
}

// 系统管理-时区设置
export async function fetchSystemParamByKey(key) {
  return request(`/${NameSpace.Platform}/formTemplate/getParameter/${key}`, {
    method: 'GET',
  });
}

// Web Hook
// 查询所有已创建的Web Hook类型
export async function getAllWebHookTypes() {
  return request(`/${NameSpace.Platform}/webHook/getType`, {
    method: 'GET',
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

// 料箱类-料箱锁
export async function fetchToteLockList() {
  return request(`/${NameSpace.Platform}/lock/getToteLockBySectionId`, {
    method: 'GET',
  });
}

// 料箱类-料箱锁删除
export async function batchDeleteToteLock(params) {
  return request(`/${NameSpace.Platform}/lock/batchDeleteToteLock`, {
    method: 'POST',
    data: params,
  });
}
// 料箱类-货位锁
export async function fetchToteBinLock() {
  return request(`/${NameSpace.Platform}/lock/getBinLockBySectionId`, {
    method: 'GET',
  });
}

// 料箱类-货位锁删除
export async function batchDeleteToteBinLock(params) {
  return request(`/${NameSpace.Platform}/lock/batchDeleteBinLock`, {
    method: 'POST',
    data: params,
  });
}

// 资源管理--潜伏货架-货架管理列表
export async function fetchPodListBySectionId(params) {
  return request(`/${NameSpace.Platform}/pod/list/${window.localStorage.getItem('sectionId')}`, {
    method: 'GET',
  });
}
// 资源管理--潜伏货架-货架管理新增
export async function savePod(params) {
  return request(`/${NameSpace.Platform}/pod`, {
    method: 'POST',
    data: params,
  });
}
// 资源管理--潜伏货架-货架管理批量删除
export async function batchDeletePod(params) {
  return request(
    `/${NameSpace.Platform}/pod/deletePod/${window.localStorage.getItem('sectionId')}`,
    {
      method: 'POST',
      data: params,
    },
  );
}

// 资源管理--潜伏货架--货架分配列表
export async function fetchPodAssignData(params) {
  return request(`/${NameSpace.Platform}/podAndVehicleMatch/getBySectionId`, {
    method: 'GET',
    data: params,
  });
}
// 资源管理--潜伏货架--货架分配保存
export async function savePodAssign(params) {
  return request(`/${NameSpace.Platform}/podAndVehicleMatch/save`, {
    method: 'POST',
    data: params,
  });
}

// 资源管理--潜伏货架--货架分配删除
export async function batchDeletePodAssign(params) {
  return request(`/${NameSpace.Platform}/podAndVehicleMatch/deleteByIdIn`, {
    method: 'POST',
    data: params,
  });
}

// 资源管理--小车分组列表
export async function fetchAllMonitorVehicleGroup() {
  return request(`/${NameSpace.Platform}/mapScope/getAllMonitorVehicleGroup`, {
    method: 'GET',
  });
}

// 资源管理--小车分组新增保存
export async function saveMonitorVehicleGroup(param) {
  return request(`/${NameSpace.Platform}/mapScope/saveMonitorVehicleGroup`, {
    method: 'POST',
    data: param,
  });
}

// 资源管理--小车分组更新保存
export async function updateMonitorVehicleGroup(param) {
  return request(`/${NameSpace.Platform}/mapScope/updateMonitorVehicleGroup`, {
    method: 'POST',
    data: param,
  });
}

// 资源管理--小车分组 批量删除
export async function batchDeleteMonitorVehicleGroup(param) {
  return request(`/${NameSpace.Platform}/mapScope/batchDeleteMonitorVehicleGroup`, {
    method: 'POST',
    data: param,
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

// 清扫模块
// 保存扫地策略
export async function saveCleanLatentStrategy(params, id) {
  let _urlStitching = '';
  if (!isStrictNull(id)) {
    _urlStitching = `/${id}`;
  }
  return request(`/${NameSpace.Platform}/cleanLatent/saveStrategy${_urlStitching}`, {
    method: 'PUT',
    body: params,
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
    body: params,
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
