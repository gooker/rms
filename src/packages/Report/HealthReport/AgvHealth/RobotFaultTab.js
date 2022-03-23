import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import ScanOrFaultComponent from './components/ScanOrFaultComponent';

const RobotFaultComponent = (props) => {
  const { originData, keyDataMap, activeTab,originIds } = props;
  return (
    <>
      <ScanOrFaultComponent
        codeDomId="malfunctionHealthByIdHistory"
        chartTitle={formatMessage({ id: 'reportCenter.agv.fault' })}
        chartSubTitle={formatMessage({ id: 'reportCenter.way.agv' })}
        dateDomId="malfunctionHealthBydateHistory"
        originData={originData}
        keyData={keyDataMap}
        activeTab={activeTab}
        originIds={originIds}
      />
    </>
  );
};
export default memo(RobotFaultComponent);
