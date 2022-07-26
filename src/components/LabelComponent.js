import React from 'react';

const LabelComponent = (props) => {
  const {
    layout = 'row', // column
    label,
    labelColor = '#ffffff',
    labelWeight = 600,
    contentColor = '#ffffff',
  } = props;

  const bodyStyle = { ...props.bodyStyle, width: '100%' };
  return (
    <div
      style={{
        display: 'flex',
        flexFlow: `${layout} nowrap`,
        marginBottom: 8,
        ...bodyStyle,
      }}
    >
      <div
        style={{
          color: labelColor,
          fontWeight: labelWeight,
          marginRight: layout === 'row' ? '10px' : 0,
          marginBottom: layout !== 'row' ? '3px' : 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        {label}:
      </div>
      <div style={{ flex: 1, color: contentColor }}>{props.children}</div>
    </div>
  );
};
export default LabelComponent;
