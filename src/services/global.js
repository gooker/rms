import request from '@/utils/request';
import { NameSpace } from '@/config/config';

export async function fetchLogin(params) {
  return request(`/${NameSpace.SSO}/user/login`, {
    method: 'POST',
    data: params,
  });
}

// 修改当前环境
export async function fetchUpdateEnvironment(params) {
  return request(`/${NameSpace.SSO}/environment/updateEnvironmentFlag`, {
    method: 'GET',
    data: params,
  });
}

export async function fetchAppVersion() {
  return request(`/${NameSpace.Platform}/api/getAppVersion`, {
    method: 'GET',
    attachSection: false,
  });
}

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
