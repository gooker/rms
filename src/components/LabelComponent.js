import React from 'react';

const LabelComponent = (props) => {
  const { label, children, width = '100%' } = props;
  return (
    <div style={{ width, display: 'flex', marginBottom: 8 }}>
      <span style={{ display: 'flex', alignItems: 'center' }}>{label}:</span>
      <div style={{ flex: 1, marginLeft: 10 }}>{children}</div>
    </div>
  );
};
export default LabelComponent;
