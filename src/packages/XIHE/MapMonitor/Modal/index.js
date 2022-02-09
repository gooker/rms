import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import EmptyRun from './EmptyRun';

const MonitorModals = (props) => {
  const { categoryModal } = props;
  return <>{categoryModal === 'emptyRun' && <EmptyRun />}</>;
};
export default connect(({ monitor }) => ({
  categoryModal: monitor.categoryModal,
}))(memo(MonitorModals));
