import request from '@/utils/request';

export async function fetchLogin(params) {
  return request('/sso/user/login', {
    method: 'POST',
    data: params,
  });
}

export async function fetchLogout(params) {
  return request(`/sso/user/logout`, {
    method: 'GET',
    body: params,
  });
}

// 获取当前登陆对象
export async function fetchCurrentUser(params) {
  return request('/sso/user/getUser', {
    method: 'GET',
    data: params,
  });
}

// 修改当前默认的section
export async function fetchUpdateUserCurrentSection(params) {
  return request(`/sso/user/updateUserDefaultSection`, {
    method: 'POST',
    data: params,
  });
}

// 修改当前环境
export async function fetchUpdateEnvironment(params) {
  return request(`/sso/environment/updateEnvironmentFlag`, {
    method: 'GET',
    data: params,
  });
}

// 修改当前语言
export async function fetchUpdateUserCurrentLanguage(languageType) {
  return request(`/sso/user/updateUserCurrentLanguage?languageType=${languageType}`, {
    method: 'POST',
  });
}

export async function fetchAllEnvironment() {
  return request('/sso/environment/getAllEnvironment', {
    method: 'GET',
  });
}

export async function fetchUserRoleList(params) {
  return request(`/sso/user/roleList`, {
    method: 'GET',
    data: params,
  });
}

// 上传模块
export async function fetchSaveAll(params) {
  return request('/sso/model/saveAll', {
    method: 'POST',
    data: params,
  });
}

// 上传微服务配置
export async function addMainApp(params) {
  return request(`/sso/mainApp/add`, {
    method: 'POST',
    data: params,
  });
}
