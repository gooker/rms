import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { Coordinator, SSO } = NameSpace;

export async function fetchLogout(params) {
  return request('/sso/user/logout', {
    method: 'GET',
    data: params,
  });
}

// 修改当前默认的section
export async function fetchUpdateUserCurrentSection(params) {
  return request('/sso/user/updateUserDefaultSection', {
    method: 'POST',
    data: params,
  });
}

// 修改当前语言
export async function fetchUpdateUserCurrentLanguage(languageType) {
  return request('/sso/user/updateUserCurrentLanguage?languageType=${languageType}', {
    method: 'POST',
  });
}

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
export async function fetchUserAssignedRoleList(params) {
  return request(`/sso/user/roleList`, {
    method: 'GET',
    data: params,
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

// 用户登录历史-列表
export async function fetchUserLoginHistory(params) {
  return request('/sso/userLoginHistory/getLoginHistory', {
    method: 'POST',
    data: params,
  });
}

//角色管理--列表
export async function fetchAllRoleList(parms) {
  return request(`/sso/role/pageList`, {
    method: 'GET',
    data: parms,
  });
}

//角色管理--添加角色
export async function fetchAddRole(parms) {
  return request(`/sso/role`, {
    method: 'POST',
    data: parms,
  });
}

//角色管理--修改角色
export async function fetchUpdateRole(params) {
  return request(`/sso/role`, {
    method: 'PUT',
    data: params,
  });
}

//角色管理--删除角色
export async function fetchDeleteRoleById(params) {
  return request(`/sso/role?id=${params.id}`, {
    method: 'DELETE',
  });
}

//角色管理--导入角色
export async function fetchUploadRoles(params) {
  return request('/sso/role/exportRoles', {
    method: 'POST',
    data: params,
  });
}

//角色管理---保存角色分配权限
export async function saveRoleAssignAuthority(parms) {
  return request(`/sso/role/authority`, {
    method: 'PUT',
    data: parms,
  });
}

//自定义环境--列表
export async function fetchAllEnvironmentList() {
  return request(`/sso/environment/getAllEnvironment`, {
    method: 'GET',
  });
}

//自定义环境--新增
export async function fetchAddEnvironment(parms) {
  return request(`/sso/environment/saveEnvironment`, {
    method: 'POST',
    data: parms,
  });
}

//自定义环境--更新
export async function fetchUpdateEnvironment(parms) {
  return request(`/sso/environment/updateEnvironment`, {
    method: 'POST',
    data: parms,
  });
}

//自定义环境--删除
export async function deleteEnvironmentById(parms) {
  return request(`/sso/environment/deleteEnvironment`, {
    method: 'GET',
    data: parms,
  });
}

// 根据Token获取用户，验证成功返回用户信息，验证失败就返回code -1
export async function queryUserByToken() {
  return request(`${SSO}/user/queryUserByToken`, { method: 'GET' });
}

///////////////////// *** 授权管理 *** /////////////////////
/**
 * 1. 是否导入证书
 * 2. 导出的情况下判断是否过期
 * @return boolean
 */
export async function getCertificateStatus() {
  return request(`/${Coordinator}/certificate/getCertificateStatus`, {
    method: 'GET',
    attachSection: false,
  });
}

// 获取授权码
export async function getApplyToken() {
  return request(`/${Coordinator}/certificate/getApplyToken`, {
    method: 'GET',
    attachSection: false,
  });
}

// 上传证书
export async function uploadCertification(param) {
  return request(`/${Coordinator}/certificate/active`, {
    method: 'POST',
    body: param,
    attachSection: false,
  });
}

// 获取授权状态
export async function getAuthorityInfo() {
  return request(`/${Coordinator}/certificate/getSystemInfo`, {
    method: 'GET',
    attachSection: false,
  });
}
