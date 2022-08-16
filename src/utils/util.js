import React from 'react';
import { message, Select, Tag } from 'antd';
import { find, isEmpty, isEqual as deepEqual, isPlainObject, sortBy } from 'lodash';
import moment from 'moment-timezone';
import intl from 'react-intl-universal';
import { getApiURL } from '@/utils/requestAPI';
import Dictionary from '@/utils/Dictionary';
import { ToteOffset, VehicleStateColor } from '@/config/consts';
import FormattedMessage from '@/components/FormattedMessage';
import Loadable from '@/components/Loadable';
import { selectAllDB } from '@/utils/IndexDBUtil';
import { AppCode } from '@/config/config';

const Colors = Dictionary().color;

/**
 * 将服务器时间转化成本地时间
 * @param {*} value
 * @returns
 */
export function convertToUserTimezone(value) {
  // 获取服务器端的时区偏移量
  if (isStrictNull(value)) {
    return {
      format: () => {
        return '';
      },
    };
  }

  // 当前地区时区
  let localTimeZone = window.localStorage.getItem('serverTimeZone');
  localTimeZone = localTimeZone || 'GMT';
  moment.tz.setDefault(localTimeZone); // 将服务器的时间和服务器返回的时区转回成带有时区的时间格式

  // 获取当前时区偏移量
  let date;
  const userTimeZone = window.localStorage.getItem('userTimeZone');
  if (!isNull(userTimeZone)) {
    date = new moment(value).tz(userTimeZone);
  } else {
    date = new moment(value).tz(moment.tz.guess());
  }

  if (isNull(date)) {
    return {
      format: () => {
        return '';
      },
    };
  }
  return date;
}

export function fastConvertToUserTimezone(text) {
  return convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
}

