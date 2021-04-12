/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import umiRequest from 'umi-request';
import { formatMessage } from '@/utils/Lang';
import { getDomainNameByUrl, isStandardApiResponse, postMessageToParent } from '@/utils/utils';

// 异常处理程序
const errorHandler = (error) => {
  const codeMessage = {
    200: formatMessage({ id: 'app.request.200' }),
    201: formatMessage({ id: 'app.request.201' }),
    202: formatMessage({ id: 'app.request.202' }),
    204: formatMessage({ id: 'app.request.204' }),
    400: formatMessage({ id: 'app.request.400' }),
    401: formatMessage({ id: 'app.request.401' }),
    403: formatMessage({ id: 'app.request.403' }),
    404: formatMessage({ id: 'app.request.404' }),
    406: formatMessage({ id: 'app.request.406' }),
    410: formatMessage({ id: 'app.request.410' }),
    422: formatMessage({ id: 'app.request.422' }),
    500: formatMessage({ id: 'app.request.500' }),
    502: formatMessage({ id: 'app.request.502' }),
    503: formatMessage({ id: 'app.request.503' }),
    504: formatMessage({ id: 'app.request.504' }),
  };

  let messageContent = 'Unrecognized Error';
  const response = error.response;
  if (response === null) {
    if (error.message === 'Failed to fetch') {
      messageContent = formatMessage({ id: 'app.tip.failed.fetch' }, { url: error.request.url });
    }
  }
  if (response instanceof Response) {
    const { status } = response;
    const statusMessage = codeMessage[status];
    messageContent = statusMessage || messageContent;

    // 通知 Portal 登出
    if (status === 401) {
      postMessageToParent('logout', null);
    }
  }
  return { code: '-1', data: null, message: messageContent };
};

const request = async (requestUrl, payload) => {
  const { data, method, headers } = payload;
  const localStorageToken = window.localStorage.getItem('Authorization');
  const url = getDomainNameByUrl(requestUrl);
  if (url.code) {
    return url;
  }
  const option = {
    method,
    errorHandler,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${localStorageToken}`,
      sectionId: window.localStorage.getItem('sectionId'),
      ...headers,
    },
  };

  // I18n请求不需要带section头
  if (requestUrl === '/translation/getTranslationByParam') {
    delete option.headers.sectionId;
  }

  // 目前后端不是 RestFul API, 所以只需要关注 GET 和 POST
  if (method.toUpperCase() === 'GET') {
    option.params = data;
  } else {
    option.data = data;
  }

  const response = await umiRequest(url, option);
  // SSO API 成功返回的结果没有按照标准返回格式; 发生错误时只会返回: {code:'-1', message:'失败'}
  if (response.code === '-1') {
    return { ...response, data: null };
  }
  if (isStandardApiResponse(response)) {
    return response.data;
  }
  return response;
};

export default request;
