import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import ScanOrFaultComponent from './components/ScanOrFaultComponent';

const ToteQrcodeHealth = (props) => {
  const { originData,keyDataMap } = props;
  return (
    <>
      <ScanOrFaultComponent
        codeDomId="scancodeByAgvIdHistory"
        chartTitle={formatMessage({ id: 'reportCenter.robot.scancode' })}
        chartSubTitle={formatMessage({ id: 'reportCenter.way.agv' })}
        dateDomId="scancodeByDateHistory"
        originData={originData}
        keyData={keyDataMap}
      />
    </>
  );
};
export default memo(ToteQrcodeHealth);
