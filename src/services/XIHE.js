import request from '@/utils/request';
import { NameSpace } from '@/config/config';

//////////////////////////**** 通用 ****//////////////////////////
// 获取潜伏车货架列表
export async function fetchLatentPodList() {
  const sectionId = window.localStorage.getItem('sectionId');
  return request(`/${NameSpace.LatentLifting}/pod/list/${sectionId}`, {
    method: 'GET',
  });
}

// 获取料箱布局尺寸数据
export async function fetchToteSizeList() {
  return request(`/${NameSpace.Tote}/rack/size/getSizeList`, {
    method: 'GET',
  });
}

// 获取所有站点类型
export async function fetchAllStationTypes() {
  return request(`/${NameSpace.Coordinator}/map/getAllStationType`, {
    method: 'GET',
  });
}

//////////////////////////**** 急停区 ****//////////////////////////
// 获取Section急停配置信息
export async function fetchEmergencyStopList(mapId) {
  return request(`/${NameSpace.Coordinator}/eStop/getEStops/${mapId}`, {
    method: 'GET',
  });
}

// 根据编码获取急停配置信息
export async function getEmergencyStopByCode(code) {
  return request(`/${NameSpace.Coordinator}/eStop/getEStopByCode/${code}`, {
    method: 'GET',
  });
}

// 保存急停配置信息
export async function saveEmergencyStop(params) {
  return request(`/${NameSpace.Coordinator}/eStop/saveEStop`, {
    method: 'POST',
    data: params,
  });
}

// 启用 | 禁用
export async function changeEmergencyStopStatus(params) {
  return request(`/${NameSpace.Coordinator}/eStop/changeStatus`, {
    method: 'POST',
    data: params,
  });
}

// 删除急停配置信息
export async function deleteEmergencyStop(params) {
  return request(`/${NameSpace.Coordinator}/eStop/removeEStop`, {
    method: 'POST',
    data: params,
  });
}

// 获取Section急停操作日志
export async function getEStopLogs(params) {
  return request(`/${NameSpace.Coordinator}/eStop/getEStopLogs`, {
    method: 'POST',
    data: params,
  });
}

//////////////////////////**** 地图编辑 ****//////////////////////////
export async function fetchSectionMaps() {
  return request(`/${NameSpace.Coordinator}/map/getSectionMaps`, { method: 'GET' });
}

export async function fetchMapDetail(id) {
  return request(`/${NameSpace.Coordinator}/map/detail/${id}`, {
    method: 'GET',
  });
}

export async function updateMap(param) {
  return request(`/${NameSpace.Coordinator}/map/updateMap`, {
    method: 'POST',
    data: param,
  });
}

export async function saveMap(map) {
  return request(`/${NameSpace.Coordinator}/map`, {
    method: 'POST',
    data: map,
  });
}

