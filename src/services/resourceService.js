import request from '@/utils/request';
import { NameSpace } from '@/config/config';

// 获取所有小车类型(如果传适配器参数就给适配器对应的小车类型，如果不传就给所有) 但是只给非预定义的类型
export function fetchAllVehicleType(vehicleAdapter) {
  return request(`/${NameSpace.Platform}/vehicle/findAllVehicleType`, {
    method: 'GET',
    data: { vehicleAdapter },
  });
}

// 获取所有的适配器
export function fetchAllAdaptor() {
  return request(`/${NameSpace.Platform}/vehicle/findAllAdapter`, {
    method: 'GET',
  });
}

/*
 *1.注册小车:添加发现
 *2.模拟器新增小车
 */
export function findVehicle(param) {
  return request(`/${NameSpace.Platform}/vehicle/findVehicle`, {
    method: 'POST',
    data: param,
  });
}

// 注册小车
export function registerVehicle(param) {
  return request(`/${NameSpace.Platform}/vehicle/vehicleRegister`, {
    method: 'POST',
    data: param,
  });
}

// 解绑
export function logOutVehicle(param) {
  return request(`/${NameSpace.Platform}/vehicle/vehicleLogout`, {
    method: 'POST',
    data: param,
  });
}

/***设备相关接口***/
// 添加扫描到的设备到系统
export function addDevice(param) {
  return request(`/${NameSpace.Platform}/device/addToScanList`, {
    method: 'POST',
    data: param,
  });
}

// 获取设备适配器
export function findAllDeviceAdapter() {
  return request(`/${NameSpace.Platform}/device/findAllDeviceAdapter`, {
    method: 'GET',
  });
}

// 注册设备
export function registerDevice(param) {
  return request(`/${NameSpace.Platform}/device/registerDevice`, {
    method: 'POST',
    data: param,
  });
}

// 注销设备
export function unRegisterDevice(param) {
  return request(`/${NameSpace.Platform}/device/unRegisterDevice`, {
    method: 'POST',
    data: param,
  });
}

// 忽略设备
export function ignoreDevice(param) {
  return request(`/${NameSpace.Platform}/device/ignoreDevice`, {
    method: 'POST',
    data: param,
  });
}

// 解除忽略设备
export function unIgnoreDevice(param) {
  return request(`/${NameSpace.Platform}/device/unIgnoreDevice`, {
    method: 'POST',
    data: param,
  });
}

// 添加扫描到的设备到系统?? 绑定？
export function bindDevice(param) {
  return request(`/${NameSpace.Platform}/device/addOrUpdateBinding`, {
    method: 'POST',
    data: param,
  });
}
// 取消设备绑定
export function unBindDevice(param) {
  return request(`/${NameSpace.Platform}/device/removeBindingsByDeviceID`, {
    method: 'POST',
    data: param,
  });
}

// 查找所有设备
export function findAllDevices() {
  return request(`/${NameSpace.Platform}/device/findAllDevices`, {
    method: 'GET',
  });
}

// 查找所有设备类型
export function findAllDeviceTypes() {
  return request(`/${NameSpace.Platform}/device/findAllDeviceType`, {
    method: 'GET',
  });
}

// 添加/编辑设备类型
export function addDeviceType(param) {
  return request(`/${NameSpace.Platform}/device/addOrUpdateDeviceType`, {
    method: 'POST',
    data: param,
  });
}
// 删除设备类型
export function deleteDeviceType(param) {
  return request(`/${NameSpace.Platform}/device/deleteDeviceType`, {
    method: 'POST',
    data: param,
  });
}

/**根据设备类型查询设备动作
 * 1.注册前只传deviceTypeCode
 * 2.注册成功后还需要传deviceId
 * ****/
export function findDeviceActionsByDeviceType(param) {
  return request(`/${NameSpace.Platform}/device/findDeviceActionsByDeviceType`, {
    method: 'GET',
    data: param,
  });
}

// 保存设备动作
export function saveDeviceActions(param) {
  return request(`/${NameSpace.Platform}/device/saveDeviceActions`, {
    method: 'POST',
    data: param,
  });
}

/** 根据设备类型查询状态动作
 * 1.注册前只传deviceTypeCode
 * 2.注册成功后还需要传deviceId
 * */
export function findDeviceMonitorsByDeviceType(param) {
  return request(`/${NameSpace.Platform}/device/findDeviceMonitorsByDeviceType`, {
    method: 'GET',
    data: param,
  });
}

export function saveDeviceMonitors(param) {
  return request(`/${NameSpace.Platform}/device/saveDeviceMonitors`, {
    method: 'POST',
    data: param,
  });
}

// 保存设备类型 配置信息
export function saveDeviceTypeConfigs(param) {
  return request(`/${NameSpace.Platform}/device/saveDeviceTypeConfigs`, {
    method: 'POST',
    data: param,
  });
}

// 保存设备类型动作配置
export function saveDeviceTypeActions(param) {
  return request(`/${NameSpace.Platform}/device/saveCustomDeviceAction`, {
    method: 'POST',
    data: param,
  });
}

