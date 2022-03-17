import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import ScanOrFaultComponent from './components/ScanOrFaultComponent';

const ToteQrcodeHealth = (props) => {
  const { originData, keyDataMap } = props;
  return (
    <>
      <ScanOrFaultComponent
        codeDomId="robotFaultByIdHistory"
        chartTitle={formatMessage({ id: 'reportCenter.robot.fault' })}
        chartSubTitle={formatMessage({ id: 'reportCenter.way.agv' })}
        dateDomId="robotFaultBydateHistory"
        originData={originData}
        keyData={keyDataMap}
      />
    </>
  );
};
export default memo(ToteQrcodeHealth);
