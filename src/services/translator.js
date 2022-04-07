import request from '@/utils/request';
import { NameSpace } from '@/config/config';

const { I18N } = NameSpace;

// 应用-对应的翻译内容展示
export async function getTranslationByCode(appCode) {
  return request(`/${I18N}/getTranslationByAppCode`, {
    method: 'GET',
    data: { appCode },
  });
}

// 更新具体翻译，保存到custom-批量
export async function updateTranslations(params) {
  return request(`/${I18N}/batchUpdateTranslation`, {
    method: 'POST',
    data: params,
  });
}

// 系统支持的语种列表
export async function getSysLang() {
  return request(`/${I18N}/languageType/findAll`, {
    method: 'GET',
  });
}

// 导入
export async function updateSysTranslation(params) {
  return request(`/${I18N}/importTranslation`, {
    method: 'POST',
    data: params,
  });
}

// 添加语言
export async function addSysLang(params) {
  return request(`/${I18N}/languageType/addOrUpdate`, {
    method: `POST`,
    data: params,
  });
}
