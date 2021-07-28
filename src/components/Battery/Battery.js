import React, { memo } from 'react';
import { Slider } from 'antd';
import Dictionary from '@/utils/Dictionary';
import styles from './battery.module.less';

const { red, green, yellow } = Dictionary('color');

const BatteryCharge = (props) => {
  const { value, onChange } = props;

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
          <span className={styles.electricityNumber}>{`${value}%`}</span>
          <div
            className={styles.electricity}
            style={{ background: backgroundColor, height: `${value}%` }}
          />
        </div>
      </div>
      <div className={styles.slider}>
        <Slider vertical value={value} onChange={onChange} tooltipVisible={false} />
      </div>
    </div>
  );
};
export default memo(BatteryCharge);
