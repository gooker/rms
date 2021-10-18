import React, { memo, useEffect, useState } from 'react';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchAgvErrorRecord } from './AgvModalApi';
import { dealResponse } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';
import { ApiNameSpace } from '@/config/config';
import styles from './ErrorTab.less';

const { blue, yellow, red } = Dictionary('color', 'all');
const ErrorColor = {
  1: blue,
  2: blue,
  3: yellow,
  4: red,
  5: red,
};

const ErrorTab = (props) => {
  const { agv, sectionId } = props;
  const { agvId, agvType } = JSON.parse(agv);

  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    fetchData();
  }, [agv]);

  async function fetchData() {
    setLoading(true);
    const params = {
      sectionId,
      agvId,
      current: 1,
      size: 999,
      lowLevel: 3,
      highLevel: 5,
    };
    const response = await fetchAgvErrorRecord(params, ApiNameSpace[agvType]);
    if (dealResponse(response)) {
      setErrors([]);
    } else {
      setErrors(response?.list ?? []);
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
    if (errors.length === 0) {
      return (
        <div className={styles.placeholder}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.noData" />
        </div>
      );
    }
    const rows = errors.map((row) => {
      const { id, errorCode, errorName, level, createTime, updateTime } = row;
      return (
        <div key={id} className={styles.row}>
          <span className={styles.rowItem}>{errorCode}</span>
          <span className={styles.rowItem} style={{ color: ErrorColor[level] }}>
            {errorName}
          </span>
          <span className={styles.rowItem}>{createTime}</span>
          <span className={styles.rowItem}>{updateTime}</span>
        </div>
      );
    });
    return <>{rows}</>;
  }

  return (
    <>
      <div className={styles.tableHeader}>
        <div className={styles.headerItem}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.erorCode" />
        </div>
        <div className={styles.headerItem}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.erorName" />
        </div>
        <div className={styles.headerItem}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.createTime" />
        </div>
        <div className={styles.headerItem}>
          <FormattedMessage id="app.monitor.modal.AGV.tip.updateTime" />
        </div>
      </div>
      {renderTabBody()}
    </>
  );
};
export default memo(ErrorTab);
