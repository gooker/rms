import React from 'react';
import { Col, Row } from 'antd';

const LabelColComponent = (props) => {
  const { label, children, labelCol = 6, color = '#e8e8e8' } = props;
  return (
    <Row style={{ color, marginBottom: 15 }}>
      <Col span={labelCol} style={{ textAlign: 'end', fontWeight: 600, fontSize: 15 }}>
        {label}
      </Col>
      <Col span={24 - labelCol}>
        <div style={{ flex: 1, marginLeft: 10 }}>{children}</div>
      </Col>
    </Row>
  );
};
export default LabelColComponent;