export async function deleteMapById(id) {
  return request(`/${NameSpace.Coordinator}/map/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchMapHistory(mapId) {
  return request(`/${NameSpace.Coordinator}/map/getMapHistory/${mapId}`, {
    method: 'GET',
  });
}

export async function fetchMapHistoryDetail(historyId) {
  return request(`/${NameSpace.Coordinator}/map/getMapHistoryDetail/${historyId}`, {
    method: 'GET',
  });
}

//////////////////////////**** 地图监控 ****//////////////////////////
// 点位热度
export async function fetchCellHeat(params) {
  return request(`/${NameSpace.Coordinator}/heat/getHeatMap`, {
    method: 'GET',
    data: params,
  });
}

// 获取点位锁格
export async function fetchCellLocks(logicId, cellId) {
  return request(`/${NameSpace.Coordinator}/ui/getRobotByLockedCell/${logicId}/${cellId}`, {
    method: 'GET',
  });
}

// 获取料箱任务实时路径
export async function getToteTaskRealtimePath() {
  return request(`/${NameSpace.Tote}/run-info/target-bins`, {
    method: 'GET',
  });
}

// 获取料箱实时状态信息，包括: 存放任务、货位占用
export async function getToteTaskRealtimeState(type) {
  return request(`/${NameSpace.Tote}/run-info/bins-info`, {
    method: 'GET',
    data: { type },
  });
}

//////////////////////////**** 地图锁相关 ****//////////////////////////
export async function fetchMapAGVLocks(logicId, lockTypes, robotIds) {
  return request(
    `/${NameSpace.Coordinator}/ui/getLockCellsByRobotIds/${logicId}/${lockTypes}/${robotIds}`,
    { method: 'GET' },
  );
}

//////////////////////////**** 充电桩管理 ****//////////////////////////
// 获取地图充电桩状态信息
export async function fetchChargerState(param) {
  return request(`/${NameSpace.Coordinator}/charger/getMapChargerByName`, {
    method: 'POST',
    data: param,
  });
}

// 获取实际上报的物理充电桩数据
export async function fetchPhysicChargers() {
  return request(`/${NameSpace.Coordinator}/api/loginCharger`, {
    method: 'GET',
  });
}

// 地图充电桩绑定物理充电桩
export async function fetchBindPhysicCharger(param) {
  return request(`/${NameSpace.Coordinator}/api/saveBindingAvailableCharger`, {
    method: 'POST',
    data: param,
  });
}

// 请求解绑充电桩
export async function fetchBatchUnbindHardware(params) {
  return request(`/${NameSpace.Coordinator}/charger/batchUnbundlingByHardwareIds`, {
    method: 'POST',
    data: params,
  });
}

// 清除充电桩故障
export async function clearChargerFault(hardwareId) {
  return request(`/${NameSpace.Coordinator}/charger/actions/clearError/${hardwareId}`, {
    method: 'GET',
  });
}

// 重置充电桩状态
export async function resetCharger(hardwareId) {
  return request(`/${NameSpace.Coordinator}/charger/actions/resetChargerStatus/${hardwareId}`, {
    method: 'GET',
  });
}

// 切换充电桩可用
export async function switchChargerEnable(params) {
  return request(`/${NameSpace.Coordinator}/charger/actions/updateEnableStatus`, {
    method: 'POST',
    data: params,
  });
}

// 根据地图ID查询所有充电桩接口
export async function fetchChargerList(mapId) {
  return request(`/${NameSpace.Coordinator}/charger/getChargerListByMapId`, {
    method: 'GET',
    data: { mapId },
  });
}

//////////////////////////**** Requestor页面 ****//////////////////////////
// 请求器
export async function fetchGetAPI(params) {
  return request(`/${NameSpace.Coordinator}/api/getDataApi`, {
    method: 'GET',
    data: params,
  });
}

//////////////////////////**** Web Hook页面 ****//////////////////////////
// 查询所有已创建的Web Hook类型
export async function getAllWebHookTypes() {
  return request(`/${NameSpace.Coordinator}/webHook/getType`, {
    method: 'GET',
  });
}

// 保存Web Hook接口
export async function saveWebHook(param) {
  return request(`/${NameSpace.Coordinator}/webHook/saveWebHook`, {
    method: 'POST',
    data: param,
  });
}

// 查询所有已创建的Web Hook接口
export async function getAllWebHooks() {
  return request(`/${NameSpace.Coordinator}/webHook/getAllWebHook`, {
    method: 'GET',
  });
}

// 删除 Web Hook
export async function deleteWebHooks(param) {
  return request(`/${NameSpace.Coordinator}/webHook/deleteWebHookById`, {
    method: 'POST',
    data: param,
  });
}

//////////////////////////**** MixRobot系统参数 ****//////////////////////////
// 获取参数模版
export async function fetchSystemParamFormData() {
  return request(`/${NameSpace.Coordinator}/formTemplate/getFormTemplate`, {
    method: 'GET',
  });
}

// 更新系统参数
export async function updateSystemParams(params) {
  return request(`/${NameSpace.Coordinator}/formTemplate/updateFormTemplateValue`, {
    method: 'POST',
    data: params,
  });
}
// 根据key获取系统参数
export async function fetchGetParameterByKey(key) {
  return request(`/${NameSpace.Coordinator}//formTemplate/getParameter/${key}`, {
    method: 'GET',
  });
}
