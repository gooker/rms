import React, { memo } from 'react';
import { Row, Col, Input } from 'antd';

const RequestHeaderForm = (props) => {
  const { style = {}, value = {}, onChange } = props;

  function onInputChange(ev, key) {
    const newValue = { ...value };
    newValue[key] = ev.target.value;
    onChange && onChange(newValue);
  }

  return (
    <Row gutter={10} style={style}>
      <Col span={8}>
        <Input
          value={value.key}
          onChange={(ev) => {
            onInputChange(ev, 'key');
          }}
          style={{ width: '100%' }}
        />
      </Col>
      <Col span={16}>
        <Input
          value={value.value}
          onChange={(ev) => {
            onInputChange(ev, 'value');
          }}
          style={{ width: '100%' }}
        />
      </Col>
    </Row>
  );
};
export default memo(RequestHeaderForm);
