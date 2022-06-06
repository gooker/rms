import React, { memo, useEffect } from 'react';
import { connect } from '@/utils/RmsDva';
import CustomTaskForm from './components/CustomTaskForm';
import CustomTaskTable from './components/CustomTaskTable';

const CustomTask = (props) => {
  const { dispatch, listVisible } = props;

  useEffect(() => {
    dispatch({ type: 'customTask/initPage' });
    return () => {
      dispatch({ type: 'customTask/unmount' });
    };
  }, []);

  if (listVisible) {
    return <CustomTaskTable />;
  } else {
    return <CustomTaskForm />;
  }
};
export default connect(({ customTask }) => ({
  listVisible: customTask.listVisible,
}))(memo(CustomTask));
