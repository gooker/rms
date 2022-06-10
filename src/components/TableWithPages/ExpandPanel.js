import React, { memo } from 'react';
import { Col, Row } from 'antd';
import LabelComponent from '@/components/LabelComponent';

const ExpandPanel = (props) => {
  const { record, columns, span = 12 } = props;
  return (
    <Row>
      {columns.map(({ title, dataIndex, render }, index) => (
        <Col key={index} span={span}>
          <LabelComponent label={title} color={'#000'}>
            {typeof render === 'function' ? render(record[dataIndex], record) : record[dataIndex]}
          </LabelComponent>
        </Col>
      ))}
    </Row>
  );
};
export default memo(ExpandPanel);
