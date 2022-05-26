import React, { memo } from 'react';
import styles from '../customTask.module.less';

const TaskBodyModal = (props) => {
  const { data } = props;

  // JSON结构
  const json = data ? { ...data } : {};
  return (
    <div className={styles.taskBodyModal}>
      <pre>{JSON.stringify(json, null, 4)} </pre>
    </div>
  );
};
export default memo(TaskBodyModal);
