import request from '@/utils/request';
import { NameSpace } from '@/config/config';
import { isStrictNull } from '@/utils/util';

//////////////////////////**** 高可用 ****//////////////////////////
export async function getHAInfo() {
  return request(`/${NameSpace.Platform}/serverInfo/getServerInfo`, {
    method: 'GET',
    attachSection: false,
  });
}

export async function getHAChangeHistory() {
  return request(`/${NameSpace.Platform}/serverInfo/getHaServerChange`, {
    method: 'GET',
  });
}

//////////////////////////**** 通用 ****//////////////////////////
// 获取潜伏车货架列表
export async function fetchLatentPodList() {
  const sectionId = window.localStorage.getItem('sectionId');
  return request(`/${NameSpace.Platform}/pod/list/${sectionId}`, {
    method: 'GET',
  });
}

// 获取料箱布局尺寸数据
export async function fetchToteSizeList() {
  return request(`/${NameSpace.Platform}/rack/size/getSizeList`, {
    method: 'GET',
  });
}

// 获取所有站点类型
export async function fetchAllStationTypes() {
  return request(`/${NameSpace.Platform}/map/getAllStationType`, {
    method: 'GET',
  });
}

//////////////////////////**** 急停区 ****//////////////////////////
// 获取Section急停配置信息
export async function fetchEmergencyStopList(mapId) {
  return request(`/${NameSpace.Platform}/eStop/getEStops/${mapId}`, {
    method: 'GET',
  });
}

// 根据编码获取急停配置信息
export async function getEmergencyStopByCode(code) {
  return request(`/${NameSpace.Platform}/eStop/getEStopByCode/${code}`, {
    method: 'GET',
  });
}

// 保存急停配置信息
export async function saveEmergencyStop(params) {
  return request(`/${NameSpace.Platform}/eStop/saveEStop`, {
    method: 'POST',
    data: params,
  });
}

// 启用 | 禁用
export async function changeEmergencyStopStatus(params) {
  return request(`/${NameSpace.Platform}/eStop/changeStatus`, {
    method: 'POST',
    data: params,
  });
}

// 删除急停配置信息
export async function deleteEmergencyStop(params) {
  return request(`/${NameSpace.Platform}/eStop/removeEStop`, {
    method: 'POST',
    data: params,
  });
}

// 获取Section急停操作日志
export async function fetchEStopLogs(params) {
  return request(`/${NameSpace.Platform}/eStop/getEStopLogs`, {
    method: 'POST',
    data: params,
  });
}

//////////////////////////**** 地图编辑 ****//////////////////////////
export async function fetchSectionMaps() {
  return request(`/${NameSpace.Platform}/map/getSectionMaps`, { method: 'GET' });
}

export async function fetchMapDetail(id) {
  return request(`/${NameSpace.Platform}/map/detail/${id}`, {
    method: 'GET',
  });
}

export async function updateMap(param) {
  return request(`/${NameSpace.Platform}/map/updateMap`, {
    method: 'POST',
    data: param,
  });
}

export async function saveMap(map) {
  return request(`/${NameSpace.Platform}/map`, {
    method: 'POST',
    data: map,
  });
}

