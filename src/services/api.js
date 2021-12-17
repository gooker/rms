import request from '@/utils/request';
import { NameSpace } from '@/config/config';

export async function fetchAllTaskTypes() {
  return request(`/${NameSpace.Coordinator}/traffic/getTaskTypeByRobot`, {
    method: 'GET',
  });
}

// ************************************** 国际化  ************************************** //
export async function fetchLanguageByAppCode(params) {
  return request(`/translation/getTranslationByParam`, {
    method: 'POST',
    data: params,
  });
}

// ************************************** 用户管理  ************************************** //
//获取当前登陆对象
export async function getCurrentUser() {
  return request('/sso/user/getUser', {
    method: 'GET',
  });
}

// 获取当前已激活的地图
export async function fetchActiveMap() {
  return request(`/${NameSpace.Coordinator}/map/getActiveMap`, { method: 'GET' });
}

// 获取存储区组
export async function fetchStoreCellGroup(mapId) {
  return request(`/${NameSpace.Coordinator}/map/getStoreCellGroup/${mapId}`, {
    method: 'GET',
  });
}

// 获取料箱货架布局
export async function fetchToteRackLayout(params) {
  return request(`/${NameSpace.Tote}/rack/getRackLayoutDetail`, {
    method: 'GET',
  });
}

// 获取叉车货架布局
export async function fetchForkLiftPodLayout() {
  return request(`/${NameSpace.ForkLifting}/rack/rackLayout/getRackLayout`, {
    method: 'GET',
  });
}

// ************************************** 小车相关  ************************************** //
// 获取所有车类型
export async function fetchAllAgvType() {
  return request(`/${NameSpace.Coordinator}/map/getAllRobotType`, {
    method: 'GET',
  });
}

// 获取WCS端小车列表-1
export async function fetchAgvList(agvType) {
  return request(`/${NameSpace[agvType]}/agv/${window.localStorage.getItem('sectionId')}`, {
    method: 'GET',
  });
}

