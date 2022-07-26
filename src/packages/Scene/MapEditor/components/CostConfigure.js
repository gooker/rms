import React, { memo } from 'react';
import { Button } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { CostColor } from '@/config/consts';

const CostConfigure = (props) => {
  const { showSelection, value, onChange } = props;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          style={{ background: CostColor['1000'].replace('0x', '#') }}
          onClick={() => {
            onChange(1000);
          }}
        >
          {showSelection && value === 1000 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
        <Button
          style={{ background: CostColor['100'].replace('0x', '#') }}
          onClick={() => {
            onChange(100);
          }}
        >
          {showSelection && value === 100 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
      </div>
      <div style={{ textAlign: 'center' }}>
        <Button
          style={{ background: '#FFFFFF' }}
          onClick={() => {
            onChange(-1);
          }}
        >
          {showSelection && value === -1 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button
          style={{ background: CostColor['20'].replace('0x', '#') }}
          onClick={() => {
            onChange(20);
          }}
        >
          {showSelection && value === 20 ? <CheckOutlined style={{ color: '#000000' }} /> : ' '}
        </Button>
        <Button
          style={{ background: CostColor['10'].replace('0x', '#') }}
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
