import request from '@/utils/request';
import { NameSpace } from '@/config/config';

// 获取所有的适配器
export function fetchAllAdaptor() {
  return request(`/${NameSpace.Platform}/agv/findAllAdapter`, {
    method: 'GET',
  });
}

// 获取所有小车类型(如果传适配器参数就给适配器对应的小车类型，如果不传就给所有) 但是只给非预定义的类型
export function fetchAllRobotType(agvAdapter) {
  return request(`/${NameSpace.Platform}/agv/findAllAGVType`, {
    method: 'GET',
    data: { agvAdapter },
  });
}

// 获取所有小车(如果传适配器参数就给适配器对应的小车，如果不传就给所有)
export function fetchAllRobot(agvAdapter) {
  return request(`/${NameSpace.Platform}/agv/getAGV`, {
    method: 'GET',
    data: { agvAdapter },
  });
}

// 注册小车
export function registerRobot(param) {
  return request(`/${NameSpace.Platform}/agv/robotRegister`, {
    method: 'POST',
    data: param,
  });
}

// 添加发现
export function findRobot(param) {
  return request(`/${NameSpace.Platform}/agv/findAGV`, {
    method: 'POST',
    data: param,
  });
}

// 解绑
export function logOutRobot(param) {
  return request(`/${NameSpace.Platform}/agv/robotLogout`, {
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

export function handleDevice(param) {
  return request(`/${NameSpace.Platform}/device/action/handle`, {
    method: 'POST',
    data: param,
  });
}