export function isEmptyPlainObject(obj) {
  return isPlainObject(obj) && isEmpty(obj);
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

// 检查array中是否有元素在baseArray中存在
export function isItemOfArray(baseArray, array) {
  let result = false;
  for (const arrayElement of array) {
    if (baseArray.includes(arrayElement)) {
      result = true;
      break;
    }
  }
  return result;
}

export function formatMessage(i18n, values = {}) {
  let key = i18n;
  if (isPlainObject(i18n)) {
    key = i18n.id;
  }
  const content = intl.get(key, values);
  return content || key;
}

export const htmlFormatMessage = ({ id }, values) => {
  if (id) {
    const content = intl.getHTML(id, values);
    return content || id;
  }
  return '###';
};

export function getDomainNameByUrl(url) {
  const apis = window.nameSpacesInfo;
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
  return response.hasOwnProperty('code') && response.hasOwnProperty('message');
}

export function parseUrlParams(url, params) {
  const paramsArray = [];
  Object.keys(params).forEach((key) => params[key] && paramsArray.push(`${key}=${params[key]}`));
  if (url.search(/\?/) === -1) {
    url += `?${paramsArray.join('&')}`;
  } else {
    url += `&${paramsArray.join('&')}`;
  }
  return url;
}

export function dealResponse(response, successMessage, failedMessage) {
  // 如果后台发错误，那么response对象就会是标准的后台返回对象, {code:'-1', data:***, message:****}
  const failNotify = failedMessage !== false;
  if (Array.isArray(response)) {
    let failed = false;
    for (let i = 0; i < response.length; i++) {
      if (response[i] && isStandardApiResponse(response[i])) {
        failed = true;
        break;
      }
    }
    if (failed && failNotify) {
      message.error(formatMessage({ id: 'app.request.concurrent.failed' }));
      return true;
    }
  } else {
    if (response && isStandardApiResponse(response)) {
      const { message: errorMessage } = response;
      const defaultMessage = formatMessage({ id: 'app.message.operateFailed' });
      failNotify && message.error(failedMessage || errorMessage || defaultMessage);
      return true;
    }
  }

  // 正常请求后返回false, 表示当前请求无错误
  if (successMessage) {
    message.success(
      typeof successMessage === 'string'
        ? successMessage
        : formatMessage({ id: 'app.message.operateSuccess' }),
    );
  }
  return false;
}

// 弧度转角度
export function radToAngle(rad) {
  return (rad * 180) / Math.PI;
}

// 角度转弧度
export function angleToRad(angle) {
  return (angle * Math.PI) / 180;
}

export function getSuffix(value, suffix, props) {
  if (value != null) {
    return (
      <span {...props}>
        <span>{value}</span>
        <span style={{ marginLeft: 1, fontSize: 14 }}>{suffix}</span>
      </span>
    );
  } else {
    return null;
  }
}

export function renderBattery(battery) {
  if (isStrictNull(battery)) return null;
  let batteryColor;
  if (battery > 50) {
    batteryColor = Colors.green;
  } else if (battery > 10) {
    batteryColor = Colors.yellow;
  } else {
    batteryColor = Colors.red;
  }
  return getSuffix(parseInt(battery), '%', {
    style: { color: batteryColor, fontWeight: 700, fontSize: '20px' },
  });
}

export function renderVehicleState(state) {
  if (!isStrictNull(state)) {
    return (
      <Tag color={VehicleStateColor[state]} style={{ margin: 0 }}>
        <FormattedMessage id={`vehicleState.${state}`} />
      </Tag>
    );
  }
  return null;
}

export function adjustModalWidth() {
  const maxWidth = 1200;
  const width = document.body.clientWidth * 0.8;
  return width >= maxWidth ? maxWidth : width;
}

export function adjustTaskDetailModalWidth() {
  const width = document.body.clientWidth;
  if (width <= 2048) {
    return 1200;
  }
  return 1200 + Math.ceil((width - 2048) / 4);
}

export function isNull(value) {
  return value === null || value === undefined;
}

export function isStrictNull(value) {
  return isNull(value) || value === '';
}

export function isSubArray(childArr, fatherArr) {
  return childArr.every((v) => fatherArr.includes(v));
}

export function getContentHeight() {
  const layoutContentDOM = document.getElementById('layoutContent');
  return layoutContentDOM?.getBoundingClientRect()?.height || 0;
}

// 根据direction, distance对obj的坐标进行更新操作
export function offsetByDirection(obj, direction, distance) {
  const result = { x: 0, y: 0 };
  if (direction === 0) {
    result.x = obj.x;
    result.y = obj.y - distance;
  }
  if (direction === 1) {
    result.x = obj.x + distance;
    result.y = obj.y;
  }
  if (direction === 2) {
    result.x = obj.x;
    result.y = obj.y + distance;
  }
  if (direction === 3) {
    result.x = obj.x - distance;
    result.y = obj.y;
  }
  return result;
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
    return formatMessage({ id: Dictionary('vehicleDirection', angle) });
  } else {
    return `${angle}°`;
  }
}

/**
 * 渲染小车状态标识
 * @param {String} vehicleStatus
 * @returns
 */
export function getVehicleStatusTag(vehicleStatus) {
  if (vehicleStatus != null) {
    return (
      <Tag color={VehicleStateColor[vehicleStatus]}>
        {formatMessage(`vehicleState.${vehicleStatus}`)}
      </Tag>
    );
  } else {
    return null;
  }
}

