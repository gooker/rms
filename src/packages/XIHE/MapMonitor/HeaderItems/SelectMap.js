import React, { memo } from 'react';
import { connect } from '@/utils/RcsDva';
import { formatMessage } from '@/utils/util';
import styles from './index.module.less';

const SelectMap = (props) => {
  const { currentMap } = props;
  return (
    <span className={styles.action}>
      {currentMap?.name || formatMessage({ id: 'mapEditor.map' })}
    </span>
  );
};
export default connect(({ monitor }) => ({
  currentMap: monitor.currentMap,
}))(memo(SelectMap));
