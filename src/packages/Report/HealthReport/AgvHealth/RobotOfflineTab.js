import React, { memo } from 'react';
import { formatMessage } from '@/utils/util';
import OfflineOrStatusErrorComponent from './components/OfflineOrStatusErrorComponent';

const AgvOfflineComponent = (props) => {
  const { originData, keyDataMap, activeTab, originIds } = props;
  return (
    <>
      <OfflineOrStatusErrorComponent
        codeDomId="offlineHealthByAgvIdHistory"
        chartTitle={formatMessage({ id: 'reportCenter.agv.offline' })}
        chartSubTitle={formatMessage({ id: 'reportCenter.way.agv' })}
        dateDomId="offlineHealthBydateHistory"
        originData={originData}
        keyData={keyDataMap}
        activeTab={activeTab}
        originIds={originIds}
      />
    </>
  );
};
export default memo(AgvOfflineComponent);
