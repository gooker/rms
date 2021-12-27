import React, { Component } from 'react';
import { Button } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import FormattedMessage from '@/components/FormattedMessage';

class CheckButton extends Component {
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
          disabled={disabled}
          onClick={() => {
            onClick && onClick('add');
          }}
        >
          <PlusOutlined /> <FormattedMessage id="app.cellMap.add" />
        </Button>

        {/* 移除 */}
        <Button
          type="danger"
          disabled={disabled}
          onClick={() => {
            onClick && onClick('remove');
          }}
        >
          <DeleteOutlined /> <FormattedMessage id="app.cellMap.remove" />
        </Button>
      </div>
    );
  }
}
export default CheckButton;
