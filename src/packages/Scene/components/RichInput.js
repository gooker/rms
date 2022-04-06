import React, { memo, useState } from 'react';
import { Row, Input, Button, Col, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import commonStyles from '@/common.module.less';

export default memo(function MapInput(props) {
  const { currentCellId, icon, btnDisabled = false, type = 'string', showlatentTote } = props;

  const [value, setValue] = useState(props.value);

  return (
    <Row type="flex">
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
        <Col span={3} className={commonStyles.flexCenter}>
          {icon}
        </Col>
      ) : null}
      <Col span={3}>
        {currentCellId ? (
          <Button
            onClick={() => {
              let curentValue = currentCellId[0];
              if (showlatentTote && currentCellId.length >= 2) {
                const newCurrentCellId = [...currentCellId].reverse();
                curentValue = [newCurrentCellId[0], newCurrentCellId[1]];
              }
              setValue(curentValue);
              props.onChange(curentValue);
            }}
            icon={<PlusOutlined />}
            disabled={currentCellId.length === 0 || btnDisabled}
          />
        ) : null}
      </Col>
    </Row>
  );
});
