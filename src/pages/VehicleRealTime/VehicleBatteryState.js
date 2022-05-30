import React from 'react';
import commomStyles from '@/common.module.less';

const VehicleBatteryState = React.memo((props) => {
  return (
    <div className={commomStyles.flexRow}>
      <div style={{ flex: 1 }}>111</div>
      <div style={{ flex: 4 }}>2222</div>
    </div>
  );
});
export default VehicleBatteryState;
