import React, { memo } from 'react';
import { Switch } from 'antd';

const StatusChoice = memo(function StatusChoice(props) {
  const { status, onChange, title } = props;
  return (
    <div>
      <span>{title && title[1] ? title[1] : '启动'}</span>
      <span style={{ margin: '0px 10px' }}>
        <Switch
          size="small"
          checked={status}
          onChange={value => {
            if (onChange) {
              onChange(value);
            }
          }}
        />
      </span>
      <span>{title && title[0] ? title[0] : '禁用'}</span>
    </div>
  );
});

export default StatusChoice;
