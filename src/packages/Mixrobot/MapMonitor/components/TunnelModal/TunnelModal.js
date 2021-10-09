import React, { memo, useEffect, useState } from 'react';
import { message } from 'antd';
import { getTunnelState, deleteTunnelAgvLock } from '@/services/monitor';
import { formatTunnelStateDataSource } from '@/utils/mapUtils';
import FormattedMessage from '@/components/FormattedMessage';
import { hasPermission } from '@/utils/Permission';
import { dealResponse, isNull, formatMessage } from '@/utils/utils';
import { UseMonitorModalSize } from '@/customHooks';
import AgvTag from './AgvTag';
import styles from './index.less';
import commonStyle from '@/common.module.less';

const TunnelModal = memo(({ tunnel }) => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [width, height] = UseMonitorModalSize();

  useEffect(refreshDataSource, [tunnel]);

  function refreshDataSource() {
    setLoading(true);
    getTunnelState().then((response) => {
      setLoading(false);
      if (dealResponse(response)) {
        message.error(formatMessage({ id: 'app.monitor.modal.tunnel.fetchFailed' }));
        return;
      }
      setDataSource(formatTunnelStateDataSource(tunnel, response));
    });
  }

  function deleteAgvLock(agvId) {
    deleteTunnelAgvLock(agvId).then(refreshDataSource);
  }

  function renderAgvTags(collection) {
    const result = [];
    collection.forEach((item, idx) => {
      if (isNull(item.code)) {
        // 说明整个通道都被一辆小车锁住了
        result.push(
          <AgvTag
            key={item}
            code={null}
            agvId={item}
            deleteLock={deleteAgvLock}
            title={formatMessage({
              id: 'app.monitor.modal.tunnel.deleteLockConfirm',
            })}
            permission={hasPermission('/map/monitor/tunnelModal/deleteLock')}
          />,
        );
      } else {
        const { code, agvs } = item;
        agvs.forEach((agvId, idx2) => {
          result.push(
            <AgvTag
              key={`${idx}-${idx2}`}
              code={code}
              agvId={agvId}
              deleteLock={deleteAgvLock}
              title={formatMessage({
                id: 'app.monitor.modal.tunnel.deleteLockConfirm',
              })}
              permission={hasPermission('/map/monitor/tunnelModal/deleteLock')}
            />,
          );
        });
      }
    });
    return result;
  }

  return (
    <div
      className={commonStyle.checkModal}
      style={{
        display: 'flex',
        top: '10%',
        left: `calc(50% - ${width / 2}px)`,
        height: `${height}px`,
        width: `${width}px`,
      }}
    >
      <div className={commonStyle.header}>
        <div className={commonStyle.title}>{tunnel}</div>
      </div>
      <div className={styles.body}>
        <div className={styles.tableHeader}>
          <div className={styles.tunnelColumn} style={{ borderRight: 'none' }}>
            <FormattedMessage id="app.monitor.modal.tunnel.name" />
          </div>
          <div className={styles.headerLock}>
            <FormattedMessage id="app.monitor.modal.tunnel.lock" />
          </div>
        </div>
        <div className={styles.tableBody}>
          {dataSource.length > 0 &&
            dataSource.map(({ tunnelName, in: entrance, out: exit }, index) => (
              <div key={index} className={styles.tableRow}>
                <div className={styles.tunnelColumn}>{tunnelName}</div>
                <div className={styles.lockColumn}>
                  <div className={styles.inLockRow}>
                    <div className={styles.tunnelColumn}>
                      <FormattedMessage id="app.monitor.modal.tunnel.in" />
                    </div>
                    <div className={styles.flex5VerticalCenter}>{renderAgvTags(entrance)}</div>
                  </div>
                  <div className={styles.outLockRow}>
                    <div className={styles.tunnelColumn}>
                      <FormattedMessage id="app.monitor.modal.tunnel.out" />
                    </div>
                    <div className={styles.flex5VerticalCenter}>{renderAgvTags(exit)}</div>
                  </div>
                </div>
              </div>
            ))}
          {dataSource.length === 0 && (
            <div className={styles.noData}>
              {loading ? (
                <FormattedMessage id="app.monitor.modal.tunnel.loading" />
              ) : (
                <FormattedMessage id="app.monitor.modal.tunnel.noData" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
export default TunnelModal;
