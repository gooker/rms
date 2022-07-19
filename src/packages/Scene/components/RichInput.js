import React, { memo, useState } from 'react';
import { Button, Col, Input, InputNumber, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const RichInput = (props) => {
  const { currentCellId, icon, btnDisabled = false, type = 'string', showLatentTote } = props;

  const [value, setValue] = useState(props.value);

  return (
    <Row type='flex'>
      <Col span={icon ? 18 : 21}>
        {type === 'string' ? (
          <Input
            {...props}
            value={value}
            onChange={({ target }) => {
              props.onChange(target.value);
              setValue(target.value);
            }}
            style={{ width: '100%' }}
          />
        ) : (
          <InputNumber
            style={{ width: '100%' }}
            {...props}
            onChange={({ target }) => {
              props.onChange(target.value);
              setValue(target.value);
            }}
            value={value}
          />
        )}
      </Col>
      {icon ? (
        <Col span={3}>
          <Row justify={'center'} align={'middle'} style={{ height: '100%' }}>
            {icon}
          </Row>
        </Col>
      ) : null}
      <Col span={3}>
        {currentCellId ? (
          <Button
            onClick={() => {
              let currentValue = currentCellId[0];
              if (showLatentTote && currentCellId.length >= 2) {
                const newCurrentCellId = [...currentCellId].reverse();
                currentValue = [newCurrentCellId[0], newCurrentCellId[1]];
              }
              setValue(currentValue);
              props.onChange(currentValue);
            }}
            icon={<PlusOutlined />}
            disabled={currentCellId.length === 0 || btnDisabled}
          />
        ) : null}
      </Col>
    </Row>
  );
};
export default memo(RichInput);
