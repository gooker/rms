import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';

const SourceLock = (props) => {
  const { mapRef, visible, onCancel } = props;

  return <div>SourceLock</div>;
};
export default connect(({ monitor }) => ({
  mapRef: monitor.mapContext,
}))(memo(SourceLock));
