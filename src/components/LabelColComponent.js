import React from 'react';
import { Row, Col } from 'antd';

const LabelColComponent = (props) => {
  const { label, children } = props;
  return (
    <Row style={{ marginBottom: 15 }}>
      <Col span={12}>
        <span>{label}:</span>
      </Col>
      <Col span={12}>
        <div style={{ flex: 1, marginLeft: 10 }}>{children}</div>
      </Col>
    </Row>
  );
};
export default LabelColComponent;
