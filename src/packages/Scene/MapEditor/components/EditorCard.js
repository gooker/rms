import React, { memo } from 'react';
import styles from '../../../XIHE/popoverPanel.module.less';

const EditorCard = (props) => {
  const { label, children } = props;

  return (
    <div className={styles.editorCard}>
      <div>{label}</div>
      <div>{children}</div>
    </div>
  );
};
export default memo(EditorCard);
