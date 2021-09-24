// 通用代码片段
import { message, Tag } from 'antd';
import moment from 'moment-timezone';
import intl from 'react-intl-universal';
import requestAPI from '@/utils/requestAPI';
import Dictionary from '@/utils/Dictionary';
import { AgvStateColor } from '@/consts';

export function formatMessage({ id }, values) {
  if (id) {
    const content = intl.get(id, values);
    return content || id;
  }
  return '###';
}

export function getDomainNameByUrl(url) {
  const apis = requestAPI();
  const array = url.split('/');
  if (array.length < 2) {
    message.error(formatMessage({ id: 'app.request.addressError' }));
    return url;
  }
  if (apis && array[1] != null && apis[array[1]] != null) {
    return `${apis[array[1]]}${url}`;
  }

  const messageContent = formatMessage({ id: 'app.require.namespace' }, { namespace: array[1] });
  return { code: '-1', data: null, message: messageContent };
}

export function isStandardApiResponse(response) {
  return (
    response.hasOwnProperty('code') &&
    response.hasOwnProperty('data') &&
    response.hasOwnProperty('message')
  );
}

export function dealResponse(response, notification, successMessage, failedMessage) {
  // 如果后台发错误，那么response对象就会是标准的后台返回对象, {code:'-1', data:***, message:****}
  if (response && response.code === '-1') {
    const { data, message: errorMessage } = response;
    const defaultMessage = formatMessage({ id: 'app.common.systemError' });
    message.error(errorMessage || failedMessage || defaultMessage);
    if (data === 'logout') {
      // history.push('/login');
    }
    return true;
  }

  // 正常请求后返回false, 表示当前请求无错误
  notification &&
    message.success(successMessage || formatMessage({ id: 'app.common.operationFinish' }));
  return false;
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
    if (!isStrictNull(localStorage.getItem('userTimeZone'))) {
      date = new moment(value).tz(localStorage.getItem('userTimeZone'));
    } else {
      date = new moment(value).tz(moment.tz.guess());
    }
  }
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

export function getSuffix(value, suffix, props) {
  if (value != null) {
    return (
      <span>
        <span {...props}>{value}</span>
        <span style={{ marginLeft: 1, fontSize: 14 }}>{suffix}</span>
      </span>
    );
  } else {
    return null;
  }
}

export function adjustModalWidth() {
  const maxWidth = 1200;
  const width = document.body.clientWidth * 0.8;
  return width >= maxWidth ? maxWidth : width;
}

export function isNull(value) {
  return value === null || value === undefined;
}

export function isStrictNull(value) {
  return isNull(value) || value === '';
}

export function getContentHeight() {
  const layoutContentDOM = document.getElementById('layoutContent');
  const layoutContentDOMRect = layoutContentDOM.getBoundingClientRect();
  return document.body.offsetHeight - layoutContentDOMRect.top;
}

/**
 * 根据角度获取方向描述
 * @param {Number} angle
 * @returns
 */
export function getDirectionLocale(angle) {
  if (isNull(angle)) {
    return <span style={{ color: 'red' }}>{formatMessage({ id: 'app.common.noRecord' })}</span>;
  }
  if ([0, 90, 180, 270].includes(angle)) {
    return formatMessage({ id: Dictionary('agvDirection', angle) });
  } else {
    return `${angle}°`;
  }
}

/**
 * 渲染小车状态标识
 * @param {String} agvStatus
 * @returns
 */
export function renderAgvStatus(agvStatus) {
  if (agvStatus != null) {
    const agvStateMap = Dictionary('agvStatus');
    return (
      <Tag color={AgvStateColor[agvStatus]}>{formatMessage({ id: agvStateMap[agvStatus] })}</Tag>
    );
  } else {
    return null;
  }
}

/**
 * 根据秒数获取 {天数, 小时, 分钟}
 * @param {Number} second
 * @returns {}
 */
export function getDay(second) {
  const mss = second * 1000;
  let days = parseInt(mss / (1000 * 60 * 60 * 24));
  let hours = (mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60);
  let minutes = (mss % (1000 * 60 * 60)) / (1000 * 60);
  return {
    days: parseInt(days),
    hours: parseInt(hours),
    minutes: parseInt(minutes),
  };
}

/**
 * 复制内容到剪贴板
 * @param {String} value
 * @returns null
 */
export function copyToBoard(value) {
  const input = document.createElement('input');
  input.setAttribute('readonly', 'readonly');
  input.setAttribute('value', value);
  document.body.appendChild(input);
  input.setSelectionRange(0, 9999);
  input.select();
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    document.body.removeChild(input);
    message.info(formatMessage({ id: 'app.copyboard.success' }));
  } else {
    document.body.removeChild(input);
    message.warn(formatMessage({ id: 'app.copyboard.unsupportCopyAPI' }));
    return false;
  }
}

/**
 * 休眠 ms
 * @param {Number} milliseconds
 */
export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 生成随机id
 * @param {Number} length
 */
export function uuid(length) {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  length = length || 8;
  let result = '';
  for (let i = length; i > 0; --i) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

/**
 * 保留小数点以后几位，默认2位
 * @param {*} number
 * @param {*} no
 * @returns
 */
export function cutNumber(number, no = 2) {
  if (typeof number != 'number') {
    number = Number(number);
  }
  return Number(number.toFixed(no));
}

export function getPathname(route) {
  if (route === '/' || !route) return '/';
  const { hash } = new URL(route);
  const pathname = hash.replace('#/', '');
  const snippet = pathname.split('/').filter(Boolean);
  snippet.shift();
  return `/${snippet.join('/')}`;
}

export function extractNameSpaceInfoFromEnvs(env) {
  const { additionalInfos } = env;
  if (!additionalInfos || additionalInfos.length === 0) {
    return {};
  }
  const nameSpaceInfoMap = {};
  additionalInfos.forEach(({ key, value }) => {
    nameSpaceInfoMap[key] = value;
  });
  return nameSpaceInfoMap;
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

