import React, { Component } from 'react';
import { Input } from 'antd';

class PassWordComponent extends Component {
  render() {
    const { value } = this.props;
    return (
      <Input.Password
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

export default function FormPassword({ name, value, options = {}, onChange }) {
  return (
    <PassWordComponent
      onChange={(val) => {
        onChange(name, val);
      }}
      value={value}
      params={options}
    />
  );
}
