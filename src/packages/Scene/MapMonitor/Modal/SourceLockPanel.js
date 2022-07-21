import React, { memo } from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { getMapModalPosition } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import styles from '../monitorLayout.module.less';

const SourceLockPanel = ({ dispatch }) => {
  function close() {
    dispatch({ type: 'monitor/saveCategoryModal', payload: null });
  }

  return (
    <div style={getMapModalPosition(550)} className={styles.monitorModal}>
      <div className={styles.monitorModalHeader}>
        <FormattedMessage id={'monitor.right.sourceLockView'} />
        <CloseOutlined onClick={close} style={{ cursor: 'pointer' }} />
      </div>
      <div className={styles.monitorModalBody} style={{ paddingTop: 20 }}>
        111
      </div>
    </div>
  );
};
export default memo(SourceLockPanel);
