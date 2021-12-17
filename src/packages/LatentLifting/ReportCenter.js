import React, { memo } from 'react';
import ReportCenterComponent from '@/pages/ReportCenter/ReportCenterComponent';
import { AGVType } from '@/config/config';

const ReportCenter = () => {
  return <ReportCenterComponent agvType={AGVType.LatentLifting} />;
};
export default memo(ReportCenter);
