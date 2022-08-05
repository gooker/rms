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

export default function InputFunction({ name, value, options = {}, onChange }) {
  return (
    <InputComponent
      onChange={(val) => {
        onChange(name, val);
      }}
      value={value}
      params={options}
    />
  );
}
