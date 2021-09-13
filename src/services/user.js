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
export async function fetchUserManagerList(params) {
  return request('/sso/user/queryUserList', {
    method: 'GET',
    data: params,
  });
}
//新建用户
export async function addUserManager(params) {
  return request('/sso/user/addUser', {
    method: 'POST',
    data: params,
  });
}
//更新用户
export async function updateUserManage(params) {
  return request('/sso/user/updateUser', {
    method: 'POST',
    data: params,
  });
}
//重置用户密码
export async function updateUserPassword(params) {
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

// 查询所有区域
export async function fetchSelectSectionList() {
  return request(`/sso/section/selectSectionList`, {
    method: 'GET',
  });
}

// 当前有的区域查询 userId
export async function fetchAllSectionByUserId(parms) {
  return request(`/sso/section/querySectionByUserId`, {
    method: 'GET',
    data: parms,
  });
}

// 区域分配-保存
export async function saveUserSections(params) {
  return request(`/sso/user/updateUserSection`, {
    method: 'POST',
    data: params,
  });
}


//查询所有角色信息
export async function fetchAllUserRoleList() {
  return request(`/sso/role/list`, {
    method: 'GET',
  });
}
//获取用户已分配角色 userId
export async function fetchUserAssignedRoleList(parms) {
  return request(`/sso/user/roleList`, {
    method: 'GET',
    data: parms,
  });
}
//保存用户分配角色
export async function saveUsersAssignedRole(parms) {
  return request(`/sso/user/roleAuthority`, {
    method: 'POST',
    data: parms,
  });
}



//  区域管理--新增
export async function fetchAddSection(parms) {
  return request(`/sso/section/addSection`, {
    method: 'POST',
    data: parms,
  });
}

// 区域管理-删除
export async function deleteSectionById(parms) {
  return request(`/sso/section/deleteSectionById`, {
    method: 'GET',
    data: parms,
  });
}

//区域管理-编辑更新
export async function updateSection(parms) {
  return request(`/sso/section/updateSection`, {
    method: 'POST',
    data: parms,
  });
}

