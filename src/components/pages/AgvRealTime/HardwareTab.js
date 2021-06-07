import React from 'react';
import commonStyles from '@/common.module.less';
import AgvBatteryState from './AgvBatteryState';

const HardwareTab = (props) => {
  return (
    <div className={commonStyles.flexColumn}>
      <div>000</div>
      <div>
        <AgvBatteryState />
      </div>
    </div>
  );
};

export default React.memo(HardwareTab);
