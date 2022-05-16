import React from 'react';
import { Select, Input, Switch, InputNumber, Checkbox, Radio } from 'antd';
export const renderFormItemContent = (content) => {
  const { type, options, isisabled } = content;

  if (type === 'ARRAY') {
    return <Select mode="tags" options={options} maxTagCount={4} />;
  }

  if (type === 'BOOL') {
    return <Switch />;
  }
  if (type === 'STRING' || type === 'INTEGER') {
    return <Input disabled={!!isisabled} />;
  }

  if (type === 'NUMBER') {
    return <InputNumber min={1} />;
  }

  if (type === 'select') {
    return <Select options={options} />;
  }
  if (type === 'checkbox') {
    if (options.length === 0) {
      return <Checkbox />;
    }
    return <Checkbox.Group options={options} />;
  }
  if (type === 'radio') {
    return <Radio.Group options={options} />;
  }
};
