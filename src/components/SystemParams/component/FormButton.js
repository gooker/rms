import React, { memo } from 'react';
import { Button } from 'antd';

const FormButtonComponent = memo(({ value }) => {
  return <Button onClick={() => {}}>{value}</Button>;
});

export default function FormButton({ value, options = {} }) {
  return <FormButtonComponent value={value} params={options} />;
}
