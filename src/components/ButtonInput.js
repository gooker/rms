import React from 'react';
import { Button, Input, InputNumber, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

/**
 * multi 是 true 的时候是 Select
 * multi 是 false:
 *  - type 是 string 时候是文字输入框
 *  - type 是 number 时候是数字输入框
 */
export default class ButtonInput extends React.PureComponent {
  render() {
    const {
      value,
      onChange,
      valueChange,
      data,
      onClick,

      maxTagCount = 4,
      multi = false,
      type = 'string',
      disabled = false,
      btnDisabled = false,
    } = this.props;
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1 }}>
          {multi ? (
            <Select
              allowClear
              mode='tags'
              maxTagCount={maxTagCount}
              value={value}
              disabled={disabled}
              onChange={(values) => {
                onChange(values);
                valueChange && valueChange(values);
              }}
              notFoundContent={null}
            />
          ) : type === 'number' ? (
            <InputNumber
              allowClear
              value={value}
              disabled={disabled}
              onChange={onChange}
              style={{ width: '100%' }}
            />
          ) : (
            <Input
              allowClear
              value={value}
              disabled={disabled}
              onChange={(ev) => onChange(ev.target.value)}
              style={{ width: '100%' }}
            />
          )}
        </div>
        <Button
          style={{ marginLeft: 5 }}
          icon={<PlusOutlined />}
          disabled={btnDisabled}
          onClick={() => {
            onChange(data);
            onClick && onClick(data);
          }}
        />
      </div>
    );
  }
}
