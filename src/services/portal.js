import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { SSO,I18N,Mixrobot } = NameSpace;

export async function fetchLogin(params) {
  return request(`/${SSO}/user/login`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchAllEnvironment() {
  return request(`/${SSO}/environment/getAllEnvironment`, {
    method: 'GET',
  });
}


// 修改当前环境
export async function fetchUpdateEnvironment(params) {
  return request(`/${SSO}/environment/updateEnvironmentFlag`, {
    method: 'GET',
    data: params,
  });
}



export async function fetchFindLogoByWebAddress(webAddress) {
  return request(`/${SSO}/mainApp/findLogoByWebAddress`, {
    method: 'GET',
    data: { webAddress },
  });
}



export async function fetchNotice() {
  return request(`/${Mixrobot}/problemHandling/getProblemHandlingCount`, {
    method: 'GET',
  });
}

export async function fetchGetProblemDetail(problemId) {
  return request(`/${Mixrobot}/problemHandling/getProblemHandlingById/${problemId}`, {
    method: 'GET',
  });
}

export async function fetchFindAllApp() {
  return request(`/${SSO}/mainApp/findAllMainApp`, {
    method: 'GET',
  });
}

export async function fetchFindAppByWebAddress(webAddress) {
  return request(`/${SSO}/mainApp/findByWebAddress`, {
    method: 'GET',
    data: { webAddress },
  });
}



export async function fetchAllAppModules() {
  return request(`/${SSO}/model/getAllModule`, {
    method: 'GET',
  });
}

export async function fetchLanguageByAppCode(params) {
  return request(`${I18N}/getTranslationByParam`, {
    method: 'POST',
    data: params,
  });
}

