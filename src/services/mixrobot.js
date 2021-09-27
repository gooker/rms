import request from '@/utils/request';
import { NameSpace } from '@/config/config';

// 请求器
export async function fetchGetAPI(params) {
  return request(`/${NameSpace.Mixrobot}/api/getDataApi`, {
    method: 'GET',
    data: params,
  });
}

// Web Hook
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
