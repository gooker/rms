import request from '@/utils/request';
import { NameSpace } from '@/config/config';

export async function fetchLogin(params) {
  return request(`/${NameSpace.SSO}/user/login`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchAllEnvironment() {
  return request(`/${NameSpace.SSO}/environment/getAllEnvironment`, {
    method: 'GET',
  });
}

// 修改当前环境
export async function fetchUpdateEnvironment(params) {
  return request(`/${NameSpace.SSO}/environment/updateEnvironmentFlag`, {
    method: 'GET',
    data: params,
  });
}

export async function fetchFindLogoByWebAddress(webAddress) {
  return request(`/${NameSpace.SSO}/mainApp/findLogoByWebAddress`, {
    method: 'GET',
    data: { webAddress },
  });
}

export async function fetchAppVersion() {
  return request(`/${NameSpace.Coordinator}/api/getAppVersion`, {
    method: 'GET',
    attachSection: false,
  });
}

export async function fetchNotice() {
  return request(`/${NameSpace.Coordinator}/problemHandling/getProblemHandlingCount`, {
    method: 'GET',
  });
}

export async function fetchGetProblemDetail(problemId) {
  return request(`/${NameSpace.Coordinator}/problemHandling/getProblemHandlingById/${problemId}`, {
    method: 'GET',
  });
}

export async function fetchLanguageByAppCode(params) {
  return request(`${NameSpace.I18N}/getTranslationByParam`, {
    method: 'POST',
    data: params,
  });
}

// 获取小车任务类型
export async function fetchAllTaskTypes() {
  return request(`/${NameSpace.Coordinator}/traffic/getTaskTypeByRobot`, {
    method: 'GET',
  });
}
