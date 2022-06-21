import React from 'react';
import { Row, Col, InputNumber } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './priority.module.less';
import { find } from 'lodash';

const rowIdMap = {
  STORE: 'id',
  LOAD: 'loadId',
  VEHICLE: 'vehicleId',
  CHARGER: 'chargerId',
  CHARGE_STRATEGY: 'code',
};

export default function ResourceGroupPriorityModal(props) {
  const { onChange, data, allRows, groupType } = props;
  const currentValue = Array.isArray(data) ? [...data] : [];

  function onPriorityChange(index, fieldIndex, value) {
    currentValue[index][fieldIndex] = Number(value);
    onChange(currentValue);
  }

  function renderBody() {
    return currentValue.map(({ id, priority }, index) => {
      const currentRow = find(allRows, { id });
      return (
        <Row key={index} className={styles.resourceBodyRow} gutter={10}>
          <Col span={12}>{rowIdMap[groupType] ? currentRow[rowIdMap[groupType]] : id}</Col>
          <Col span={12}>
            <InputNumber
              style={{ width: 130 }}
              value={priority ?? 5}
              onChange={(e) => {
                onPriorityChange(index, 'priority', e);
              }}
            />
          </Col>
        </Row>
      );
    });
  }

  return (
    <div className={styles.resource}>
      <Row className={styles.resourceTitle}>
        <Col span={12}>ID</Col>
        <Col span={12}>
          <FormattedMessage id="app.common.priority" />
        </Col>
      </Row>
      <div>{renderBody()}</div>
    </div>
  );
}