export function handleDevice(param) {
  return request(`/${NameSpace.Platform}/device/action/handle`, {
    method: 'POST',
    data: param,
  });
}

// 充电桩适配器类型列表
export function findChargerAdapter() {
  return request(`/${NameSpace.Platform}/charger/adapterTypes`, {
    method: 'GET',
  });
}

// 地图充电桩列表接口
export function findMapCharger() {
  return request(`/${NameSpace.Platform}/charger/getMapChargers`, {
    method: 'GET',
  });
}

// 查询 充电桩列表
export async function fetchChargerList(params) {
  return request(`/${NameSpace.Platform}/chargers`, {
    method: 'GET',
    data: { filterType: 'ALL', ...params },
  });
}

// 根据地图充电桩code查询充电桩信息
export async function fetchChargeByCode(mapChargerCode) {
  return request(`/${NameSpace.Platform}/charger/${mapChargerCode}`, {
    method: 'GET',
  });
}

// 充电桩-发现
export function findCharger(param) {
  return request(`/${NameSpace.Platform}/charger/addDiscovery`, {
    method: 'PUT',
    data: param,
  });
}

// 充电桩批量修改（注册/注销/启用禁用）
export function operateChargers(param) {
  return request(`/${NameSpace.Platform}/chargers`, {
    method: 'PUT',
    data: param,
  });
}

// ************************* 资源分组 ************************* //
// 获取资源组类型
export async function fetchResourceGroupType() {
  return request(`/${NameSpace.Platform}/resource/getResourceType`, {
    method: 'GET',
  });
}

// 获取绑定组与被绑定组的关系
export async function fetchBindableResourceMapping() {
  return request(`/${NameSpace.Platform}/bind/getResourceBindMapping`, {
    method: 'GET',
  });
}

// 获取所有的绑定数据
export async function fetchAllResourceBindMapping() {
  return request(`/${NameSpace.Platform}/bind/getAllResourceGroupBind`, {
    method: 'GET',
  });
}

// 获取绑定组与被绑定组的关系
export async function saveResourceBindMapping(body) {
  return request(`/${NameSpace.Platform}/bind/saveBindResourceGroup`, {
    method: 'POST',
    data: body,
  });
}

// 删除一条绑定
export async function deleteResourceBindMapping(id) {
  return request(`/${NameSpace.Platform}/bind/deleteBindResourceById`, {
    method: 'GET',
    data: { id },
  });
}

// 根据组获取组资源
export async function fetchResourceGroupByType(groupType) {
  return request(`/${NameSpace.Platform}/resource/getResourceGroupByType`, {
    method: 'GET',
    data: { groupType },
  });
}

// ************************* 充电策略 ************************* //
// 充电策略列表
export async function fetchAllStrategyList() {
  return request(`/${NameSpace.Platform}/getAllChargingStrategy`, {
    method: 'GET',
  });
}

// 保存充电策略
export async function saveChargingStrategy(param) {
  return request(`/${NameSpace.Platform}/saveChargeStrategy`, {
    method: 'POST',
    data: param,
  });
}

// 根据充电策略Id获取充电策略
export async function fetchChargingStrategyById(param) {
  return request(`/${NameSpace.Platform}/getChargingStrategyById`, {
    method: 'GET',
    data: param,
  });
}

// 删除充电策略
export async function deleteChargingStrategyById(param) {
  return request(`/${NameSpace.Platform}/deleteChargeStrategy`, {
    method: 'POST',
    data: param,
  });
}

// 获取充电参数的默认值
export async function fetchDefaultChargingStrategy() {
  return request(`/${NameSpace.Platform}/getDefaultChargingStrategy`, {
    method: 'GET',
  });
}

// 根据充电策略Id查询闲时策略
export async function fetchIdleHourChargeStrategy(param) {
  return request(`/${NameSpace.Platform}/getIdleHoursStrategyById`, {
    method: 'GET',
    data: param,
  });
}

// 保存闲时策略
export async function saveIdleHoursStrategy(param) {
  return request(`/${NameSpace.Platform}/saveIdleHoursStrategy`, {
    method: 'POST',
    data: param,
  });
}

/***载具 start**/

// 查询载具类型
export async function fetchAllLoadType(param) {
  return request(`/${NameSpace.Platform}/load/getAllLoadType`, {
    method: 'GET',
    data: param,
  });
}

// 添加 修改 载具规格
export async function saveLoadSpecification(param) {
  return request(`/${NameSpace.Platform}/load/saveLoadSpecification`, {
    method: 'POST',
    data: param,
  });
}

// 获取所有载具规格
export async function fetchAllLoadSpecification(param) {
  return request(`/${NameSpace.Platform}/load/getAllLoadSpecification`, {
    method: 'GET',
    data: param,
  });
}

// 删除载具规格
export async function deleteLoadSpecification(param) {
  return request(`/${NameSpace.Platform}/load/deleteLoadSpecification`, {
    method: 'POST',
    data: param,
  });
}

// 根据载具类型查询所有的载具规格
export async function fetchLoadSpecificationByType(param) {
  return request(`/${NameSpace.Platform}/load/getLoadSpecificationByLoadType`, {
    method: 'GET',
    data: param,
  });
}

