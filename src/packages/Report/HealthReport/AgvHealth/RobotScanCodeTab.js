import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import ScanOrFaultComponent from './components/ScanOrFaultComponent';

const ToteQrcodeHealth = (props) => {
  const { originData, keyDataMap, activeTab, originIds } = props;
  return (
    <ScanOrFaultComponent
      codeDomId="codeHealthByAgvIdHistory"
      chartTitle={formatMessage({ id: 'reportCenter.agv.scancode' })}
      chartSubTitle={formatMessage({ id: 'reportCenter.way.agv' })}
      dateDomId="codeHealthByDateHistory"
      originData={originData}
      keyData={keyDataMap}
      activeTab={activeTab}
      originIds={originIds}
    />
  );
};
export default memo(ToteQrcodeHealth);
