import React, { memo, useEffect, useState } from 'react';
import { message, Row, Col } from 'antd';
import intl from 'react-intl-universal';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchToteBins } from './AgvModalApi';
import { dealResponse } from '@/utils/utils';
import styles from './ToteBinTab.less';

const ToteBinTab = memo((props) => {
  const { agv } = props;
  const { agvId } = JSON.parse(agv);

  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState(null);

  useEffect(() => {
    fetchData();
  }, [agv]);

  async function fetchData() {
    setLoading(true);
    const response = await fetchToteBins({ robotId: agvId });
    setLoading(false);
    if (dealResponse(response)) {
      message.error(intl.formatMessage({ id: 'app.monitor.modal.AGV.tip.fetchToteBinFail' }));
      return;
    }
    if (dealResponse(response)) {
      setDataSource(null);
    } else {
      setDataSource(response[agvId] ?? null);
    }
  }

  return (
    <Row type="flex" gutter={10}>
      <Col span={12} className={styles.toteCodes}>
        <div className={styles.row}>
          <span className={styles.labelWidth}>
            <FormattedMessage id="app.monitor.modal.toteBin.level" />
          </span>
          <span className={styles.valueWidth}>
            <FormattedMessage id="app.monitor.modal.toteBin.code" />
          </span>
        </div>
        {loading && (
          <div className={styles.loading}>
            <FormattedMessage id="app.monitor.modal.tunnel.loading" />
          </div>
        )}
        {!loading &&
          dataSource?.toteCodes.map((tote, index) => (
            <div key={index} className={styles.row}>
              <span className={styles.labelWidth}>
                {intl.formatMessage(
                  { id: 'app.monitor.modal.toteBin.levelIndex' },
                  { index: index + 1 },
                )}
              </span>
              <span className={styles.valueWidth}>
                {tote || intl.formatMessage({ id: 'app.monitor.modal.toteBin.null' })}
              </span>
            </div>
          ))}
      </Col>
      <Col span={12}>
        <div className={styles.toteHolding}>
          <span className={styles.toteHoldingColumn}>
            <FormattedMessage id="app.monitor.modal.toteBin.holdingTote" />
          </span>
          <span className={styles.toteHoldingColumn} style={{ borderTop: '1px solid #636060' }}>
            {dataSource?.holdingToteCode
              ? dataSource.holdingToteCode
              : intl.formatMessage({ id: 'app.monitor.modal.toteBin.null' })}
          </span>
        </div>
      </Col>
    </Row>
  );
});
export default ToteBinTab;
