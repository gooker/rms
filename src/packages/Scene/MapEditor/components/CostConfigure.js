import React, { memo } from 'react';
import { Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';

const CostConfigure = (props) => {
  const { showSelection, value, onChange } = props;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          style={{ background: '#e64a19' }}
          onClick={() => {
            onChange(1000);
          }}
        >
          {showSelection && value === 1000 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
        <Button
          style={{ background: '#ffca28' }}
          onClick={() => {
            onChange(100);
          }}
        >
          {showSelection && value === 100 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button
          style={{ background: '#FFF' }}
          onClick={() => {
            onChange(-1);
          }}
        >
          {showSelection && value === -1 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          style={{ background: '#1976d2' }}
          onClick={() => {
            onChange(20);
          }}
        >
          {showSelection && value === 20 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
        <Button
          style={{ background: '#388e3c' }}
          onClick={() => {
            onChange(10);
          }}
        >
          {showSelection && value === 10 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
      </div>
    </div>
  );
};
export default memo(CostConfigure);