/**
 * 根据秒数获取 {天数, 小时, 分钟}
 * @param {Number} second
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
export function copyToClipBoard(value) {
  const textArea = document.createElement('textarea');
  textArea.value = value;

  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    if (successful) {
      message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    } else {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    }
  } catch (err) {
    console.error('Copy Error Stack: ', err);
    message.error(formatMessage({ id: 'app.message.operateFailed' }));
  }
  document.body.removeChild(textArea);
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

export function extractNameSpaceInfoFromEnvs(env) {
  const { additionalInfos } = env;
  if (!additionalInfos || additionalInfos.length === 0) {
    return {};
  }
  const nameSpaceInfoMap = {};
  additionalInfos.forEach(({ key, value }) => {
    nameSpaceInfoMap[key] = getApiURL(key, value);
  });
  return nameSpaceInfoMap;
}

// 只针对pixi坐标系
export function getDirByAngle(angle) {
  if (angle > 315 || angle <= 45) return 0;
  if (angle > 45 && angle <= 135) return 1;
  if (angle > 135 && angle <= 225) return 2;
  if (angle > 225 && angle <= 315) return 3;
}

export function isEqual(obj1, obj2) {
  // 为了提高对比效率，对空对象和空数组进行特殊处理
  // 数组
  if (
    Array.isArray(obj1) &&
    Array.isArray(obj2) &&
    JSON.stringify(obj1) === '[]' &&
    JSON.stringify(obj2) === '[]'
  ) {
    return true;
  }
  // 对象
  if (JSON.stringify(obj1) === '{}' && JSON.stringify(obj2) === '{}') {
    return true;
  }

  if (obj1 !== obj2) {
    return false;
  }
  return deepEqual(obj1, obj2);
}

export function getDpr() {
  const { clientHeight } = document.getElementById('monitorDashboard');
  const a = (clientHeight - 710) / 1440;
  if (a > 0) {
    return a + 1;
  }
  return 1;
}

export function getToteLayoutBaseParam(vehicleDirection, side) {
  let angle;
  let XBase;
  let YBase;
  let offset;
  let adapte; // adapte: 用于判断料箱在哪个方向进行距离调整, 非offset
  switch (vehicleDirection) {
    // 向上
    case 0:
      angle = side === 'L' ? 90 : 270;
      XBase = side === 'L' ? -1 : 1;
      YBase = -1;
      offset = side === 'L' ? ToteOffset.left : ToteOffset.right;
      adapte = 'X';
      break;
    // 向右
    case 1:
      angle = side === 'L' ? 0 : 180;
      XBase = 1;
      YBase = side === 'L' ? -1 : 1;
      offset = side === 'L' ? ToteOffset.left : ToteOffset.right;
      adapte = 'Y';
      break;
    // 向下
    case 2:
      angle = side === 'L' ? 270 : 90;
      XBase = side === 'L' ? 1 : -1;
      YBase = 1;
      offset = side === 'L' ? ToteOffset.left : ToteOffset.right;
      adapte = 'X';
      break;
    // 向左
    case 3:
      angle = side === 'L' ? 0 : 180;
      XBase = -1;
      YBase = side === 'L' ? 1 : -1;
      offset = side === 'L' ? ToteOffset.left : ToteOffset.right;
      adapte = 'Y';
      break;
    default:
      break;
  }
  return { angle, XBase, YBase, offset, adapte };
}

// 统一定义故障展示颜色
export function defineErrorColor(level) {
  if ([1, 2].includes(level)) {
    return Colors.blue;
  }
  if ([3, 4].includes(level)) {
    return Colors.yellow;
  }
  if ([5].includes(level)) {
    return Colors.red;
  }
}

// 获取Form表单layout数据
export function getFormLayout(label, content) {
  const formItemLayout = { labelCol: { span: label }, wrapperCol: { span: content } };
  const formItemLayoutNoLabel = { wrapperCol: { offset: label, span: content } };
  return { formItemLayout, formItemLayoutNoLabel };
}

// 地图弹窗相对位置
export function getMapModalPosition(width) {
  return {
    width: `${width}px`,
    left: `calc(50% - ${width / 2}px)`,
  };
}

/***** 报表中心  ****/
export function countDay(params) {
  if (params.endDate != null && params.startDate != null) {
    return {
      ...params,
      endDate: convertToUserTimezone(params.endDate).format('YYYY-MM-DD HH:mm:ss'),
      startDate: convertToUserTimezone(params.startDate).format('YYYY-MM-DD HH:mm:ss'),
    };
  }

  if (!isNull(params.datePattern) && !isNull(params.relativeDay)) {
    //首先确定时间格式
    params.endDate = new moment().format();
    if (params.datePattern === 'hour') {
      params.startDate = new moment()
        .subtract(parseInt(params.relativeDay), 'hours')
        .minutes(0)
        .seconds(0)
        .format();
    } else if (params.datePattern === 'month') {
      params.startDate = new moment()
        .subtract(parseInt(params.relativeDay), 'months')
        .date(1)
        .hours(0)
        .minutes(0)
        .seconds(0)
        .format();
    } else {
      params.startDate = new moment()
        .subtract(parseInt(params.relativeDay), 'days')
        .hours(0)
        .minutes(0)
        .seconds(0)
        .format();
    }
    return {
      ...params,
      endDate: convertToUserTimezone(params.endDate).format('YYYY-MM-DD HH:mm:ss'),
      startDate: convertToUserTimezone(params.startDate).format('YYYY-MM-DD HH:mm:ss'),
    };
  }
  return { ...params };
}

