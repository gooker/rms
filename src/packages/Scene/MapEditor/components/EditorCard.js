import React, { memo } from 'react';
import styles from '../../popoverPanel.module.less';

const EditorCard = (props) => {
  const { label, children } = props;

  return (
    <div className={styles.editorCard}>
      <div style={{ color: '#e8e8e8' }}>{label}</div>
      <div>{children}</div>
    </div>
  );
};
export default memo(EditorCard);
