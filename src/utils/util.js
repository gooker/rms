import React from 'react';
import { Tooltip, Row, Button, Input, message, Form, Tag, InputNumber, Select, Switch } from 'antd';
import { isPlainObject, find, isEqual as deepEqual } from 'lodash';
import { InfoOutlined, ReadOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment-timezone';
import intl from 'react-intl-universal';
import requestAPI from '@/utils/requestAPI';
import Dictionary from '@/utils/Dictionary';
import MenuIcon from '@/utils/MenuIcon';
import { AgvStateColor, Colors, ToteOffset, ModelTypeFieldMap } from '@/config/consts';
import requestorStyles from '@/packages/XIHE/Requestor/requestor.less';
import FormattedMessage from '@/components/FormattedMessage';
import Loadable from '@/components/Loadable';

/**
 * @废弃
 * 将服务器的时间和服务器返回的时区转回成用户时区的时间格式
 * @param {*} value
 * @returns
 */
export function GMT2UserTimeZone(value) {
  if (isStrictNull(value)) {
    return { format: () => '' };
  }

  // 服务器所在地方时区
  let serverTimeZone = window.localStorage.getItem('serverTimeZone');
  serverTimeZone = serverTimeZone || 'GMT';
  moment.tz.setDefault(serverTimeZone);

  // 获取当前时区偏移量
  let date;
  const userTimeZone = window.localStorage.getItem('userTimeZone');
  if (userTimeZone != null) {
    date = new moment(value).tz(userTimeZone);
  } else {
    date = new moment(value).tz(moment.tz.guess());
  }
  return date;
}

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

export function isEmptyPlainObject(obj) {
  return isPlainObject(obj) && Object.keys(obj).length === 0;
}

export function isEmptyArray(arr) {
  return Array.isArray(arr) && arr.length === 0;
}

export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function isItemOfArray(baseArray, array) {
  let result = false;
  for (let index = 0; index < array.length; index++) {
    const element = array[index];
    if (baseArray.includes(element)) {
      result = true;
      break;
    }
  }
  return result;
}

export function formatMessage({ id }, values) {
  if (id) {
    const content = intl.get(id, values);
    return content || id;
  }
  return '###';
}

export const htmlFormatMessage = ({ id }, values) => {
  if (id) {
    const content = intl.getHTML(id, values);
    return content || id;
  }
  return '###';
};

export function getDomainNameByUrl(url) {
  // TODO: 这里可以处理LocalStorage里配置的SSO
  let apis = JSON.parse(window.sessionStorage.getItem('nameSpacesInfo'));
  if (isStrictNull(apis) || !isPlainObject(apis)) {
    apis = requestAPI();
  }
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

export function dealResponse(response, successNotify, successMessage, failedMessage) {
  // 如果后台发错误，那么response对象就会是标准的后台返回对象, {code:'-1', data:***, message:****}
  if (Array.isArray(response)) {
    let failed = false;
    for (let i = 0; i < response.length; i++) {
      if (response[i] && isStandardApiResponse(response[i])) {
        failed = true;
        break;
      }
    }
    if (failed) {
      message.error(formatMessage({ id: 'app.request.concurrent.failed' }));
      return true;
    }
  } else {
    if (response && isStandardApiResponse(response)) {
      const { message: errorMessage } = response;
      const defaultMessage = formatMessage({ id: 'app.message.operateFailed' });
      message.error(failedMessage || errorMessage || defaultMessage);
      return true;
    }
  }

  // 正常请求后返回false, 表示当前请求无错误
  if (successNotify) {
    message.success(successMessage || formatMessage({ id: 'app.message.operateSuccess' }));
  }
  return false;
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

export function renderAgvState(state) {
  if (!isStrictNull(state)) {
    return (
      <Tag color={AgvStateColor[state]}>
        <FormattedMessage id={`app.agvState.${state}`} />
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

export function isNull(value) {
  return value === null || value === undefined;
}

export function isStrictNull(value) {
  return isNull(value) || value === '';
}

export function getContentHeight() {
  const layoutContentDOM = document.getElementById('layoutContent');
  return layoutContentDOM.getBoundingClientRect().height;
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
export function getAgvStatusTag(agvStatus) {
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

export function getDirByAngle(angle) {
  if (angle > 315 || angle <= 45) return '0';
  if (angle > 45 && angle <= 135) return '1';
  if (angle > 135 && angle <= 225) return '2';
  if (angle > 225 && angle <= 315) return '3';
}

/**
 * 将角度数据转化为方向数据
 * @param {*} angle
 * @returns
 */
export function covertAngle2Direction(angle) {
  let direction;
  switch (true) {
    case (angle >= 0 && angle < 90) || angle === 360:
      direction = 0;
      break;
    case angle >= 90 && angle < 180:
      direction = 1;
      break;
    case angle >= 180 && angle < 270:
      direction = 2;
      break;
    case angle >= 270 && angle < 360:
      direction = 3;
      break;
    default:
  }
  return direction;
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

// ************************************** Requestor页面相关  ************************************** //
const PlaceHolderTestRegex = /{{[a-zA-Z]+}}/;
const PlaceHolderExtractRegex = /{{(\w+)}}/;
const formLayout = { labelCol: { span: 3 }, wrapperCol: { span: 15 } };
const tailFormLayout = { wrapperCol: { offset: 3, span: 15 } };

// 判断是否是占位符
export function isFieldPlaceholder(placeholder) {
  return PlaceHolderTestRegex.test(placeholder);
}

// 根据占位符信息拿组件[componentObject, ComponentIntialValue, ComponentType]
export function getComponentByPlaceholder(placeholder) {
  const fieldType = placeholder.match(PlaceHolderExtractRegex)
    ? placeholder.match(PlaceHolderExtractRegex)[1]
    : null;
  return [...switchComponent(fieldType), fieldType];
}

// 根据值类型拿组件
export function getComponentByFieldValue(fieldValue) {
  let type = typeof fieldValue;
  if (type === 'object') {
    if (Array.isArray(fieldValue)) {
      type = 'list';
    }
  }
  return switchComponent(type);
}

function switchComponent(fieldType) {
  let component;
  let value = null;
  switch (fieldType) {
    case 'number':
      component = <InputNumber />;
      break;
    case 'list':
      component = (
        <Select allowClear mode="tags" style={{ width: '100%' }} notFoundContent={null} />
      );
      value = [];
      break;
    case 'boolean':
      component = <Switch />;
      value = false;
      break;
    default:
      // 包括 'string' 和 非数组'object'
      component = <Input />;
      break;
  }
  return [component, value];
}

// 渲染已选接口的参数配置表单
const fieldTipStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
};
const getFormListItemTooltip = (comment, fieldKey) => {
  const result = [];
  Object.keys(comment).forEach((key) => {
    if (key.startsWith(`${fieldKey}-`)) {
      result.push({ key: key.replace(`${fieldKey}-`, ''), value: comment[key] });
    }
  });

  return (
    <ul style={{ padding: 0, listStyle: 'none' }}>
      {result.map(({ key, value }, index) => (
        <li key={index}>{`${key}:  ${value}`}</li>
      ))}
    </ul>
  );
};

export function getRequestorURLParams(url) {
  if (isStrictNull(url)) return [];
  let urlParams = url.match(/{{(\w+)}}/g);
  if (urlParams) {
    urlParams = urlParams.map((item) => item.match(PlaceHolderExtractRegex)[1]);
    return urlParams;
  }
  return [];
}

/**
 * Requestor页面显示请求体
 * @param {*} dataSource
 * @param {*} formRef
 * @param {*} isHook
 * @param {*} option
 * @returns
 */
export function renderRequestBodyForm(dataSource, formRef, isHook = false, option = {}) {
  if (!dataSource) return null;

  const { url, body, comment } = dataSource;
  if (isStrictNull(body)) return;
  const bodyJson = JSON.parse(body);

  // 处理URL参数
  const urlParamFormItem = getRequestorURLParams(url).map((item) => (
    <Form.Item key={`url_path_${item}`} label={item}>
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          <Form.Item noStyle name={item}>
            <Input />
          </Form.Item>
        </div>
        <div style={fieldTipStyle}>
          <Tooltip title={comment[item]}>
            <InfoOutlined />
          </Tooltip>
        </div>
      </div>
    </Form.Item>
  ));

  /**
   * 针对 JSON 形式的请求体
   * 但有可能有一层嵌套，即 value 是一个数组且只能是数组
   */
  if (isPlainObject(bodyJson)) {
    const layout = option.formLayout || formLayout;
    return (
      <Form
        {...layout}
        {...(isHook ? { form: formRef } : { ref: formRef })}
        layout={option.layout || 'horizontal'}
      >
        {/* 处理请求体参数 */}
        {Object.keys(bodyJson).map((field, index) => {
          const value = bodyJson[field];
          const valueType = typeof value;

          if (valueType === 'object') {
            // 处理嵌套数组, 并且数组的本质只是渲染表单的元数据
            if (Array.isArray(value) && value.length > 0) {
              return (
                <Form.List name={field} key={`${field}-list-${index}`} initialValue={[{}]}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map(({ key, name, fieldKey, ...restField }, fieldsIndex) => (
                        <Form.Item
                          key={`${field}-sub-${fieldsIndex}`}
                          required={false}
                          label={fieldsIndex === 0 ? field : ''}
                          {...(fieldsIndex === 0 ? layout : tailFormLayout)}
                        >
                          <div
                            key={`${field}-${fieldsIndex}-remove`}
                            style={{
                              padding: '10px',
                              borderRadius: '5px',
                              marginBottom: '20px',
                              border: '1px solid #e0dcdc',
                            }}
                          >
                            {/* 删除表单项 */}
                            <Row type={'flex'} justify={'end'} style={{ marginBottom: 10 }}>
                              <Button
                                type="danger"
                                icon={MenuIcon.delete}
                                onClick={() => remove(name)}
                              />
                            </Row>
                            <div style={{ width: '100%', display: 'flex' }}>
                              <div style={{ flex: 1 }}>
                                {
                                  // 所以渲染只需要取第一个就行
                                  (() => {
                                    const nestedItemKeys = Object.keys(value[0]);
                                    return nestedItemKeys.map((nestedItemKey) => {
                                      const nestedItemValue = value[0][nestedItemKey];
                                      const [comp, compValue, componentType] =
                                        getComponentByPlaceholder(nestedItemValue);
                                      return (
                                        <Form.Item
                                          key={`${field}-${nestedItemKey}`}
                                          {...layout}
                                          {...restField}
                                          name={[name, nestedItemKey]}
                                          fieldKey={[fieldKey, nestedItemKey]}
                                          label={nestedItemKey}
                                          valuePropName={
                                            componentType === 'boolean' ? 'checked' : 'value'
                                          }
                                          initialValue={compValue}
                                        >
                                          {comp}
                                        </Form.Item>
                                      );
                                    });
                                  })()
                                }
                              </div>
                              <div className={requestorStyles.formListTooltip}>
                                <Tooltip title={getFormListItemTooltip(comment, field)}>
                                  <ReadOutlined />
                                </Tooltip>
                              </div>
                            </div>
                          </div>
                        </Form.Item>
                      ))}
                      {/* 新增表单项 */}
                      <Form.Item {...tailFormLayout}>
                        <Button
                          block
                          type="dashed"
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          style={{ width: '50%' }}
                        >
                          {intl.formatMessage({ id: 'app.workStationMap.add' })}
                        </Button>
                      </Form.Item>
                    </>
                  )}
                </Form.List>
              );
            }
          } else {
            // 包含占位符
            const isPlaceholder = isFieldPlaceholder(value);
            if (isPlaceholder) {
              const [comp, compValue, componentType] = getComponentByPlaceholder(value);
              return (
                <Form.Item key={index} label={field}>
                  <div style={{ display: 'flex' }}>
                    <div style={{ flex: 1 }}>
                      <Form.Item
                        noStyle
                        name={field}
                        valuePropName={componentType === 'boolean' ? 'checked' : 'value'}
                        initialValue={compValue}
                      >
                        {comp}
                      </Form.Item>
                    </div>
                    <div style={fieldTipStyle}>
                      <Tooltip title={comment[field]}>
                        <InfoOutlined />
                      </Tooltip>
                    </div>
                  </div>
                </Form.Item>
              );
            }

            // 没有占位符
            const [comp, compValue] = getComponentByFieldValue(value);
            return (
              <Form.Item key={index} label={field}>
                <div style={{ display: 'flex' }}>
                  <div style={{ flex: 1 }}>
                    <Form.Item noStyle name={field} initialValue={value ?? compValue}>
                      {comp}
                    </Form.Item>
                  </div>
                  <div style={fieldTipStyle}>
                    <Tooltip title={comment[field]}>
                      <InfoOutlined />
                    </Tooltip>
                  </div>
                </div>
              </Form.Item>
            );
          }
        })}

        {/* 处理URL参数 */}
        {urlParamFormItem}
      </Form>
    );
  }

  // 针对 数组 形式的请求体
  if (Array.isArray(bodyJson)) {
    const layout = option.formLayout || formLayout;
    const [comp, compValue] = getComponentByFieldValue(bodyJson);
    return (
      <Form {...layout} {...(isHook ? { form: formRef } : { ref: formRef })}>
        <Form.Item
          label={intl.formatMessage({ id: 'app.requestor.form.body' })}
          name={'placeholder'}
          initialValue={compValue}
        >
          {comp}
        </Form.Item>

        {/* 处理URL参数 */}
        {urlParamFormItem}
      </Form>
    );
  }
}

export function getToteLayoutBaseParam(agvDirection, side) {
  let angle;
  let XBase;
  let YBase;
  let offset;
  let adapte; // adapte: 用于判断料箱在哪个方向进行距离调整, 非offset
  switch (agvDirection) {
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

export function getURLSearchParam(key) {
  const vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m, key, value) => {
    vars[key] = value;
  });
  return vars[key];
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

/***** 报表中心  ****/
export function countDay(params) {
  if (params.endDate != null && params.startDate != null) {
    return {
      ...params,
      endDate: GMT2UserTimeZone(params.endDate).format('YYYY-MM-DD HH:mm:ss'),
      startDate: GMT2UserTimeZone(params.startDate).format('YYYY-MM-DD HH:mm:ss'),
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
      endDate: GMT2UserTimeZone(params.endDate).format('YYYY-MM-DD HH:mm:ss'),
      startDate: GMT2UserTimeZone(params.startDate).format('YYYY-MM-DD HH:mm:ss'),
    };
  }
  return { ...params };
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

export function getRandomString(length) {
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

  const randomString = [];
  for (let index = 0; index < length; index++) {
    randomString.push(randomStringSeed[Math.floor(Math.random() * randomStringSeed.length)]);
  }

  return randomString.join('');
}

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

// 将后台返回的自定义任务数据转化为表单数据
export function restoreCustomTaskForm(customTask, customTypes) {
  const result = { taskSteps: [], fieldsValue: {} };
  const { codes } = customTask;

  // 提取基本信息
  result.fieldsValue.name = customTask.name;
  result.fieldsValue.desc = customTask.desc;
  result.fieldsValue.priority = customTask.priority;
  result.fieldsValue.robot = customTask.robot;

  codes.forEach((code) => {
    const customTypeKey = code.split('_')[0];
    const customType = find(customTypes, { type: customTypeKey });
    result.taskSteps.push({ ...customType, code });

    // 收集表单数据
    if (['START', 'END'].includes(customTypeKey)) {
      result.fieldsValue[code] = customTask[ModelTypeFieldMap[customTypeKey]];
    } else {
      const stepPayload = customTask[ModelTypeFieldMap[customTypeKey]];
      const subTaskConfig = stepPayload[code];
      if (subTaskConfig.customType === 'ACTION') {
        subTaskConfig.trayActionProtocol = {
          upAction: subTaskConfig.upAction,
          downAction: subTaskConfig.downAction,
        };
        delete subTaskConfig.upAction;
        delete subTaskConfig.downAction;
      }
      result.fieldsValue[code] = subTaskConfig;
    }
  });
  return result;
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
    isWindowsPhone = /(?:Windows Phone)/.test(ua),
    isSymbian = /(?:SymbianOS)/.test(ua) || isWindowsPhone,
    isAndroid = /(?:Android)/.test(ua),
    isFireFox = /(?:Firefox)/.test(ua),
    isChrome = /(?:Chrome|CriOS)/.test(ua),
    isTablet =
      /(?:iPad|PlayBook)/.test(ua) ||
      (isAndroid && !/(?:Mobile)/.test(ua)) ||
      (isFireFox && /(?:Tablet)/.test(ua)),
    isPhone = /(?:iPhone)/.test(ua) && !isTablet,
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
  currentModuleRouter.forEach(({ path, component, routes }) => {
    if (Array.isArray(routes)) {
      flatMenuData(routes, result);
    } else {
      result.push({
        path,
        component,
        $$component: Loadable(() => import(`@/packages${component}`)),
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
