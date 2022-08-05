import request from '@/utils/request';
import { NameSpace } from '@/config/config';

/***************** 参数列表 *****************/
// 获取参数列表模板数据
export async function fetchFormTemplate(body) {
  return request(`/${NameSpace.Platform}/formTemplate/getFormTemplate`, {
    method: 'GET',
    data: body,
  });
}

// 更新参数列表配置
export async function updateFormTemplateValue(body) {
  return request(`/${NameSpace.Platform}/formTemplate/updateFormTemplateValue`, {
    method: 'POST',
    data: body,
  });
}

export async function fetchFormTemplateValueByKey(key) {
  return request(`/${NameSpace.Platform}/formTemplate/getParameter/${key}`, {
    method: 'GET',
  });
}
