import React, { Component } from 'react';
import { Button } from 'antd';
import MenuIcon from '@/utils/MenuIcon';

import FormattedMessage from '@/components/FormattedMessage';

export default class CheckButton extends Component {
  state = { BatchAddCellVisible: false };

  render() {
    const { disabled, onClick } = this.props;
    return (
      <div
        style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
        }}
      >
        {/* 添加 */}
        <Button
          icon={MenuIcon.plus}
          disabled={disabled}
          onClick={() => {
            onClick && onClick('add');
          }}
        >
          {' '}
          <FormattedMessage id="app.cellMap.add" />
        </Button>

        {/* 移除 */}
        <Button
          type="danger"
          disabled={disabled}
          icon={MenuIcon.delete}
          onClick={() => {
            onClick && onClick('remove');
          }}
        >
          {' '}
          <FormattedMessage id="app.cellMap.remove" />
        </Button>
      </div>
    );
  }
}
