import React, { memo, useEffect } from 'react';
import { connect } from '@/utils/RcsDva';
import CustomTaskForm from './components/CustomTaskForm';
import CustomTaskTable from './components/CustomTaskTable';
import commonStyles from '@/common.module.less';
// import styles from './customTask.module.less';

const CustomTask = (props) => {
  const { dispatch, listVisible } = props;

  useEffect(() => {
    dispatch({ type: 'customTask/initPage' });
  }, []);

  return (
    <div className={commonStyles.commonPageStyle}>
      {listVisible && <CustomTaskTable />}
      {!listVisible && <CustomTaskForm />}
    </div>
  );
};
export default connect(({ customTask }) => ({
  listVisible: customTask.listVisible,
}))(memo(CustomTask));
