import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { formatMessage } from '@/utils/util';
import { IconFont } from '@/components/IconFont';
import styles from '@/packages/Portal/components/Header.module.less';

const HeaderTimezone = () => {
  return (
    <Tooltip
      color={'#ffffff'}
      title={formatMessage({ id: 'app.header.timezoneDetail' })}
      overlayInnerStyle={{ color: '#000000' }}
    >
      <span className={styles.action}>
        <IconFont type='icon-timeZone' />
      </span>
    </Tooltip>
  );
};
export default memo(HeaderTimezone);
