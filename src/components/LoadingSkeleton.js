import React, { memo } from 'react';
import styles from './loadingSkeleton.module.less';

const LoadingSkeleton = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header} />
      <div style={{ display: 'flex', flex: 1 }}>
        <div className={styles.leftSide} />
        <div className={styles.content}>
          <div className={styles.contentItem} />
          <div className={styles.contentItem} />
          <div className={styles.contentItem} />
          <div className={styles.contentItem} />
          <div className={styles.contentItem} />
          <div className={styles.contentItem} />
        </div>
      </div>
    </div>
  );
};
export default memo(LoadingSkeleton);
