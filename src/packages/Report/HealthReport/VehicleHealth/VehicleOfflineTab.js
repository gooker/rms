import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import OfflineOrStatusErrorComponent from './components/OfflineOrStatusErrorComponent';

const VehicleOfflineComponent = (props) => {
  const { originData, keyDataMap, activeTab, originIds } = props;
  return (
    <OfflineOrStatusErrorComponent
      codeDomId="offlineHealthByVehicleIdHistory"
      chartTitle={formatMessage({ id: 'reportCenter.vehicle.offline' })}
      chartSubTitle={formatMessage({ id: 'reportCenter.way.vehicle' })}
      dateDomId="offlineHealthBydateHistory"
      originData={originData}
      keyData={keyDataMap}
      activeTab={activeTab}
      originIds={originIds}
    />
  );
};
export default memo(VehicleOfflineComponent);
