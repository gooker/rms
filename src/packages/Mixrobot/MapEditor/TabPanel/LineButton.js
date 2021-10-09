import React, { Component } from 'react';
import { Button } from 'antd';

export default class LineButton extends Component {
  onChange = (value) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(value);
    }
  };

  render() {
    return (
      <div style={{ display: 'inline-block' }}>
        <div style={{ display: 'flex' }}>
          <Button
            style={{ background: '#e64a19' }}
            onClick={() => {
              this.onChange(1000);
            }}
          >
            {' '}
          </Button>
          <Button
            style={{
              border: 0,
              cursor: 'default',
              borderRadius: 0,
              width: 32,
              background: '#FFF',
            }}
          >
            {' '}
          </Button>
          <Button
            style={{ background: '#ffca28' }}
            onClick={() => {
              this.onChange(100);
            }}
          >
            {' '}
          </Button>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Button
            style={{ background: '#aaaeb1a1' }}
            onClick={() => {
              this.onChange(-1);
            }}
          >
            {' '}
          </Button>
        </div>
        <div style={{ display: 'flex' }}>
          <Button
            style={{ background: '#1976d2' }}
            onClick={() => {
              this.onChange(20);
            }}
          >
            {' '}
          </Button>
          <Button
            style={{
              border: 0,
              cursor: 'default',
              borderRadius: 0,
              width: 32,
              background: '#FFF',
            }}
          >
            {' '}
          </Button>
          <Button
            style={{ background: '#388e3c' }}
            onClick={() => {
              this.onChange(10);
            }}
          >
            {' '}
          </Button>
        </div>
      </div>
    );
  }
}
