import React, { memo } from 'react';
import commonStyles from '@/common.module.less';

const MonitorMask = () => {
  return <div id={'monitorMask'} className={commonStyles.mapSelectionMask} />;
};
export default memo(MonitorMask);
