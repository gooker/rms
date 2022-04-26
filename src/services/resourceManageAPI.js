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
