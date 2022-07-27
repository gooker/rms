import React, { memo, useState } from 'react';
import { Descriptions, message, Modal, Tooltip } from 'antd';
import dayjs from 'dayjs';
import { IconFont } from '@/components/IconFont';
import { fetchAllTimeZone } from '@/services/commonService';
import { dealResponse, formatMessage } from '@/utils/util';
import commonStyles from '@/common.module.less';
import styles from './Header.module.less';

const HeaderTimezone = () => {
  const [loading, setLoading] = useState(false);

  async function showTimezone() {
    setLoading(true);
    const response = await fetchAllTimeZone();
    if (!dealResponse(response)) {
      Modal.info({
        width: 600,
        content: (
          <Descriptions bordered title={formatMessage({ id: 'app.header.timezoneDetail' })}>
            <Descriptions.Item
              span={3}
              label={formatMessage({ id: 'app.header.timezoneDetail.local' })}
            >
              <div className={styles.timeZoneContent}>
                {formatMessage({ id: 'app.header.timezone' })}: {response.localTimeZone}
              </div>
              <div className={styles.timeZoneContent}>
                {formatMessage({ id: 'app.time' })}:{' '}
                {dayjs(response.localTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              label={formatMessage({ id: 'app.header.timezoneDetail.system' })}
            >
              <div className={styles.timeZoneContent}>
                {formatMessage({ id: 'app.header.timezone' })}: {response.systemTimeZone}
              </div>
              <div className={styles.timeZoneContent}>
                {formatMessage({ id: 'app.time' })}:{' '}
                {dayjs(response.systemTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </Descriptions.Item>
            <Descriptions.Item
              span={3}
              label={formatMessage({ id: 'app.header.timezoneDetail.user' })}
            >
              <div className={styles.timeZoneContent}>
                {formatMessage({ id: 'app.header.timezone' })}: {response.userTimeZone}
              </div>
              <div className={styles.timeZoneContent}>
                {formatMessage({ id: 'app.time' })}:{' '}
                {dayjs(response.userTime).format('YYYY-MM-DD HH:mm:ss')}
              </div>
            </Descriptions.Item>
          </Descriptions>
        ),
      });
    } else {
      message.error(formatMessage({ id: 'app.header.timezoneDetail.fetchFail' }));
    }
    setLoading(false);
  }

  return (
    <Tooltip
      color={'#ffffff'}
      title={formatMessage({ id: 'app.header.timezoneDetail' })}
      overlayInnerStyle={{ color: '#000000' }}
    >
      <span className={styles.action} onClick={showTimezone}>
        <span
          className={loading ? commonStyles.spin : commonStyles.resetSpin}
          style={{ height: 19 }}
        >
          <IconFont type='icon-timeZone' />
        </span>
      </span>
    </Tooltip>
  );
};
export default memo(HeaderTimezone);