// 获取所有载具（分页）
export async function fetchAllLoad(param) {
  return request(`/${NameSpace.Platform}/load/getAllLoad`, {
    method: 'POST',
    data: param,
  });
}

// 获取所有载具 地图加载用 不分页
export async function fetchLoadList() {
  return request(`/${NameSpace.Platform}/load/getAllLoadForMap`, {
    method: 'GET',
  });
}

// 删除载具
export async function deleteSelectedLoad(param) {
  return request(`/${NameSpace.Platform}/load/deleteLoad`, {
    method: 'POST',
    data: param,
  });
}

// 保存载具
export async function saveLoad(param) {
  return request(`/${NameSpace.Platform}/load/saveLoad`, {
    method: 'POST',
    data: param,
  });
}

// 模拟生成载具
export async function simulationLoad(param) {
  return request(`/${NameSpace.Platform}/load/addSimulationLoads`, {
    method: 'POST',
    data: param,
  });
}

// 载具流转记录
export async function fetchLoadCirculationRecord(param) {
  return request(`/${NameSpace.Platform}/load/getLoadCirculationRecords`, {
    method: 'POST',
    data: param,
  });
}

/***载具 end**/

// 新增储位
export async function saveStorage(param) {
  return request(`/${NameSpace.Platform}/storage/saveStorage`, {
    method: 'POST',
    data: param,
  });
}

// 储位列表
export async function fetchAllStorage(param) {
  return request(`/${NameSpace.Platform}/storage/getStorage`, {
    method: 'POST',
    data: param,
  });
}

// 删除储位
export async function deleteSelectedStorage(param) {
  return request(`/${NameSpace.Platform}/storage/deleteStorage`, {
    method: 'POST',
    data: param,
  });
}

// 初始化储位
export async function initStorage(param) {
  return request(`/${NameSpace.Platform}/storage/initStorage`, {
    method: 'POST',
    data: param,
  });
}

// 保存分组
export async function saveResourceGroup(param) {
  return request(`/${NameSpace.Platform}/resource/saveOneResourceGroup`, {
    method: 'POST',
    data: param,
  });
}

// 删除组内成员
export async function deleteResourceGroupMembers(param) {
  return request(`/${NameSpace.Platform}/resource/deleteGroupMembers`, {
    method: 'POST',
    data: param,
  });
}

// 删除分组
export async function deleteResourceGroup(param) {
  return request(`/${NameSpace.Platform}/resource/batchDeleteResourceGroup`, {
    method: 'POST',
    data: param,
  });
}

//根据mapId查询所有自定义任务资源组
export async function fetchResourceGroup(param) {
  return request(`/${NameSpace.Platform}/resource/getResourceGroup`, {
    method: 'GET',
    data: param,
  });
}

// 车辆日志
// 从小车上下载日志
export async function fetchVehicleLogs(param) {
  return request(`/${NameSpace.Platform}/vehicle/file/downloadLog`, {
    method: 'POST',
    data: param,
  });
}

// 查询下载的日志 -进度
export async function fetchVehicleLogsList() {
  return request(`/${NameSpace.Platform}/vehicle/file/getLogList`, {
    method: 'GET',
  });
}

// 上传固件到SFTP
export async function uploadVehicleFile(param) {
  return request(`/${NameSpace.Platform}/vehicle/file/upload`, {
    method: 'POST',
    data: param,
  });
}

//查询固件list
export async function fetchFireWareFileList() {
  return request(`/${NameSpace.Platform}/vehicle/file/selectUploadFileNameList`, {
    method: 'GET',
  });
}

// 删除固件
export async function batchDeleteFireWareFile(param) {
  return request(`/${NameSpace.Platform}/vehicle/file/batchDeleteFile`, {
    method: 'POST',
    data: param,
  });
}

// 查询固件到小车/小车升级任务 进度
export async function fetchFireWareList() {
  return request(`/${NameSpace.Platform}/vehicle/file/getFirmwareList`, {
    method: 'GET',
  });
}

// 上传升级固件到小车
export async function updateVehicleFirmWareFile(param) {
  return request(`/${NameSpace.Platform}/vehicle/file/uploadFirmwareFile`, {
    method: 'POST',
    data: param,
  });
}

// 查询文件任务
export async function fetchVehicleFileTaskList(param) {
  return request(`/${NameSpace.Platform}/vehicle/file/getVehicleFileTaskList`, {
    method: 'POST',
    data: param,
  });
}

// 发送升级
export async function upgradeVehicle(param) {
  return request(`/${NameSpace.Platform}/vehicle/file/upgradeVehicle`, {
    method: 'POST',
    data: param,
  });
}

// 维护/取消维护
export async function updateVehicleMaintain(param) {
  return request(`/${NameSpace.Platform}/vehicle/maintain`, {
    method: 'POST',
    data: param,
  });
}

// 查询固件升级历史任务
export async function fetchVehicleUpgradeList(param) {
  return request(`/${NameSpace.Platform}/vehicle/file/getUpgradeList`, {
    method: 'GET',
    data: param,
  });
}
