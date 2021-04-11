import { message } from 'antd';
// import { history } from 'react-router-dom';
import intl from 'react-intl-universal';
import moment from 'moment-timezone';
import requestAPI from '@/utils/requestAPI';

// 拼接完整URL
export function getDomainNameByUrl(url) {
  const apis = requestAPI();
  const array = url.split('/');
  if (array.length < 2) {
    message.error(intl.formatMessage({ id: 'app.request.addressError' }));
    return url;
  }
  if (apis && array[1] != null && apis[array[1]] != null) {
    return `${apis[array[1]]}${url}`;
  }

  const messageContent = intl.formatMessage(
    { id: 'app.require.namespace' },
    { namespace: array[1] },
  );
  return { code: '-1', data: null, message: messageContent };
}

export function isStandardApiResponse(response) {
  return (
    response.hasOwnProperty('code') &&
    response.hasOwnProperty('data') &&
    response.hasOwnProperty('message')
  );
}

export function dealResponse(response, notification, messageInfo) {
  // 如果后台发错误，那么response对象就会是标准的后台返回对象, {code:'-1', data:***, message:****}
  if (response && response.code === '-1') {
    const { data, message: errorMessage } = response;
    const defaultMessage = intl.formatMessage({ id: 'app.common.systemError' });
    message.error(errorMessage || defaultMessage);
    if (data === 'logout') {
      // history.push('/login');
    }
    return true;
  }

  // 正常请求后返回false, 表示当前请求无错误
  notification &&
    message.success(messageInfo || intl.formatMessage({ id: 'app.common.operationFinish' }));
  return false;
}

export function postMessageToParent(type, payload) {
  window.parent.postMessage({ type, payload }, '*');
}

export function dateFormat(value, type) {
  //获取服务器端的时区偏移量
  let date = null;
  if (value == null) {
    return {
      format: () => {
        return '';
      },
    };
  }
  let timeZone = 'GMT';
  if (sessionStorage.getItem('timeZone') != null) {
    timeZone = sessionStorage.getItem('timeZone');
  }

  if (type) {
    //将本地时间转化服务时间
    if (localStorage.getItem('userTimeZone') != null) {
      moment.tz.setDefault(localStorage.getItem('userTimeZone'));
    } else {
      moment.tz.setDefault(moment.tz.guess());
    }
    if (value.format) {
      date = new moment(value.format('YYYY-MM-DD HH:mm:ss')).tz(timeZone);
    } else {
      date = new moment(value).tz(timeZone);
    }
  } else {
    //将服务器时间转化成本地时间
    //获取当前时区偏移量
    moment.tz.setDefault(timeZone); //将服务器的时间和服务器返回的时区转回成带有时区的时间格式
    if (localStorage.getItem('userTimeZone') != null) {
      date = new moment(value).tz(localStorage.getItem('userTimeZone'));
    } else {
      date = new moment(value).tz(moment.tz.guess());
    }
  }
  // moment.tz.setDefault(timeZone)
  if (date == null) {
    return {
      format: () => {
        return '';
      },
    };
  } else {
    return date;
  }
}

export function adjustModalWidth() {
  const maxWidth = 1200;
  const width = document.body.clientWidth * 0.8;
  return width >= maxWidth ? maxWidth : width;
}

export function getContentHeight() {
  const layoutContentDOM = document.getElementById('layoutContent');
  return layoutContentDOM?.offsetHeight ?? 0;
}

export function isNull(value) {
  return value === null || value === undefined;
}

export function isStrictNull(value) {
  return value === null || value === undefined || value === '';
}
