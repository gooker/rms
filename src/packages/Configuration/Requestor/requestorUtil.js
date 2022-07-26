import React from 'react';
import { Button, Form, Input, InputNumber, Row, Select, Switch, Tooltip } from 'antd';
import { InfoOutlined, PlusOutlined, ReadOutlined } from '@ant-design/icons';
import { isPlainObject } from 'lodash';
import requestAPI from '@/utils/requestAPI';
import { formatMessage, isStrictNull } from '@/utils/util';
import requestorStyles from './requestor.module.less';

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
        <Select allowClear mode='tags' style={{ width: '100%' }} notFoundContent={null} />
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

export function getURL(url) {
  if (!url) return '';
  const dir = requestAPI();
  const array = url.split('/');
  if (array.length < 2) {
    return '';
  }
  if (dir && array[1] != null && dir[array[1]] != null) {
    return `${dir[array[1]]}${url}`;
  }
  return '';
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
                                type='danger'
                                icon={<PlusOutlined />}
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
                          type='dashed'
                          onClick={() => add()}
                          icon={<PlusOutlined />}
                          style={{ width: '50%' }}
                        >
                          {formatMessage({ id: 'app.workStationMap.add' })}
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
          label={formatMessage({ id: 'app.requestor.form.body' })}
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
