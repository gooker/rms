import React, { memo, useEffect, useState } from 'react';
import { message, Row, Col } from 'antd';
import { AlertTwoTone } from '@ant-design/icons';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchForkLiftLoad } from './AgvModalApi';
import { dealResponse, isNull } from '@/utils/utils';
import styles from './ForkBin.less';

const ForkBin = memo((props) => {
  const { agv } = props;
  const { agvId } = JSON.parse(agv);

  const [dataSource, setDataSource] = useState({});

  async function fetchData() {
    const response = await fetchForkLiftLoad(agvId);
    if (dealResponse(response)) {
      message.error(formatMessage({ id: 'app.monitor.modal.AGV.tip.fetchForkBinFail' }));
      return;
    }
    if (dealResponse(response)) {
      setDataSource({});
    } else {
      setDataSource(response);
    }
  }

  useEffect(() => {
    fetchData();
  }, [agv]);

  function renderValue(value, tag) {
    if (isNull(value)) {
      return '';
    }
    return `${value}${tag}`;
  }

  return (
    <div>
      {dataSource.load && !dataSource.flag && (
        <Row type="flex" align="middle" className={styles.tip}>
          <AlertTwoTone twoToneColor="#c70039" />
          <span style={{ marginLeft: '5px' }}>
            <FormattedMessage id="app.monitor.modal.forkBin.warn" />
          </span>
        </Row>
      )}
      <Row type="flex" align="middle" justify="center" className={styles.head}>
        {dataSource?.id}
      </Row>
      <Row type="flex" justify="space-between" className={styles.body}>
        <Col className={styles.sku} span={11}>
          <Row type="flex" justify="center" align="middle" className={styles.dataRow}>
            <FormattedMessage id="app.monitor.modal.forkBin.freight" />
          </Row>
          <Row type="flex" className={styles.dataRow}>
            <Col className={styles.label}>
              <FormattedMessage id="app.monitor.modal.forkBin.length" />
            </Col>
            <Col className={styles.value}>{`${renderValue(
              dataSource?.freight?.longSide,
              'mm',
            )}`}</Col>
          </Row>
          <Row type="flex" className={styles.dataRow}>
            <Col className={styles.label}>
              <FormattedMessage id="app.monitor.modal.forkBin.width" />
            </Col>
            <Col className={styles.value}>{`${renderValue(
              dataSource?.freight?.shortSide,
              'mm',
            )}`}</Col>
          </Row>
          <Row type="flex" className={styles.dataRow}>
            <Col className={styles.label}>
              <FormattedMessage id="app.monitor.modal.forkBin.height" />
            </Col>
            <Col className={styles.value}>{`${renderValue(
              dataSource?.freight?.height,
              'mm',
            )}`}</Col>
          </Row>
          <Row type="flex" className={styles.dataRow}>
            <Col className={styles.label}>
              <FormattedMessage id="app.monitor.modal.forkBin.weight" />
            </Col>
            <Col className={styles.value}>{`${renderValue(
              dataSource?.freight?.weight,
              'kg',
            )}`}</Col>
          </Row>
        </Col>
        <Col className={styles.pallet} span={11}>
          <Row type="flex" justify="center" align="middle" className={styles.dataRow}>
            <FormattedMessage id="app.monitor.modal.forkBin.pallet" />
          </Row>
          <Row type="flex" className={styles.dataRow}>
            <Col className={styles.label}>
              <FormattedMessage id="app.monitor.modal.forkBin.length" />
            </Col>
            <Col className={styles.value}>{`${renderValue(
              dataSource?.pallet?.longSide,
              'mm',
            )}`}</Col>
          </Row>
          <Row type="flex" className={styles.dataRow}>
            <Col className={styles.label}>
              <FormattedMessage id="app.monitor.modal.forkBin.width" />
            </Col>
            <Col className={styles.value}>{`${renderValue(
              dataSource?.pallet?.shortSide,
              'mm',
            )}`}</Col>
          </Row>
          <Row type="flex" className={styles.dataRow}>
            <Col className={styles.label}>
              <FormattedMessage id="app.monitor.modal.forkBin.height" />
            </Col>
            <Col className={styles.value}>{`${renderValue(dataSource?.pallet?.height, 'mm')}`}</Col>
          </Row>
          <Row type="flex" className={styles.dataRow}>
            <Col className={styles.label}>
              <FormattedMessage id="app.monitor.modal.forkBin.weight" />
            </Col>
            <Col className={styles.value}>{`${renderValue(dataSource?.pallet?.weight, 'kg')}`}</Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
});
export default ForkBin;
