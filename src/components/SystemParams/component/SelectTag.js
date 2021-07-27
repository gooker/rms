import React, { PureComponent } from 'react';
import { Select } from 'antd';

class SelectTagComponent extends PureComponent {
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
        mode="tags"
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

export default function SelectTag({value, onChange, options }) {
  return (
    <SelectTagComponent
      value={value}
      onChange={(val) => {
        onChange(val);
      }}
      options={options}
    />
  );
}
