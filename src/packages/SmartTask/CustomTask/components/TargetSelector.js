import React, { memo } from 'react';
import { Col, Row, Select } from 'antd';
import { VehicleOptionType } from './VehicleSelector';
import { isNull, isStrictNull, isSubArray } from '@/utils/util';

const TargetSelector = (props) => {
  const { value, onChange } = props;
  const { dataSource, limit, form, vehiclePathName, width = 640 } = props;
  const currentValue = value || { type: null, code: [] }; // {type:xxx, code:[]}

  // 兼容处理vehicleSelection
  let vehicleSelection = props.vehicleSelection;
  if (!isNull(form) && !isNull(vehiclePathName)) {
    vehicleSelection = form.getFieldsValue(vehiclePathName);
  }

  // 为了便于取值，这里将目标点类型与相对应数据做个Mapping
  const dataSourceMap = {};
  if (Array.isArray(dataSource)) {
    dataSource.forEach(({ key, customTaskDTOS }) => {
      dataSourceMap[key] = customTaskDTOS;
    });
  }

  function onTypeChange(_value) {
    currentValue.type = _value;
    currentValue.code = [];
    onChange({ ...currentValue });
  }

  function onCodeChange(_value) {
    currentValue.code = _value ?? [];
    onChange({ ...currentValue });
  }

  // 第二个下拉框选项
  function renderSecondaryOptions() {
    if (currentValue.type) {
      // 如果选择的载具, 则需要与对应的车型进行筛选
      let isAuto =
        vehicleSelection.type === VehicleOptionType.VEHICLE && vehicleSelection.code.length === 0;
      isAuto = isAuto || vehicleSelection.type === VehicleOptionType.AUTO;
      if (['LOAD', 'LOAD_GROUP'].includes(currentValue.type) && !isAuto) {
        // 获取分车所支持的所有的载具类型
        let validLoadTypes = [];
        if (
          vehicleSelection.type === VehicleOptionType.VEHICLE &&
          vehicleSelection.code.length > 0
        ) {
          const vehicleType = dataSourceMap.VEHICLE?.filter((item) =>
            item.ids.includes(vehicleSelection.code[0]),
          );
          validLoadTypes = validLoadTypes.concat(vehicleType[0]?.types || []);
        }
        if (
          vehicleSelection.type === VehicleOptionType.VEHICLE_GROUP &&
          vehicleSelection.code.length > 0
        ) {
          if (Array.isArray(dataSourceMap.Vehicle_GROUP)) {
            for (const item of dataSourceMap.Vehicle_GROUP) {
              if (vehicleSelection.code.includes(item.code)) {
                validLoadTypes.push(...(item.types ?? []));
              }
            }
          }
        }

        // 生成返回值
        if (currentValue.type === 'LOAD') {
          return validLoadTypes.map((loadType) => (
            <Select.Option key={loadType} value={loadType}>
              {loadType}
            </Select.Option>
          ));
        } else {
          // 对 dataSource的LOAD_GROUP进行筛选，LOAD_GROUP所有数据的types必须为validLoadTypes的子集
          const loadGroup = dataSourceMap.LOAD_GROUP?.filter((item) =>
            isSubArray(item.types, validLoadTypes),
          );
          return loadGroup.map(({ name, code }) => (
            <Select.Option key={code} value={code}>
              {name}
            </Select.Option>
          ));
        }
      }
      if (currentValue.type.endsWith('_GROUP')) {
        return dataSourceMap[currentValue.type]?.map(({ name, code }) => (
          <Select.Option key={name} value={code}>
            {name}
          </Select.Option>
        ));
      }
      return dataSourceMap[currentValue.type]?.map(({ name, ids }, index) => {
        return (
          <Select.OptGroup key={index} label={name}>
            {Array.isArray(ids) &&
              ids.map((item) => (
                <Select.Option key={item} value={item}>
                  {item}
                </Select.Option>
              ))}
          </Select.OptGroup>
        );
      });
    }
    return [];
  }

  function renderSelectOptions() {
    let data = [];
    if (Array.isArray(dataSource)) {
      data = dataSource.map(({ key: value, label }) => ({ label, value }));
    }
    if (!isStrictNull(limit)) {
      let _limit = limit;
      if (_limit.endsWith('_GROUP')) {
        _limit = _limit.replace('_GROUP', '');
      }
      data = data.filter((item) => item.value.startsWith(_limit));
    }
    return data.map(({ value, label }) => (
      <Select.Option key={value} value={value}>
        {label}
      </Select.Option>
    ));
  }

  return (
    <Row gutter={16}>
      <Col>
        <Select value={currentValue?.type} onChange={onTypeChange} style={{ width: 160 }}>
          {renderSelectOptions()}
        </Select>
      </Col>
      <Col flex={1}>
        {['CELL', 'ROTATE'].includes(currentValue.type) ? (
          <Select
            allowClear
            mode='tags'
            value={currentValue?.code || []}
            onChange={onCodeChange}
            style={{ width }}
            notFoundContent={null}
          />
        ) : (
          <Select
            allowClear
            mode='multiple'
            value={currentValue?.code || []}
            onChange={onCodeChange}
            style={{ width }}
          >
            {renderSecondaryOptions()}
          </Select>
        )}
      </Col>
    </Row>
  );
};
export default memo(TargetSelector);
