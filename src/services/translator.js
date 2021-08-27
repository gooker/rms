import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { Coordinator } = NameSpace;

// ************************************** 翻译管理  ************************************** //
// 应用-对应的翻译内容展示
export async function getTranslationBycode(params) {
  return request(`/${Coordinator}/translation/getTranslationByAppCode`, {
    method: 'GET',
    data: params,
  });
}
// 保存-update
export async function updateTranslations(params) {
  return request(`/${Coordinator}/translation/updateTranslations`, {
    method: 'POST',
    data: params,
  });
}



// 系统支持的语种列表
export async function getSysLang() {
  return request(`/${Coordinator}/translation/getSysSupportLang`, {
    method: 'GET',
  });
}

// 添加语言
export async function addSysLang(params) {
  return request(`/${Coordinator}/translation/addSysLang`, {
    method: `POST`,
    data: params,
  });
}
// 已注册国际化的应用列表
export async function getApplications() {
  return request(`/${Coordinator}/translation/getApplications`, {
    method: 'GET',
  });
}

// 添加应用
export async function addApplication(params) {
  return request(`/${Coordinator}/translation/addApplication`, {
    method: `POST`,
    data: params,
  });
}

