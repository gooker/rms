import React, { memo, useEffect } from 'react';
import { connect } from '@/utils/dva';
import CustomTaskForm from './components/CustomTaskForm';
import CustomTaskTable from './components/CustomTaskTable';
import styles from './customTask.less';

const CustomTask = (props) => {
  const { dispatch, listVisible } = props;

  useEffect(() => {
    dispatch({ type: 'customTask/initPage' });
  }, []);

  return (
    <div className={styles.customTaskContainer}>
      {listVisible && <CustomTaskTable />}
      {!listVisible && <CustomTaskForm />}
    </div>
  );
};
export default connect(({ customTask }) => ({
  listVisible: customTask.listVisible,
}))(memo(CustomTask));