export function getSortedAppList(grantedAPP, isAdmin) {
  if (!Array.isArray(grantedAPP) || grantedAPP.length === 0) return [];
  if (isAdmin) {
    // 如果是admin账户登录，就只显示SSO APP
    return grantedAPP.filter((item) => item === AppCode.SSO);
  }
  // 对grantedAPP进行排序，提高与用户体验
  const baseOrder = Object.keys(AppCode);
  let sortedSeed = grantedAPP.map((item) => ({
    code: item,
    index: baseOrder.indexOf(item),
  }));
  sortedSeed = sortBy(sortedSeed, ['index']).map(({ code }) => code);
  return sortedSeed;
}

export function match(array, elements, key, descriptionValue) {
  if (array == null || array.length === 0) {
    return [];
  }
  const result = [];
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    const obj = find(elements, (record) => record[key] === element);
    if (obj == null) {
      result.push(0);
    } else {
      result.push(obj[descriptionValue]);
    }
  }
  return result;
}

export function transformReportDetail(data) {
  const subtext =
    new moment(data.startDate).format('YYYY-MM-DD') +
    '~' +
    new moment(data.startDate).format('YYYY-MM-DD');
  return {
    type: data.type, //图表类型
    descriptionKeys: data.dimensionality,
    descriptionValues: [data.countValue],
    title: data.name,
    subtext: subtext,
    filters: data.filters,
    datePattern: data.datePattern,
    startDate: data.startDate,
    endDate: data.endDate,
  };
}

/**
 *
 * @param data
 * @param keyLabel 自定义key的标识
 * @param valueLabel 自定义value的标识
 */
export function convertMapToArrayMap(data, keyLabel = 'key', valueLabel = 'value') {
  if (isPlainObject(data)) {
    const result = Object.entries(data).map(([key, value]) => ({
      [keyLabel]: key,
      [valueLabel]: value,
    }));
    if (result.length === 0) {
      return [];
    }
    return result;
  } else {
    return [];
  }
}

/**
 * convertMapToArrayMap的逆函数
 */
export function convertMapArrayToMap(data, keyLabel = 'key', valueLabel = 'value') {
  const result = {};
  data.forEach((item) => {
    result[item[keyLabel]] = item[valueLabel];
  });
  return result;
}

/**
 * convertMapToArrayMap 的逆运算
 * @param input [{type:'xxx', code:[1,2,3]},{type:'xxx',code:[2,3,4]}]
 * @param keyLabel 自定义key的标识
 * @param valueLabel 自定义value的标识
 *
 */
export function extractMapValueToMap(input, keyLabel = 'key', valueLabel = 'value') {
  if (Array.isArray(input)) {
    return input.map((item) => ({ [item[keyLabel]]: item[valueLabel] }));
  }
  return [];
}

// Modal 长宽自适应，以这个为主
export function adaptModalHeight() {
  const { clientHeight } = document.body;
  const heightDpr = getScreenHeightDpr();
  const height = 768 * heightDpr;
  const maxHeight = clientHeight * 0.8;
  return height > maxHeight ? maxHeight : height;
}

export function adaptModalWidth() {
  const { clientWidth } = document.body;
  const widthDpr = getScreenWidthDpr();
  const width = 1024 * widthDpr;
  const maxWidth = clientWidth * 0.8;
  return width > maxWidth ? maxWidth : width;
}

function getScreenWidthDpr() {
  const { clientWidth } = document.body;
  const a = (clientWidth - 1920) / 1920;
  if (a > 0) {
    return a + 1;
  }
  return 1;
}

