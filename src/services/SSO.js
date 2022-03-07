import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { Coordinator, SSO } = NameSpace;

//获取当前登陆对象
export async function getCurrentUser() {
  return request(`/${SSO}/user/getUser`, {
    method: 'GET',
  });
}

// 登出
export async function fetchLogout(params) {
  return request(`/${SSO}/user/logout`, {
    method: 'GET',
    data: params,
  });
}

// 修改当前默认的section
export async function fetchUpdateUserCurrentSection(params) {
  return request(`/${SSO}/user/updateUserDefaultSection`, {
    method: 'POST',
    data: params,
  });
}

// 修改当前语言
export async function fetchUpdateUserCurrentLanguage(languageType) {
  return request(`/${SSO}/user/updateUserCurrentLanguage?languageType=${languageType}`, {
    method: 'POST',
  });
}

//获取用户管理列表
export async function fetchUserManagerList(params) {
  return request(`/${SSO}/user/queryUserList`, {
    method: 'GET',
    data: params,
  });
}
//新建用户
export async function addUserManager(params) {
  return request(`/${SSO}/user/addUser`, {
    method: 'POST',
    data: params,
  });
}
//更新用户
export async function updateUserManage(params) {
  return request(`/${SSO}/user/updateUser`, {
    method: 'POST',
    data: params,
  });
}
//重置用户密码
export async function updateUserPassword(params) {
  return request(
    `/${SSO}/user/changeUserPassword?userId=${params.userId}&changePassword=${params.changePassword}`,
    {
      method: 'POST',
      data: {},
    },
  );
}

//注销用户
export async function fetchDeleteUser(params) {
  return request(`/${SSO}/user/deleteUser`, {
    method: 'GET',
    data: params,
  });
}

// 查询所有区域
export async function fetchSelectSectionList() {
  return request(`/${SSO}/section/selectSectionList`, {
    method: 'GET',
  });
}

// 当前有的区域查询 userId
export async function fetchAllSectionByUserId(parms) {
  return request(`/${SSO}/section/querySectionByUserId`, {
    method: 'GET',
    data: parms,
  });
}

// 区域分配-保存
export async function saveUserSections(params) {
  return request(`/${SSO}/user/updateUserSection`, {
    method: 'POST',
    data: params,
  });
}

//查询所有角色信息
export async function fetchAllUserRoleList() {
  return request(`/${SSO}/role/list`, {
    method: 'GET',
  });
}

//获取用户已分配角色 userId
export async function fetchUserAssignedRoleList(params) {
  return request(`/${SSO}/user/roleList`, {
    method: 'GET',
    data: params,
  });
}

//保存用户分配角色
export async function saveUsersAssignedRole(parms) {
  return request(`/${SSO}/user/roleAuthority`, {
    method: 'POST',
    data: parms,
  });
}

//  区域管理--新增
export async function fetchAddSection(parms) {
  return request(`/${SSO}/section/addSection`, {
    method: 'POST',
    data: parms,
  });
}

// 区域管理-删除
export async function deleteSectionById(parms) {
  return request(`/${SSO}/section/deleteSectionById`, {
    method: 'GET',
    data: parms,
  });
}

//区域管理-编辑更新
export async function updateSection(parms) {
  return request(`/${SSO}/section/updateSection`, {
    method: 'POST',
    data: parms,
  });
}

// 用户登录历史-列表
export async function fetchUserLoginHistory(params) {
  return request(`/${SSO}/userLoginHistory/getLoginHistory`, {
    method: 'POST',
    data: params,
  });
}

//角色管理--列表
export async function fetchAllRoleList(parms) {
  return request(`/${SSO}/role/pageList`, {
    method: 'GET',
    data: parms,
  });
}

//角色管理--添加角色
export async function fetchAddRole(parms) {
  return request(`/${SSO}/role`, {
    method: 'POST',
    data: parms,
  });
}

//角色管理--修改角色
export async function fetchUpdateRole(params) {
  return request(`/${SSO}/role`, {
    method: 'PUT',
    data: params,
  });
}

//角色管理--删除角色
export async function fetchDeleteRoleById(params) {
  return request(`/${SSO}/role?id=${params.id}`, {
    method: 'DELETE',
  });
}

//角色管理--导入角色
export async function fetchUploadRoles(params) {
  return request(`/${SSO}/role/exportRoles`, {
    method: 'POST',
    data: params,
  });
}

//角色管理---保存角色分配权限
export async function saveRoleAssignAuthority(parms) {
  return request(`/${SSO}/role/authority`, {
    method: 'PUT',
    data: parms,
  });
}

//自定义环境--列表
export async function fetchAllEnvironmentList() {
  return request(`/${SSO}/environment/getAllEnvironment`, {
    method: 'GET',
  });
}

//自定义环境--新增
export async function fetchAddEnvironment(parms) {
  return request(`/${SSO}/environment/saveEnvironment`, {
    method: 'POST',
    data: parms,
  });
}

//自定义环境--更新
export async function fetchUpdateEnvironment(parms) {
  return request(`/${SSO}/environment/updateEnvironment`, {
    method: 'POST',
    data: parms,
  });
}

//自定义环境--删除
export async function deleteEnvironmentById(parms) {
  return request(`/${SSO}/environment/deleteEnvironment`, {
    method: 'GET',
    data: parms,
  });
}

// 根据Token获取用户，验证成功返回用户信息，验证失败就返回code -1
export async function queryUserByToken() {
  return request(`/${SSO}/user/queryUserByToken`, { method: 'GET' });
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