// 获取WCS端小车列表-2
export async function fetchWCSAgvList(agvType) {
  return request(`/${NameSpace[agvType]}/agv/monitor/all_agv`, {
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
export async function fetchTaskQueueList(agvType) {
  return request(
    `/${NameSpace[agvType]}/redis/getPipeLineTaskList/${window.localStorage.getItem('sectionId')}`,
    {
      method: `GET`,
    },
  );
}

// 删除等待队列任务
export async function deleteTaskQueueItems(agvType, params) {
  return request(`/${NameSpace[agvType]}/redis/batchDeletePipeLineTask`, {
    method: `POST`,
    data: params,
  });
}

// 获取当前区域小车状态总体数据
export async function fetchAgvOverallStatus(agvType) {
  return request(
    `/${NameSpace[agvType]}/agv/getStandByAndAvailableAgvNumber/${window.localStorage.getItem(
      'sectionId',
    )}`,
    {
      method: `GET`,
    },
  );
}

// 修改任务优先级
export async function fetchUpdateTaskPriority(agvType, params) {
  return request(`/${NameSpace[agvType]}/redis/batchUpdatePipeLineTaskPriority`, {
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
    method: 'POST',
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
export async function fetchSystemParamFormData(agvType, params) {
  return request(`/${NameSpace[agvType]}/formTemplate/getFormTemplate`, {
    method: 'GET',
    data: params,
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
export async function dbPoolTasks(agvType, params) {
  return request(`/${NameSpace[agvType]}/pool/queryDbTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
//内存中的料箱池任务信息-废弃
export async function memPoolTasks(agvType, params) {
  return request(`/${NameSpace[agvType]}/pool/queryMemoryTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
//红外料箱任务池任务查询
export async function fetchPoolTasks(agvType, params) {
  return request(`/${NameSpace[agvType]}/pool/queryTotePoolTaskInfo`, {
    method: 'GET',
    data: params,
  });
}
//任务取消
export async function cancelTotePoolTask(agvType, params) {
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

/***批量升级***/
export async function fetchAgvFileStatusList(agvType) {
  return request(`/${NameSpace[agvType]}/agv/getAgvFileStatusList`, {
    method: 'GET',
  });
}
export async function fetchUpdateFileTask(agvType, params) {
  return request(`/${NameSpace[agvType]}/file/updateFileTask`, {
    method: 'POST',
    data: params,
  });
}

//维护/取消维护
export async function fetchMaintain(agvType, params) {
  return request(`/${NameSpace[agvType]}/agv/action/maintain`, {
    method: 'GET',
    data: params,
  });
}

// 下载固件--固件 查询SFTP上上传的文件名称
export async function fetchFirmWarList(agvType, params) {
  return request(`/${NameSpace[agvType]}/file/selectUploadFileNameList`, {
    method: 'GET',
    data: params,
  });
}

// 下载固件--提交
export async function fetchUpgradeFirmwareFile(agvType, params) {
  return request(`/${NameSpace[agvType]}/file/upLoadFirmwareFile`, {
    method: 'GET',
    data: params,
  });
}

// 升级
export async function upgradeAGV(agvType, params) {
  return request(`/${NameSpace[agvType]}/file/upgradeAGV`, {
    method: 'GET',
    data: params,
  });
}

/**** 日志下载 ****/
// 下载小车上的日志文件到云端SFTP
export async function startCreatingLog(agvType, params) {
  return request(`/${NameSpace[agvType]}/file/downLoadLogToSFTP`, {
    method: `GET`,
    data: {
      sectionId: window.localStorage.getItem('sectionId'),
      ...params,
    },
  });
}

// SFTP上查询下载日志文件
export async function fetchAgvLog(agvType, params) {
  return request(`/${NameSpace[agvType]}/file/selectFileTaskList`, {
    method: 'GET',
    data: { sectionId: window.localStorage.getItem('sectionId'), ...params },
  });
}

// 强制重置
export async function forceResetLogGeneration(agvType, params) {
  return request(`/${NameSpace[agvType]}/file/updateFileTask`, {
    method: `POST`,
    data: params,
  });
}

// 下载日志
export async function downloadLogFromSFTP(agvType, params) {
  return request(`/${NameSpace[agvType]}/file/downloadFileFromSFTP`, {
    method: `GET`,
    data: { sectionId: window.localStorage.getItem('sectionId'), ...params },
  });
}

/**** 故障信息 ****/
// 提交故障定义
export async function submitFaultDefinition(agvType, params) {
  return request(
    `/${NameSpace[agvType]}/api/addErrorDefinition/${window.localStorage.getItem('sectionId')}`,
    {
      method: `POST`,
      data: params,
    },
  );
}

// 删除故障定义
export async function deleteFaultDefinition(agvType, params) {
  return request(
    `/${NameSpace[agvType]}/api/batchDeleteErrorDefinition/${window.localStorage.getItem(
      'sectionId',
    )}`,
    {
      method: `POST`,
      data: params,
    },
  );
}

// 获取故障定义
export async function fetchDefinedFaults(agvType) {
  return request(`/${NameSpace[agvType]}/api/selectErrorDefinitionList`, {
    method: `GET`,
    data: { sectionId: window.localStorage.getItem('sectionId') },
  });
}

// 获取小车故障信息
export async function fetchAgvErrorRecord(agvType, params) {
  return request(`/${NameSpace[agvType]}/api/agvErrorRecord`, {
    method: 'POST',
    data: {
      ...params,
      sectionId: window.localStorage.getItem('sectionId'),
    },
  });
}

// 初始化故障定义列表
export async function initFaultDefinition(agvType) {
  return request(
    `/${NameSpace[agvType]}/api/addErrorDefinitionFormJsonFile/${window.localStorage.getItem(
      'sectionId',
    )}`,
    { method: `GET` },
  );
}

// 原始数据
export async function downloadMetaData(agvType, params) {
  return request(`/${NameSpace[agvType]}/excel/getAgvTraceExcel`, {
    method: 'POST',
    data: {
      ...params,
      sectionId: window.localStorage.getItem('sectionId'),
    },
  });
}

/**** 报表中心 ****/
export async function saveReportGroup(agvType, params) {
  return request(`/${NameSpace[agvType]}/reportForm/saveFormTemplate`, {
    method: 'POST',
    body: { ...params, sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function deleteReportGroup(agvType, id) {
  return request(`/${NameSpace[agvType]}/reportForm/deleteFormTemplateById`, {
    method: 'GET',
    body: { id, sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function fetchReportGroupList(agvType) {
  return request(`/${NameSpace[agvType]}/reportForm/getFormTemplateByUserId`, {
    method: 'GET',
    data: { sectionId: window.localStorage.getItem('sectionId') },
  });
}

export async function fetchDimensionDictionary(agvType) {
  return request(`/${NameSpace[agvType]}/reportForm/getDimensionDictionary`, {
    method: `GET`,
  });
}

export async function fetchReportGroupDataById(agvType, params) {
  return request(`/${NameSpace[agvType]}/reportForm/getFormTemplateById`, {
    method: `GET`,
    data: { ...params, sectionId: window.localStorage.getItem('sectionId') },
  });
}

//获取报表数据源
export async function fetchReportSourceURL(agvType) {
  return request(`/${NameSpace[agvType]}/reportForm/getFormSource`, {
    method: 'GET',
    data: { sectionId: window.localStorage.getItem('sectionId') },
  });
}

//获取报表数据源详情(包含维度、筛选等等)
export async function fetchReportSourceDetail(agvType, id) {
  return request(`/${NameSpace[agvType]}/reportForm/getSourceDescribe`, {
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
