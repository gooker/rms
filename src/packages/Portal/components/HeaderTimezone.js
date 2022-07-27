import React, { memo } from 'react';
import { message, Tooltip } from 'antd';
import { dealResponse, formatMessage } from '@/utils/util';
import { IconFont } from '@/components/IconFont';
import styles from '@/packages/Portal/components/Header.module.less';
import { fetchAllTimeZone } from '@/services/commonService';

const HeaderTimezone = () => {
  async function showTimezone() {
    const response = await fetchAllTimeZone();
    if (!dealResponse(response)) {
      console.log(response);
    } else {
      message.error(formatMessage({ id: 'app.header.timezoneDetail.fetchFail' }));
    }
  }

  return (
    <Tooltip
      color={'#ffffff'}
      title={formatMessage({ id: 'app.header.timezoneDetail' })}
      overlayInnerStyle={{ color: '#000000' }}
    >
      <span className={styles.action} onClick={showTimezone}>
        <IconFont type='icon-timeZone' />
      </span>
    </Tooltip>
  );
};
export default memo(HeaderTimezone);
