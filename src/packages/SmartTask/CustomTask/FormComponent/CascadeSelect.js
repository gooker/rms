import React, { memo } from 'react';
import { Select } from 'antd';
import { convertMapToArrayMap, isNull } from '@/utils/util';

const { Option } = Select;
const CascadeSelect = (props) => {
  const { data, disabled, value, onChange } = props; // disabled:[true, false]
  const currentValue = { ...value };

  function onTypeChange(_value) {
    currentValue.type = _value;
    currentValue.code = [];
    onChange(currentValue);
  }

  function onCodeChange(_value) {
    currentValue.code = _value;
    onChange(currentValue);
  }

  // 第一个下拉框选项
  let firstSelectOptions = [];
  if (Array.isArray(data)) {
    firstSelectOptions = data.map(({ code, name }) => (
      <Option key={code} value={code}>
        {name}
      </Option>
    ));
  }

  // 第二个下拉框选项
  let secondSelectOptions = [];
  if (!isNull(currentValue?.type)) {
    const targetType = data.find((item) => item.code === currentValue.type);
    if (!isNull(targetType?.value)) {
      secondSelectOptions = convertMapToArrayMap(targetType.value, 'code', 'name');
      secondSelectOptions = secondSelectOptions.map(({ code, name }) => {
        return (
          <Option key={code} value={code}>
            {name}
          </Option>
        );
      });
    }
  }

  return (
    <div>
      <Select
        allowClear
        value={currentValue?.type}
        onChange={onTypeChange}
        disabled={!!disabled?.[0]}
        style={{ width: 150 }}
      >
        {firstSelectOptions}
      </Select>
      <Select
        allowClear
        mode='multiple'
        onChange={onCodeChange}
        value={currentValue?.code || []}
        disabled={!!disabled?.[1]}
        style={{ marginLeft: 10, width: 300 }}
      >
        {secondSelectOptions}
      </Select>
    </div>
  );
};
export default memo(CascadeSelect);
