import React, { PureComponent } from 'react';
import { Input } from 'antd';

class InputComponent extends PureComponent {
  render() {
    const { value } = this.props;
    return (
      <Input
        value={value}
        onChange={(newValue) => {
          const { onChange } = this.props;
          if (onChange) {
            onChange(newValue);
          }
        }}
      />
    );
  }
}

export default function InputFunction({ value, options = {}, onChange }) {
  return (
    <InputComponent
      onChange={(val) => {
        onChange(val);
      }}
      value={value}
      params={options}
    />
  );
}
