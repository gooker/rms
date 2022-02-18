import React, { memo } from 'react';
import intl from 'react-intl-universal';
import styles from './Header.module.less';

const ExpiredTip = (props) => {
  const { days } = props;
  let tipStyle;
  if (days <= 30 && days > 7) {
    tipStyle = styles.expiredIn30;
  } else if (days <= 7 && days > 3) {
    tipStyle = styles.expiredTipIn7;
  } else {
    tipStyle = styles.expiredTipIn3;
  }
  return (
    <div className={tipStyle}>
      {days === null ? (
        intl.formatMessage({ id: 'app.authCenter.unauthorized' })
      ) : days > 0 ? (
        <>
          {days}
          {intl.formatMessage({ id: 'app.authCenter.days' })}
        </>
      ) : (
        intl.formatMessage({ id: 'app.authCenter.hasExpired' })
      )}
    </div>
  );
};
export default memo(ExpiredTip);
