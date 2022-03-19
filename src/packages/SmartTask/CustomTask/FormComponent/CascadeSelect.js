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
  let firstSelecOptions = [];
  if (Array.isArray(data)) {
    firstSelecOptions = data.map(({ code, name }) => (
      <Option key={code} value={code}>
        {name}
      </Option>
    ));
  }

  // 第二个下拉框选项
  let secondSelecOptions = [];
  if (!isNull(currentValue?.type)) {
    const targetType = data.find((item) => item.code === currentValue.type);
    if (!isNull(targetType?.value)) {
      secondSelecOptions = convertMapToArrayMap(targetType.value, 'code', 'name');
      secondSelecOptions = secondSelecOptions.map(({ code, name }) => {
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
        disabled={!!disabled?.[0]}
        style={{ width: 150 }}
        value={currentValue?.type}
        onChange={onTypeChange}
        allowClear
      >
        {firstSelecOptions}
      </Select>
      <Select
        mode="multiple"
        disabled={!!disabled?.[1]}
        onChange={onCodeChange}
        value={currentValue?.code || []}
        style={{ marginLeft: 10, width: 300 }}
      >
        {secondSelecOptions}
      </Select>
    </div>
  );
};
export default memo(CascadeSelect);
