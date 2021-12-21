import React, { memo, useState, useEffect } from 'react';
import { Select, Row, Col, Checkbox } from 'antd';
import sortBy from 'lodash/sortBy';
import flatten from 'lodash/flatten';
import isPlainObject from 'lodash/isPlainObject';
import { convertMapToArrayMap, isNull,formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';


const { Option } = Select;

/**
 * @param {*} include 目标 Model
 * @param {*} exclude 不需要的 Model
 * @param {*} modelTypes Model元数据
 * @param {*} agvList 小车列表
 */
const ModelSelection = (props) => {
  const { value, onChange } = props; // form
  const { specify, disabled, include, exclude, modelTypes } = props; //
  const currentValue = { ...value };

  const [isSpecify, specifySetter] = useState(!specify);

  useEffect(() => {
    specifySetter(value && !isNull(value.code) && !isNull(value.type));
  }, []);

  function setSpecify(flag) {
    specifySetter(flag);
    if (!flag) {
      onChange({});
    }
  }

  function onTypeChange(_value) {
    currentValue.type = _value;
    currentValue.code = [];
    onChange(currentValue);
  }

  function onCodeChange(_value) {
    // 合并数组并去重
    const agvIds = flatten(_value);
    currentValue.code = [...new Set(agvIds)];
    onChange(currentValue);
  }

  function renderCodeForm(selectDisabled) {
    if (!value || !value?.type) {
      return <Select disabled={selectDisabled} notFoundContent={null} />;
    }

    const { options } = modelTypes[value.type];
    if (options && isPlainObject(options)) {
      const selectOptions = convertMapToArrayMap(options, 'code', 'label');
      return (
        <Select
          allowClear
          mode="multiple"
          notFoundContent={null}
          onChange={onCodeChange}
          value={value.code || []}
          disabled={selectDisabled}
        >
          {selectOptions.map((item) => (
            <Option key={item.code} value={item.code}>
              {item.label}
            </Option>
          ))}
        </Select>
      );
    }
    return (
      <Select
        allowClear
        mode="tags"
        notFoundContent={null}
        value={value.code || []}
        onChange={onCodeChange}
        disabled={selectDisabled}
      />
    );
  }

  /**
   * 确定第一个下拉框需要显示的项
   * 1. include 存在就显示相关项, 不存在就显示所有
   * 2. exclude 为不显示项
   * 3. include 与 exclude 互斥, 组件属性同时只会存在一种或没有
   */
  function getTypeOptions() {
    let modelTypeList = convertMapToArrayMap(modelTypes, 'code', 'payload');
    modelTypeList = modelTypeList.map((item) => ({
      type: item.code,
      name: item.payload.name,
    }));
    let typeOptions = [];
    if (Array.isArray(include)) {
      modelTypeList.forEach((item) => {
        if (include.includes(item.type)) {
          typeOptions.push(item);
        }
      });
    } else if (Array.isArray(exclude)) {
      modelTypeList.forEach((item) => {
        if (!exclude.includes(item.type)) {
          typeOptions.push(item);
        }
      });
    } else {
      typeOptions = modelTypeList;
    }
    return sortBy(typeOptions, ['name']);
  }

  const typeOptions = getTypeOptions() || [];
  // 下拉框是否禁用，disabled 属性优先级最高
  const selectDisabled = disabled === undefined ? !isSpecify : disabled;
  return (
    <Row>
      {/* type */}
      <Col>
        <Select
          allowClear
          value={value?.type}
          onChange={onTypeChange}
          style={{ width: 150 }}
          disabled={selectDisabled}
        >
          {typeOptions.map(({ type, name }) => (
            <Option key={type} value={type}>
              {name}
            </Option>
          ))}
        </Select>
      </Col>

      {/* code */}
      <Col style={{ marginLeft: 10, width: 300 }}>{renderCodeForm(selectDisabled)}</Col>
      {specify ? (
        <Col style={{ marginLeft: 10, display: 'flex', alignItems: 'center' }}>
          <Checkbox checked={isSpecify} onChange={(ev) => setSpecify(ev.target.checked)} />
          <span style={{ marginLeft: 5 }}>
            <FormattedMessage id="app.customTask.form.specify" />
          </span>
        </Col>
      ) : null}
    </Row>
  );
};
export default memo(ModelSelection);
