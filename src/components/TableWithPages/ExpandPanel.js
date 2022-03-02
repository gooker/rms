import React, { memo } from 'react';
import { Row, Col } from 'antd';
import { GridResponsive } from '@/config/consts';
import LabelComponent from '@/components/LabelComponent';

const ExpandPanel = (props) => {
  const { record, columns } = props;
  return (
    <Row>
      {columns.map(({ title, dataIndex, render }, index) => (
        <Col key={index} span={6} {...GridResponsive}>
          <LabelComponent label={title} color={'#000'}>
            {typeof render === 'function' ? render(record[dataIndex], record) : record[dataIndex]}
          </LabelComponent>
        </Col>
      ))}
    </Row>
  );
};
export default memo(ExpandPanel);