export async function deleteMapById(id) {
  return request(`/${NameSpace.Platform}/map/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchMapHistory(mapId) {
  return request(`/${NameSpace.Platform}/map/getMapHistory/${mapId}`, {
    method: 'GET',
  });
}

export async function fetchMapHistoryDetail(historyId) {
  return request(`/${NameSpace.Platform}/map/getMapHistoryDetail/${historyId}`, {
    method: 'GET',
  });
}

//////////////////////////**** 地图监控 ****//////////////////////////
// 点位热度
export async function fetchCellHeat(params) {
  return request(`/${NameSpace.Platform}/heat/getHeatMap`, {
    method: 'GET',
    data: params,
  });
}

// 获取点位锁格
export async function fetchCellLocks(logicId, cellId) {
  return request(`/${NameSpace.Platform}/lock/getVehicleByLockedCell/${logicId}/${cellId}`, {
    method: 'GET',
  });
}

// 获取料箱任务实时路径
export async function getToteTaskRealtimePath() {
  return request(`/${NameSpace.Platform}/run-info/target-bins`, {
    method: 'GET',
  });
}

// 获取料箱实时状态信息，包括: 存放任务、货位占用
export async function getToteTaskRealtimeState(type) {
  return request(`/${NameSpace.Platform}/run-info/bins-info`, {
    method: 'GET',
    data: { type },
  });
}

// 更新货架位置
export async function updateLatentPodPosition(payload) {
  return request(`/${NameSpace.Platform}/pod/updatePodCellId`, {
    method: 'POST',
    data: payload,
  });
}

// 更新货架尺寸
export async function updateLatentPodSize(payload) {
  return request(`/${NameSpace.Platform}/pod/updatePodSize`, {
    method: 'POST',
    data: payload,
  });
}

//////////////////////////**** 地图锁相关 ****//////////////////////////

/**显示锁格 start***/

// 获取小车的路径锁格信息 （单个）
export async function getLockedCellsByVehicleId(logicId, vehicleId, vehicleType) {
  return request(
    `/${NameSpace.Platform}/lock/getLockedCellsByVehicleId/${logicId}/${vehicleId}/${vehicleType}`,
    {
      method: 'GET',
    },
  );
}

// 获取小车的路径锁格信息（批量）
export async function fetchMapVehicleLocks(logicId, uniqueIds) {
  return request(
    `/${NameSpace.Platform}/lock/getLockCellsByUniqueIds/${logicId}/?uniqueIds=${uniqueIds}`,
    {
      method: 'GET',
    },
  );
}

// 获取逻辑区的路径锁格信息
export async function fetchLogicAllVehicleLocks(logicId) {
  return request(`/${NameSpace.Platform}/lock/getAllLockedCells/${logicId}`, { method: 'GET' });
}

/****显示锁格 end******/

/****显示路径 end****/

//////////////////////////**** 充电桩管理 ****//////////////////////////

// 清除充电桩故障
export async function clearChargerFault(hardwareId) {
  return request(`/${NameSpace.Platform}/charger/actions/clearError/${hardwareId}`, {
    method: 'GET',
  });
}

// 重置充电桩状态
export async function resetCharger(hardwareId) {
  return request(`/${NameSpace.Platform}/charger/actions/resetChargerStatus/${hardwareId}`, {
    method: 'GET',
  });
}

//////////////////////////**** Web Hook页面 ****//////////////////////////
// 查询所有已创建的Web Hook类型
export async function getAllWebHookTypes() {
  return request(`/${NameSpace.Platform}/webHook/getType`, {
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

// 查询所有已创建的Web Hook接口
export async function getAllWebHooks() {
  return request(`/${NameSpace.Platform}/webHook/getAllWebHook`, {
    method: 'GET',
  });
}

// 删除 Web Hook
export async function deleteWebHooks(param) {
  return request(`/${NameSpace.Platform}/webHook/deleteWebHookById`, {
    method: 'POST',
    data: param,
  });
}

// 保存topic和webhook的注册关系
export async function registerWebhooksTopic(param) {
  return request(`/${NameSpace.Platform}/registerTopic/saveRegisterTopic`, {
    method: 'POST',
    data: param,
  });
}

// 解绑topic 绑定
export async function unBoundRegisterTopic(param) {
  return request(`/${NameSpace.Platform}/registerTopic/UnboundRegisterTopic`, {
    method: 'POST',
    data: param,
  });
}

// 根据sectionId获取所有的绑定关系
export async function fetchAllRegisterData() {
  return request(`/${NameSpace.Platform}/registerTopic/getAllBindingMessageBySectionId`, {
    method: 'GET',
  });
}

// 根据topic查绑定的消息
export async function fetchRegisterMessageByTopic() {
  return request(`/${NameSpace.Platform}/registerTopic/getRegisterMessageByTopic`, {
    method: 'GET',
  });
}

//////////////////////////**** 告警中心 ****//////////////////////////
//获取数据库告警中心 分页
export async function fetchAlertCenterList(params) {
  return request(`/${NameSpace.Platform}/alertCenter/getAlertCenter`, {
    method: 'GET',
    data: params,
  });
}

// 全部完成处理
export async function allUpdateProblemHandling(params) {
  return request(`/${NameSpace.Platform}/alertCenter/updateAllAlertCenter`, {
    method: 'POST',
    data: params,
  });
}

// 批量完成处理(选中的)
export async function batchUpdateAlertCenter(params) {
  return request(`/${NameSpace.Platform}/alertCenter/batchUpdateAlertCenter`, {
    method: 'POST',
    data: params,
  });
}

//////////////////////////**** MixVehicle系统参数 ****//////////////////////////
// 获取参数模版
export async function fetchSystemParamFormData() {
  return request(`/${NameSpace.Platform}/formTemplate/getFormTemplate`, {
    method: 'GET',
  });
}

// 更新系统参数
export async function updateSystemParams(params) {
  return request(`/${NameSpace.Platform}/formTemplate/updateFormTemplateValue`, {
    method: 'POST',
    data: params,
  });
}
// 根据key获取系统参数
export async function fetchGetParameterByKey(key) {
  return request(`/${NameSpace.Platform}/formTemplate/getParameter/${key}`, {
    method: 'GET',
  });
}

//////////////////////////**** 地图编程 ****//////////////////////////
// 获取地图编程动作协议接口
export function fetchAllPrograming() {
  return request(`/${NameSpace.Platform}/actionParam/getAllActionParam`, {
    method: 'GET',
  });
}

// 保存地图编程
export function saveScopeProgram(params) {
  return request(`/${NameSpace.Platform}/actionScope/saveActionScopes`, {
    method: 'POST',
    data: params,
  });
}

// 根据参数获取地图编程数据
export function fetchScopeProgram({ mapId, logicId, routeCode, scopeCode }) {
  let sub = '/actionScope/getActionScope';
  if (!isStrictNull(mapId)) {
    sub = `${sub}/${mapId}`;
  }
  if (!isStrictNull(logicId)) {
    sub = `${sub}/${logicId}`;
  }
  if (!isStrictNull(routeCode)) {
    sub = `${sub}/${routeCode}`;
  }
  if (!isStrictNull(scopeCode)) {
    sub = `${sub}/${scopeCode}`;
  }
  return request(`/${NameSpace.Platform}${sub}`, {
    method: 'GET',
  });
}
