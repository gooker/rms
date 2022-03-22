import React from 'react';
import { isNull } from '@/utils/util';

// 难用死了，要重构或者直接删除
const LabelComponent = (props) => {
  const {
    label,
    children,
    style,
    layout = 'row', // column
    width = '100%',
    color = '#e8e8e8', // label颜色
    weight = 600,
  } = props;
  return (
    <div
      style={{
        width,
        display: 'flex',
        flexFlow: `${layout} nowrap`,
        marginBottom: 8,
        ...style,
      }}
    >
      <div
        style={{
          color,
          fontWeight: weight,
          marginRight: layout === 'row' ? '10px' : 0,
          marginBottom: layout !== 'row' ? '3px' : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {label}:
      </div>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};
export default LabelComponent;
