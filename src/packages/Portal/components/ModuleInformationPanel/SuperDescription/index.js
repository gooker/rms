import React from 'react';
import styles from './DescriptionItem.module.less';

export default function SuperDescription(props) {
  const { data } = props;

  return (
    <>
      {data.map(({ module, api, version }) => (
        <div key={module} className={styles.descriptionsItem}>
          <div className={styles.label}>{module}</div>
          <div className={styles.value}>{api}</div>
          <div className={styles.value}>
            <span className={styles.versionLeft}>{version ? version : ''}</span>
          </div>
        </div>
      ))}
    </>
  );
}
