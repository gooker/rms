import React, { PureComponent } from 'react';
import { Select } from 'antd';

class FormMultiSelect extends PureComponent {
  render() {
    const { options = [] } = this.props;
    return (
      <Select
        onChange={(value) => {
          const { onChange } = this.props;
          if (onChange) {
            onChange(value);
          }
        }}
        value={this.props.value}
        mode='tags'
      >
        {options.map((record) => (
          <Select.Option key={record.value} value={record.value}>
            {record.label}
          </Select.Option>
        ))}
      </Select>
    );
  }
}

export default function SelectTag({ name, value, onChange, options }) {
  return (
    <FormMultiSelect
      value={value}
      onChange={(val) => {
        onChange(name, val);
      }}
      options={options}
    />
  );
}
