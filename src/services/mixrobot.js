import request from '@/utils/request';
import { NameSpace } from '@/config/config';

//////////////////////////**** 通用 ****//////////////////////////
// 获取所有小车类型数据
// @Dup: /map/getAllRobotType
export async function fetchTrafficRobotType() {
  return request(`/${NameSpace.Mixrobot}/traffic/getRobotType`, {
    method: 'GET',
  });
}

// 获取潜伏车货架列表
export async function fetchGetPodList(sectionId) {
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
  return request(`/${NameSpace.Mixrobot}/map/getAllStationType`, {
    method: 'GET',
  });
}

//////////////////////////**** 地图编辑 ****//////////////////////////
export async function fetchSectionMaps() {
  return request(`/${NameSpace.Mixrobot}/map/getSectionMaps`, { method: 'GET' });
}

export async function fetchMapDetail(id) {
  return request(`/${NameSpace.Mixrobot}/map/detail/${id}`, {
    method: 'GET',
  });
}

export async function updateMap(param) {
  return request(`/${NameSpace.Mixrobot}/map/updateMap`, {
    method: 'POST',
    data: param,
  });
}

export async function saveMap(map) {
  return request(`/${NameSpace.Mixrobot}/map`, {
    method: 'POST',
    data: map,
  });
}

export async function deleteMapById(id) {
  return request(`/${NameSpace.Mixrobot}/map/delete/${id}`, {
    method: 'DELETE',
  });
}

export async function fetchMapHistory(mapId) {
  return request(`/${NameSpace.Mixrobot}/map/getMapHistory/${mapId}`, {
    method: 'GET',
  });
}

export async function fetchMapHistoryDetail(historyId) {
  return request(`/${NameSpace.Mixrobot}/map/getMapHistoryDetail/${historyId}`, {
    method: 'GET',
  });
}

//////////////////////////**** 地图监控 ****//////////////////////////
// 点位热度
export async function fetchCellHeat(params) {
  return request(`/${NameSpace.Mixrobot}/heat/getHeatMap`, {
    method: 'GET',
    data: params,
  });
}

// 获取点位锁格
export async function fetchCellLocks(logicId, cellId) {
  return request(`/${NameSpace.Mixrobot}/ui/getRobotByLockedCell/${logicId}/${cellId}`, {
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
    `/${NameSpace.Mixrobot}/ui/getLockCellsByRobotIds/${logicId}/${lockTypes}/${robotIds}`,
    { method: 'GET' },
  );
}

//////////////////////////**** 充电桩管理 ****//////////////////////////
// 获取地图充电桩状态信息
export async function fetchChargerState(param) {
  return request(`/${NameSpace.Mixrobot}/charger/getMapChargerByName`, {
    method: 'POST',
    data: param,
  });
}

// 获取实际上报的物理充电桩数据
export async function fetchPhysicChargers() {
  return request(`/${NameSpace.Mixrobot}/api/loginCharger`, {
    method: 'GET',
  });
}

// 地图充电桩绑定物理充电桩
export async function fetchBindPhysicCharger(param) {
  return request(`/${NameSpace.Mixrobot}/api/saveBindingAvailableCharger`, {
    method: 'POST',
    data: param,
  });
}

// 请求解绑充电桩
export async function fetchBatchUnbindHardware(params) {
  return request(`/${NameSpace.Mixrobot}/charger/batchUnbundlingByHardwareIds`, {
    method: 'POST',
    data: params,
  });
}

// 清除充电桩故障
export async function clearChargerFault(hardwareId) {
  return request(`/${NameSpace.Mixrobot}/charger/actions/clearError/${hardwareId}`, {
    method: 'GET',
  });
}

// 重置充电桩状态
export async function resetCharger(hardwareId) {
  return request(`/${NameSpace.Mixrobot}/charger/actions/resetChargerStatus/${hardwareId}`, {
    method: 'GET',
  });
}

// 切换充电桩可用
export async function switchChargerEnable(params) {
  return request(`/${NameSpace.Mixrobot}/charger/actions/updateEnableStatus`, {
    method: 'POST',
    data: params,
  });
}

// 根据地图ID查询所有充电桩接口
export async function fetchChargerList(mapId) {
  return request(`/${NameSpace.Mixrobot}/charger/getChargerListByMapId`, {
    method: 'GET',
    data: { mapId },
  });
}

//////////////////////////**** Requestor页面 ****//////////////////////////
// 请求器
export async function fetchGetAPI(params) {
  return request(`/${NameSpace.Mixrobot}/api/getDataApi`, {
    method: 'GET',
    data: params,
  });
}

//////////////////////////**** Web Hook页面 ****//////////////////////////
// 查询所有已创建的Web Hook类型
export async function getAllWebHookTypes() {
  return request(`/${NameSpace.Mixrobot}/webHook/getType`, {
    method: 'GET',
  });
}

// 保存Web Hook接口
export async function saveWebHook(param) {
  return request(`/${NameSpace.Mixrobot}/webHook/saveWebHook`, {
    method: 'POST',
    data: param,
  });
}

// 查询所有已创建的Web Hook接口
export async function getAllWebHooks() {
  return request(`/${NameSpace.Mixrobot}/webHook/getAllWebHook`, {
    method: 'GET',
  });
}

// 删除 Web Hook
export async function deleteWebHooks(param) {
  return request(`/${NameSpace.Mixrobot}/webHook/deleteWebHookById`, {
    method: 'POST',
    data: param,
  });
}

//////////////////////////**** MixRobot系统参数 ****//////////////////////////
// 获取参数模版
export async function fetchSystemParamFormData() {
  return request(`/${NameSpace.Mixrobot}/formTemplate/getFormTemplate`, {
    method: 'GET',
  });
}

// 更新系统参数
export async function updateSystemParams(params) {
  return request(`/${NameSpace.Mixrobot}/formTemplate/updateFormTemplateValue`, {
    method: 'POST',
    data: params,
  });
}
// 根据key获取系统参数
export async function fetchGetParameterByKey(key) {
  return request(`/${NameSpace.Mixrobot}//formTemplate/getParameter/${key}`, {
    method: 'GET',
  });
}
