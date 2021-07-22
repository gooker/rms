import axios from 'axios';
import { formatMessage } from '@/components/Lang';
import { getDomainNameByUrl, isStandardApiResponse } from '@/utils/utils';

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

  let messageContent = error.message || 'Unrecognized Error';
  const response = error.response;
  if (!response) {
    if (error.message === 'Failed to fetch') {
      messageContent = formatMessage({ id: 'app.tip.failed.fetch' }, { url: error.request.url });
    }
    return { code: '-1', data: null, message: messageContent };
  }

  const { status } = response;
  const statusMessage = codeMessage[status];
  messageContent = statusMessage || messageContent;

  return { code: '-1', data: null, message: messageContent };
};

const request = async (requestUrl, payload) => {
  const { data, method, headers = {} } = payload;
  const localStorageToken = window.localStorage.getItem('Authorization');
  const url = getDomainNameByUrl(requestUrl);
  const option = {
    url,
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: `Bearer ${localStorageToken}`,
      ...headers,
    },
  };
  if (headers.sectionId === undefined) {
    option.headers.sectionId = window.localStorage.getItem('sectionId');
  }
  if (headers.responseType === 'blob') {
    option.responseType = 'arraybuffer';
  }

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

  let responseEntity;
  try {
    responseEntity = await axios(option);
  } catch (error) {
    responseEntity = errorHandler(error);
  }

  // 如果catch到错误就会直接走这个分支
  if (isStandardApiResponse(responseEntity)) {
    return responseEntity;
  }

  const { data: responseData, headers: responseHeader } = responseEntity;
  // 返回''表示未查询到, code默认为2
  if (responseData === '') {
    return { code: '2', data: null, message: null };
  }
  // 判断是否是文件流
  if (responseHeader['content-type'] === 'application/octet-stream') {
    const blob = new Blob([responseData], { type: 'application/zip' });
    const downloadLink = document.createElement('a');
    downloadLink.download = decodeURI(responseHeader.filename);
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  }

  // 缓存当地时区数据
  if (responseHeader) {
    const timeZone = responseHeader['time-zone'];
    sessionStorage.setItem('timeZone', timeZone);
  }

  if (isStandardApiResponse(responseData)) {
    if (responseData.code === '-1') {
      return responseData;
    }
    return responseData.data;
  }
  return responseData;
};

export default request;
