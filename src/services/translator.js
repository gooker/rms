import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { I18N } = NameSpace;

// 应用-对应的翻译内容展示
export async function getTranslationByCode(params) {
  return request(`/${I18N}/getTranslationByAppCode`, {
    method: 'GET',
    data: params,
  });
}

// 保存-update
export async function updateTranslations(params) {
  return request(`/${I18N}/updateTranslations`, {
    method: 'POST',
    data: params,
  });
}

// 系统支持的语种列表
export async function getSysLang() {
  return request(`/${I18N}/getSysSupportLang`, {
    method: 'GET',
  });
}

// 添加语言
export async function addSysLang(params) {
  return request(`/${I18N}/addSysLang`, {
    method: `POST`,
    data: params,
  });
}

// 已注册国际化的应用列表
export async function getApplications() {
  return request(`/${I18N}/getApplications`, {
    method: 'GET',
  });
}

// 添加应用
export async function addApplication(params) {
  return request(`/${I18N}/addApplication`, {
    method: `POST`,
    data: params,
  });
}
