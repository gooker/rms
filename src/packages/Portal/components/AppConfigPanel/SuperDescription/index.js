import React from 'react';
import styles from './DescriptionItem.module.less';

export default function DescriptionsItem(props) {
  const { data } = props;

  return (
    <div className={styles.descriptionsItemBottom}>
      {data.map(({ module, api, version }) => (
        <div key={module} className={styles.descriptionsItem}>
          <div className={styles.label}>{module}</div>
          {/* <div className={styles.value}>
            <span className={styles.versionLeft}>{version?`[ V ${version} ]`:''}</span>
          </div> */}
          <div className={styles.value}>{api}</div>
        </div>
      ))}
    </div>
  );
}
