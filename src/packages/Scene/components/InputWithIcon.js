import React, { memo, useState } from 'react';
import { Row, Input, Button, Col, InputNumber } from 'antd';
import MenuIcon from '@/utils/MenuIcon';
import { PlusOutlined } from '@ant-design/icons';

export default memo(function MapInput(props) {
  const { currentCellId, icon, btnDisabled = false, type = 'string' } = props;

  const [value, setValue] = useState(props.value);

  return (
    <Row type="flex" gutter={10}>
      <Col span={icon ? 18 : 21}>
        {type === 'string' ? (
          <Input
            style={{ width: '100%' }}
            {...props}
            onChange={({ target }) => {
              setValue(target.value);
            }}
            value={value}
            onBlur={() => {
              props.onChange(value);
            }}
          />
        ) : (
          <InputNumber
            style={{ width: '100%' }}
            {...props}
            onChange={({ target }) => {
              setValue(target.value);
            }}
            value={value}
            onBlur={() => {
              props.onChange(value);
            }}
          />
        )}
      </Col>
      {icon ? (
        <Col span={3} style={{ textAlign: 'center' }}>
          {icon}
        </Col>
      ) : null}
      <Col span={3}>
        {currentCellId ? (
          <Button
            onClick={() => {
              setValue(currentCellId[0]);
              props.onChange(currentCellId[0]);
            }}
            icon={<PlusOutlined />}
            disabled={currentCellId.length === 0 || btnDisabled}
          />
        ) : null}
      </Col>
    </Row>
  );
});
