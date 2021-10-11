import React, { memo } from 'react';
import { Select } from 'antd';

export default memo(function AgvTypeSelect(props) {
  const { value, children } = props;
  return (
    <div>
      <Select {...props} value={value || []}>
        {children}
      </Select>
    </div>
  );
});
