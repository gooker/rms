import React, { memo } from 'react';
import intl from 'react-intl-universal';
import styles from './ha.module.less';

const HAServerList = (props) => {
  const { servers } = props;

  function renderHeatBeatTimeout(heartbeatTimeout) {
    const duration = parseInt((heartbeatTimeout - 50 * 1000) / 1000, 10);
    return duration >= 0 ? duration : 0;
  }

  return (
    <div>
      <div className={styles.serverListTitle}>
        <span></span>
        <span>{intl.formatMessage({ id: 'app.navBar.haMode.serverName' })}</span>
        <span>{intl.formatMessage({ id: 'app.navBar.haMode.serverDomain' })}</span>
        <span style={{ display: 'flex', flexFlow: 'column nowrap' }}>
          <span>{intl.formatMessage({ id: 'app.navBar.haMode.heatBeatTimeout' })}</span>
          <span style={{ fontSize: 12 }}>
            ({intl.formatMessage({ id: 'app.navBar.haMode.heatBeatTimeout.tip' })})
          </span>
        </span>
      </div>
      {servers.map(({ serverName, currentUrl, lockSuccess, heartbeatTimeout }, index) => {
        // 心跳延迟超过60则认定为可能有问题
        const couldBeError = heartbeatTimeout > 60 * 1000;
        return (
          <div key={index} className={styles.serverListBody}>
            <span>
              <span
                className={styles.stateDot}
                style={{ background: couldBeError ? '#ff0000' : '#32CA33' }}
              />
              {intl.formatMessage({
                id: lockSuccess ? 'app.navBar.haMode.main' : 'app.navBar.haMode.spare',
              })}
            </span>
            <span>{serverName}</span>
            <span>{currentUrl}</span>
            <span>{`${renderHeatBeatTimeout(heartbeatTimeout)}s`}</span>
          </div>
        );
      })}
    </div>
  );
};
export default memo(HAServerList);
