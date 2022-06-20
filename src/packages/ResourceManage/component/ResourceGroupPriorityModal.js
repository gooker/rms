/**TODO: I18N*/
import React from 'react';
import { Row, Col, Input } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './priority.module.less';

export default function ResourceGroupPriorityModal(props) {
  const { onChange, data } = props;
  const currentValue = Array.isArray(data) ? [...data] : [];

  function onPriorityChange(index, fieldIndex, value) {
    currentValue[index][fieldIndex] = Number(value);
    onChange(currentValue);
  }

  function renderBody() {
    return currentValue.map(({ id, priority }, index) => {
      return (
        <Row key={index} className={styles.resourceBodyRow} gutter={10}>
          <Col span={10}>{id}</Col>
          <Col span={14}>
            <Input
              value={priority ?? 5}
              onChange={(e) => onPriorityChange(index, 'priority', e.target.value)}
            />
          </Col>
        </Row>
      );
    });
  }

  return (
    <div className={styles.resource}>
      <Row className={styles.resourceTitle}>
        <Col span={10}>ID</Col>
        <Col span={14}>
          <FormattedMessage id="app.common.priority" />
        </Col>
      </Row>
      <div>{renderBody()}</div>
    </div>
  );
}
