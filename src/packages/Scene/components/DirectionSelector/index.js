import React, { memo } from 'react';
import { Button } from 'antd';
import styles from './DirectionSelector.module.less';
import { IconFont } from '@/components/IconFont';

const BtnStyle = { width: '90%', height: '90%' };

const DirectionSelector = (props) => {
  const { value, onChange } = props;

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <span className={styles.rowItem} />
        <span className={styles.rowItem}>
          <Button
            type={value === 0 ? 'primary' : 'default'}
            style={BtnStyle}
            onClick={() => {
              onChange(0);
            }}
          >
            <IconFont type={'icon-align-top'} />
          </Button>
        </span>
        <span className={styles.rowItem} />
      </div>
      <div className={styles.row}>
        <span className={styles.rowItem}>
          <Button
            type={value === 3 ? 'primary' : 'default'}
            style={BtnStyle}
            onClick={() => {
              onChange(3);
            }}
          >
            <IconFont type={'icon-align-left'} />
          </Button>
        </span>
        <span className={styles.rowItem} />
        <span className={styles.rowItem}>
          <Button
            type={value === 1 ? 'primary' : 'default'}
            style={BtnStyle}
            onClick={() => {
              onChange(1);
            }}
          >
            <IconFont type={'icon-align-right'} />
          </Button>
        </span>
      </div>
      <div className={styles.row}>
        <span className={styles.rowItem} />
        <span className={styles.rowItem}>
          <Button
            type={value === 2 ? 'primary' : 'default'}
            style={BtnStyle}
            onClick={() => {
              onChange(2);
            }}
          >
            <IconFont type={'icon-align-bottom'} />
          </Button>
        </span>
        <span className={styles.rowItem} />
      </div>
    </div>
  );
};
export default memo(DirectionSelector);
