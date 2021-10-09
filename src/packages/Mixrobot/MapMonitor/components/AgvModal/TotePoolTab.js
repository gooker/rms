import React, { memo, useEffect, useState } from 'react';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchTotePoolCodes } from './AgvModalApi';
import { dealResponse } from '@/utils/utils';
import styles from './TotePoolTab.less';

const TotePoolTab = (props) => {
  const { agv } = props;
  const { agvId } = JSON.parse(agv);

  const [loading, setLoading] = useState(true);
  const [toteCodes, setToteCodes] = useState([]);

  useEffect(() => {
    fetchData();
  }, [agv]);

  async function fetchData() {
    setLoading(true);
    const response = await fetchTotePoolCodes({ AGVId: agvId });
    if (dealResponse(response)) {
      setToteCodes([]);
    } else {
      setToteCodes(response || []);
    }
    setLoading(false);
  }

  function renderTabBody() {
    if (loading) {
      return (
        <div className={styles.placeholder}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.loading" />
        </div>
      );
    }
    if (toteCodes.length === 0) {
      return (
        <div className={styles.placeholder}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.noData" />
        </div>
      );
    }
    const rows = toteCodes.map((row) => {
      const { id, toteCode, isLocked, isFetched } = row;
      return (
        <div key={id} className={styles.row}>
          <span className={styles.rowItem}>{toteCode}</span>
          <span className={styles.rowItem}>
            {isLocked ? (
              <FormattedMessage id="app.monitor.modal.AGV.tip.locked" />
            ) : (
              <FormattedMessage id="app.monitor.modal.AGV.tip.notLocked" />
            )}
          </span>
          <span className={styles.rowItem}>
            {isFetched ? (
              <FormattedMessage id="app.monitor.modal.AGV.tip.totePoolFetched" />
            ) : (
              <FormattedMessage id="app.monitor.modal.AGV.tip.totePoolNotFetched" />
            )}
          </span>
        </div>
      );
    });
    return <>{rows}</>;
  }

  return (
    <>
      <div className={styles.tableHeader}>
        <div className={styles.headerItem}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.totePoolCode" />
        </div>
        <div className={styles.headerItem}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.totePoolIsLocked" />
        </div>
        <div className={styles.headerItem}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.totePoolIsFetched" />
        </div>
      </div>
      {renderTabBody()}
    </>
  );
};
export default memo(TotePoolTab);
