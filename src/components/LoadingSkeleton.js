import React, { memo } from 'react';
import commonStyle from '@/common.module.less';

const LoadingSkeleton = () => {
  return (
    <div className={commonStyle.flexCenter} style={{ height: '100vh' }}>
      <img
        alt={'loading'}
        src={'/images/global_loading.gif'}
        style={{ width: '80px', height: 'auto' }}
      />
    </div>
  );
};
export default memo(LoadingSkeleton);
