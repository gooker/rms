import React, { memo } from 'react';
import { Button } from 'antd';

const CostConfigure = (props) => {
  const { onChange } = props;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          style={{ background: '#e64a19' }}
          onClick={() => {
            onChange(1000);
          }}
        >
          {' '}
        </Button>
        <Button
          style={{ background: '#ffca28' }}
          onClick={() => {
            onChange(100);
          }}
        >
          {' '}
        </Button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button
          style={{ background: '#FFF' }}
          onClick={() => {
            onChange(-1);
          }}
        >
          {' '}
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          style={{ background: '#1976d2' }}
          onClick={() => {
            onChange(20);
          }}
        >
          {' '}
        </Button>
        <Button
          style={{ background: '#388e3c' }}
          onClick={() => {
            onChange(10);
          }}
        >
          {' '}
        </Button>
      </div>
    </div>
  );
};
export default memo(CostConfigure);
