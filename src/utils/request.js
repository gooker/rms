import axios from 'axios';
import { isPlainObject } from 'lodash';
import { formatMessage, getDomainNameByUrl, isNull, isStandardApiResponse } from '@/utils/util';

// 请求拦截器
axios.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${window.sessionStorage.getItem('token')}`;
  config.headers['Content-Type'] = 'application/json; charset=utf-8';
  const sectionId = window.localStorage.getItem('sectionId');
  if (config.attachSection && isNull(config.headers.sectionId) && !isNull(sectionId)) {
    config.headers.sectionId = sectionId;
  }
  return config;
});

// 响应拦截器
axios.interceptors.response.use((response) => {
  // 缓存当地时区数据
  const { data, headers } = response;
  const timeZone = headers['time-zone'];
  if (timeZone) {
    window.localStorage.setItem('serverTimeZone', timeZone);
  }

  // 如果是文件流就执行下载
  if (headers['content-type'] === 'application/octet-stream') {
    const blob = new Blob([data], { type: 'application/zip' });
    const downloadLink = document.createElement('a');
    downloadLink.download = decodeURI(headers.filename);
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.click();
    URL.revokeObjectURL(downloadLink.href);
  }

  return response;
});

// 异常处理程序
const errorHandler = (error) => {
  const codeMessage = {
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
  const { response } = error;
  if (response) {
    const { status, data } = response;
    const netStateMessage = codeMessage[status];
    if (netStateMessage) {
      if (status === 401) {
        setTimeout(() => {
          window.RMS.push('/login');
        }, 1500);
      }
      return { code: '-1', data: null, message: netStateMessage };
    } else {
      const message = data.message || formatMessage({ id: 'app.request.failed' });
      return { code: '-1', data: null, message };
    }
  } else {
    let messageContent;
    if (error.message === 'Network Error') {
      messageContent = formatMessage({ id: 'app.request.failed' });
    } else {
      messageContent = formatMessage({ id: 'app.request.error' });
    }
    return { code: '-1', data: null, message: messageContent };
  }
};

/**
 * @param requestUrl
 * @param payload {{method:POST|GET,data}}
 */
const request = async (requestUrl, payload) => {
  const { data, body, method, headers = {} } = payload;

  let attachSection = isNull(payload.attachSection) ? true : payload.attachSection;
  if (requestUrl.startsWith('/sso/')) {
    attachSection = false;
  }

  const url = getDomainNameByUrl(requestUrl);
  // 此时可能会遇到找不到API的问题
  if (isPlainObject(url)) {
    return url;
  }
  const option = { url, method, headers, attachSection };

  // 针对文件下载
  if (headers.responseType === 'blob') {
    option.responseType = 'arraybuffer';
  }

  // 目前后端不是 RestFul API, 所以只需要关注 GET 和 POST
  if (method.toUpperCase() === 'GET') {
    option.params = data ?? body;
  } else {
    option.data = data ?? body;
  }

  // 请求返回实体
  let responseEntity;
  try {
    responseEntity = await axios(option);
  } catch (error) {
    responseEntity = errorHandler(error);
  }

  // 如果走这个分支则说明catch到错误了，这里是常规的HTTP错误
  if (isStandardApiResponse(responseEntity)) {
    return responseEntity;
  }
  const { data: responseData } = responseEntity;
  if (isStandardApiResponse(responseData)) {
    // 这里是后台返回的自定义错误
    if (responseData.code === '-1') {
      return responseData;
    }
    return responseData.data;
  }
  return responseData;
};
export default request;
