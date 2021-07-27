import React, { memo } from 'react';
import { Slider, Button } from 'antd';
import Dictionary from '@/utils/Dictionary';
import styles from './battery.module.less';

const { red, green, yellow } = Dictionary('color');

const BatteryCharge = (props) => {
  const { value, onChange, declineValue, increaseValue } = props;

  let backgroundColor = '#FFF';
  if (parseInt(value) > 50) {
    backgroundColor = green;
  } else if (parseInt(value) > 10) {
    backgroundColor = yellow;
  } else {
    backgroundColor = red;
  }

  return (
    <div className={styles.battery}>
      <div className={styles.mainBody}>
        <div className={styles.contact} />
        <div className={styles.cylinder}>
          <div className={styles.electricity} style={{ background: backgroundColor }} />
        </div>
      </div>
      <div>1111</div>
    </div>
  );
};
export default memo(BatteryCharge);