function getScreenHeightDpr() {
  const { clientHeight } = document.body;
  const a = (clientHeight - 1080) / 1080;
  if (a > 0) {
    return a + 1;
  }
  return 1;
}

//************* 获取随机字符串 *************//
const randomStringSeed = [];
let charCode = 65;
for (let index = 0; index < 26; index++) {
  randomStringSeed.push(String.fromCharCode(charCode));
  charCode += 1;
}
charCode = 97;
for (let index = 0; index < 26; index++) {
  randomStringSeed.push(String.fromCharCode(charCode));
  charCode += 1;
}
for (let index = 0; index < 10; index++) {
  randomStringSeed.push(index);
}

export function getRandomString(length) {
  const randomString = [];
  for (let index = 0; index < length; index++) {
    randomString.push(randomStringSeed[Math.floor(Math.random() * randomStringSeed.length)]);
  }
  return randomString.join('');
}

//************* 获取随机字符串 *************//

// 自定义任务: 将地图编程数据转化成VM
export function convertScopeDataToUiOptions(scopeData) {
  const result = {};
  scopeData.forEach((item) => {
    const { logicAreaCode, routeActionList } = item;
    Object.keys(routeActionList).forEach((routeKey) => {
      result[`${logicAreaCode}-${routeKey}`] = Object.values(routeActionList[routeKey]);
    });
  });
  return result;
}

export function customTaskApplyDrag(arr, dragResult) {
  const { removedIndex, addedIndex, payload } = dragResult;
  if (removedIndex === null && addedIndex === null) return arr;

  const result = [...arr];

  // 如果是新增，给当前对象赋予一个code属性，custom_task_001
  let itemToAdd;
  if (payload) {
    itemToAdd = { ...payload };
    itemToAdd.code = `${payload.type}_${getRandomString(6)}`;
  }

  if (removedIndex !== null) {
    itemToAdd = result.splice(removedIndex, 1)[0];
  }

  if (addedIndex !== null) {
    result.splice(addedIndex, 0, itemToAdd);
  }

  return result;
}

export function extractRoutes(mapData) {
  const routes = [];
  if (mapData) {
    const logicAreaList = mapData?.logicAreaList || [];
    logicAreaList.forEach(({ id: logicId, name: logicName, routeMap }) => {
      const routeMapContent = Object.values(routeMap).map(({ name, code }) => ({
        logicId,
        logicName,
        name,
        code,
      }));
      routes.push(...routeMapContent);
    });
  }
  return routes;
}

// 十六进制转RGB
export function getColorRGB(_color, opacity = 1) {
  if (isNull(_color)) return null;

  // 16进制颜色值的正则
  const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;

  // 把颜色值变成小写
  let color = _color.toLowerCase();

  if (reg.test(color)) {
    // 如果只有三位的值，需变成六位，如：#fff => #ffffff
    if (color.length === 4) {
      let colorNew = '#';
      for (let i = 1; i < 4; i += 1) {
        colorNew += color.slice(i, i + 1).concat(color.slice(i, i + 1));
      }
      color = colorNew;
    }
    // 处理六位的颜色值，转为RGB
    const colorChange = [];
    for (let i = 1; i < 7; i += 2) {
      colorChange.push(parseInt('0x' + color.slice(i, i + 2)));
    }
    return `RGBA(${colorChange.join(',')},${opacity})`;
  } else {
    return color;
  }
}

// RGB转16进制
export function getColorHex(color) {
  // RGB颜色值的正则
  const reg = /^(rgb|RGB)/;
  if (reg.test(color)) {
    let strHex = '#';
    // 把RGB的3个数值变成数组
    const colorArr = color.replace(/(?:\(|\)|rgb|RGB)*/g, '').split(',');
    // 转成16进制
    for (let i = 0; i < colorArr.length; i++) {
      let hex = Number(colorArr[i]).toString(16);
      if (hex === '0') {
        hex += hex;
      }
      strHex += hex;
    }
    return strHex;
  } else {
    return String(color);
  }
}

