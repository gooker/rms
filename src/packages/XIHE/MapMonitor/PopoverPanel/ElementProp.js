import React, { memo } from 'react';
import { connect } from '@/utils/dva';
import styles from '../monitorLayout.module.less';

const ElementProp = (props) => {
  const { data, height } = props;
  return (
    <div style={{ height, width: 360 }} className={styles.popoverPanel}>
      {JSON.stringify(data)}
    </div>
  );
};
export default connect(({ monitor }) => ({
  data: monitor.categoryLoad,
}))(memo(ElementProp));
