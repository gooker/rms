import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { Platform } = NameSpace;

export async function fetchLanguageByAppCode(params) {
  return request(`/${Platform}/translation/getTranslationByParam`, {
    method: 'POST',
    data: params,
  });
}

// 应用-对应的翻译内容展示
export async function getTranslationByCode(appCode) {
  return request(`/${Platform}/translation/getTranslationByAppCode`, {
    method: 'GET',
    data: { appCode },
  });
}

// 更新具体翻译，保存到custom-批量
export async function updateTranslations(params) {
  return request(`/${Platform}/translation/batchUpdateTranslation`, {
    method: 'POST',
    data: params,
  });
}

// 系统支持的语种列表
export async function getSysLang() {
  return request(`/${Platform}/translation/languageType/findAll`, {
    method: 'GET',
  });
}

export async function deleteSysLang(code) {
  return request(`/${Platform}/translation/deleteSysLang`, {
    method: 'GET',
    data: { type: code },
  });
}

// 导入
export async function updateSysTranslation(params) {
  return request(`/${Platform}/translation/importTranslation`, {
    method: 'POST',
    data: params,
  });
}

// 添加语言
export async function addSysLang(params) {
  return request(`/${Platform}/translation/languageType/addOrUpdate`, {
    method: `POST`,
    data: params,
  });
}
