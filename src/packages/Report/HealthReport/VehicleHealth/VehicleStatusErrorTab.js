import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import OfflineOrStatusErrorComponent from './components/OfflineOrStatusErrorComponent';

const VehicleErrorComponent = (props) => {
  const { originData, keyDataMap, activeTab, originIds } = props;
  return (
    <OfflineOrStatusErrorComponent
      codeDomId="statusErrorHealthByVehicleIdHistory"
      chartTitle={formatMessage({ id: 'reportCenter.vehicle.error' })}
      chartSubTitle={formatMessage({ id: 'reportCenter.way.vehicle' })}
      dateDomId="statusErrorHealthBydateHistory"
      originData={originData}
      keyData={keyDataMap}
      activeTab={activeTab}
      originIds={originIds}
    />
  );
};
export default memo(VehicleErrorComponent);