// 将图片的File对象转换成Base64
export function convertPngToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function getUploadedImageDetail(imgFile) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(imgFile);
    reader.onload = function (e) {
      const image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        const { width, height } = this;
        resolve({ width, height });
      };
    };
  });
}

export function getPlateFormType() {
  const ua = navigator.userAgent,
    isWindowsPhone = /(Windows Phone)/.test(ua),
    isSymbian = /(SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(Android)/.test(ua),
    isFireFox = /(Firefox)/.test(ua),
    isChrome = /(Chrome|CriOS)/.test(ua),
    isTablet =
      /(iPad|PlayBook)/.test(ua) ||
      (isAndroid && !/(Mobile)/.test(ua)) ||
      (isFireFox && /(Tablet)/.test(ua)),
    isPhone = /(iPhone)/.test(ua) && !isTablet,
    isPc = !isPhone && !isAndroid && !isSymbian;
  return {
    isTablet: isTablet,
    isPhone: isPhone,
    isAndroid: isAndroid,
    isChrome: isChrome,
    isPc: isPc,
  };
}

export function validateUrl(str) {
  const regex = new RegExp(
    '^(?:(?:http|https|ws)://|//)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$',
    'i',
  );
  return regex.test(str);
}

export function convertMenuData2RouteData(allMenuData) {
  const result = [];
  const currentModuleRouter = allMenuData.map(({ menu }) => menu).flat();
  flatMenuData(currentModuleRouter, result);
  return result;
}

function flatMenuData(currentModuleRouter, result) {
  currentModuleRouter.forEach(({ path, component, routes, customNode }) => {
    if (Array.isArray(routes)) {
      flatMenuData(routes, result);
    } else {
      result.push({
        path,
        component,
        $$component: Loadable(() => import(`@/packages${component}`), { customNode, component }),
      });
    }
  });
}

export function LatentSizeUpdaterValidator(_, value) {
  if (isNull(value)) {
    return Promise.reject(new Error(formatMessage({ id: 'monitor.pod.podSize.required' })));
  }
  if (isStrictNull(value.width) || isStrictNull(value.height)) {
    return Promise.reject(new Error(formatMessage({ id: 'monitor.pod.podSize.incomplete' })));
  }
  if (parseInt(value.width, 10) <= 0 || parseInt(value.height, 10) <= 0) {
    return Promise.reject(new Error(formatMessage({ id: 'monitor.pod.podSize.invalid' })));
  }
  return Promise.resolve();
}

/**
 * 语言顺序：中文、英文、其他
 * @param languageList {Array}
 */
export function sortLanguages(languageList) {
  if (!Array.isArray(languageList) || languageList.length === 0) return [];
  const zhCN = find(languageList, { code: 'zh-CN' });
  const enUS = find(languageList, { code: 'en-US' });
  const result = languageList.filter((item) => !['zh-CN', 'en-US'].includes(item.code));
  result.unshift(enUS);
  result.unshift(zhCN);
  return result;
}

export function convertPrograming2Cascader(programing) {
  return Object.keys(programing).map((typeKey) => {
    const body = programing[typeKey];
    const option = {
      value: typeKey,
      label: formatMessage({ id: `editor.program.${typeKey}` }),
      children: [],
    };
    body.forEach((item) => {
      option.children.push({
        value: item.actionId,
        label: item.actionDescription,
      });
    });
    return option;
  });
}

// 将数组中符合条件的元素删掉， Lodash中同名方法有问题-->遇到第一个不符合条件的会直接break
export function dropWhile(array, predicate) {
  const result = [];
  for (const arrayElement of array) {
    if (!predicate(arrayElement)) {
      result.push(arrayElement);
    }
  }
  return result;
}

export async function getAllEnvironments(db) {
  const customEnvs = await selectAllDB(db);
  let activeEnv;
  const activeCustomEnv = find(customEnvs, { active: true });
  if (activeCustomEnv) {
    activeEnv = activeCustomEnv.id;
  } else {
    activeEnv = 'default';
  }
  const defaultEnv = { envName: 'default', id: 'default', active: activeEnv === 'default' };
  const allEnvs = [defaultEnv, ...customEnvs];
  return { customEnvs, allEnvs, activeEnv };
}

export function generateVehicleTypeOptions(vehicles) {
  const vehicleTypes = vehicles.map((item) => item.vehicle.vehicleType);
  return [...new Set(vehicleTypes)].map((item) => (
    <Select.Option key={item} value={item}>
      {item}
    </Select.Option>
  ));
}

export function generateResourceGroups(record) {
  const resourceGroups = record?.resourceGroups ?? [];
  const allNames = resourceGroups.map(({ groupName }) => groupName).filter(Boolean);

  const names = [];
  allNames?.map((name) => {
    names.push(<Tag color="blue">{name}</Tag>);
  });

  return names;
}

// 将接口获取的车辆列表数据转换成适合页面使用的格式
export function transformVehicleList(allVehicles) {
  return allVehicles.map((vehicleItem) => {
    const { vehicle, vehicleInfo, vehicleWorkStatusDTO, ...rest } = vehicleItem;
    return {
      ...rest,
      ...vehicle,
      currentCellId: vehicleInfo?.currentCellId,
      currentDirection: vehicleInfo?.direction,
      vehicleStatus: vehicleWorkStatusDTO?.vehicleStatus,
    };
  });
}

/**
 * @param extraHeight 额外高度
 * @param ref 组件ref
 */
export function getTableScrollY({ extraHeight, ref } = {}) {
  if (isNull(extraHeight)) {
    extraHeight = 64 + 24 * 2; // 分页组件高度
  }
  let dom = document;
  if (ref?.current) {
    dom = ref.current;
  }
  const headerHeight = dom.getElementsByClassName('ant-table-thead')[0];

  //header到视窗上边的距离;
  let headerBottom = 0;
  if (headerHeight) {
    headerBottom = headerHeight.getBoundingClientRect().bottom;
  }
  return `calc(100vh - ${headerBottom + extraHeight}px)`;
}

// 提取路由的openKey
export function extractOpenKeys(currentApp, allMenuData, pathname) {
  const currentAppRouter = allMenuData
    .filter(({ appCode }) => appCode === currentApp)
    .map(({ menu }) => menu);
  const currentModuleMenu = currentAppRouter.length > 0 ? currentAppRouter[0] : [];

  if (pathname === '/' || !Array.isArray(currentModuleMenu) || currentModuleMenu.length === 0) {
    return [];
  }

  const openKeys = [];
  const routeFirstLevelKeys = currentModuleMenu.map(({ path }) => path);
  for (let i = 0; i < routeFirstLevelKeys.length; i++) {
    if (pathname.startsWith(routeFirstLevelKeys[i])) {
      openKeys.push(routeFirstLevelKeys[i]);

      const suffix = `${routeFirstLevelKeys[i]}/`;
      const restPath = pathname.replace(suffix, '').split('/');
      if (restPath.length > 1) {
        // 最后一个路由是页面路由要去掉
        restPath.pop();
        let openKey = '';
        restPath.forEach((item) => {
          openKey = `${suffix}${item}`;
          openKeys.push(openKey);
        });
      }
      return openKeys;
    }
  }
}

export function generateWebHookTestParam(dto, formValue) {
  const { url, urlMappingRelation, webHookTopicDTO } = dto;
  const headers = {};
  if (Array.isArray(dto.headers)) {
    dto.headers.forEach((header) => {
      headers[header.key] = header.value;
    });
  }
  const result = {
    url,
    headers,
    urlMappingRelation: {
      topic: urlMappingRelation.topic,
      address: urlMappingRelation.address,
    },
    webHookTopicDTO,
  };
  if (isPlainObject(formValue)) {
    result.webHookTopicDTO.payload = JSON.stringify(formValue);
  }
  return result;
}

/**
 * @param content {string}
 * @param string
 */
export function renderLabel(content, string = false) {
  if (typeof content !== 'string' || isStrictNull(content)) return null;
  if (content.startsWith('@@')) {
    const i18nKey = content.replace('@@', '');
    if (string) {
      return formatMessage(i18nKey);
    }
    return <FormattedMessage id={i18nKey} />;
  }
  return content;
}
