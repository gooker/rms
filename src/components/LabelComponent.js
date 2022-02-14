import React from 'react';

const LabelComponent = (props) => {
  const {
    label,
    children,
    layout = 'row',
    width = '100%',
    color = '#e8e8e8',
    weight = 600,
  } = props;
  return (
    <div style={{ width, display: 'flex', flexFlow: `${layout} nowrap`, marginBottom: 8 }}>
      <span
        style={{
          color,
          fontWeight: weight,
          marginRight: layout === 'row' ? '10px' : 0,
          marginBottom: layout !== 'row' ? '3px' : 0,
        }}
      >
        {label}:
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
};
export default LabelComponent;
