import request from '@/utils/request';

export async function fetchLogout(params) {
  return request(`/sso/user/logout`, {
    method: 'GET',
    data: params,
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

// 用户管理

//获取用户管理列表
export async function fetchUserList(params) {
  return request('/sso/user/queryUserList', {
    method: 'GET',
    data: params,
  });
}
//新建用户
export async function fetchAddUser(params) {
  return request('/sso/user/addUser', {
    method: 'POST',
    data: params,
  });
}
//更新用户
export async function fetchUpdateUser(params) {
  return request('/sso/user/updateUser', {
    method: 'POST',
    data: params,
  });
}
//重置用户密码
export async function fetchUpdateUserPassword(params) {
  return request(
    `/sso/user/changeUserPassword?userId=${params.userId}&changePassword=${params.changePassword}`,
    {
      method: 'POST',
      data: {},
    },
  );
}

//注销用户
export async function fetchDeleteUser(params) {
  return request(`/sso/user/deleteUser`, {
    method: 'GET',
    data: params,
  });
}
