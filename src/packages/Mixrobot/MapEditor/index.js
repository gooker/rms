import React, { memo } from 'react';
import commonStyles from '@/common.module.less';

const Index = (props) => {
  const {} = props;
  return (
    <div className={commonStyles.commonPageStyleNoPadding}>
      <div className={commonStyles.mapLayoutHeader}>1</div>
      <div className={commonStyles.mapLayoutBody}>
        <div className={commonStyles.mapBodyLeft}>2</div>
        <div className={commonStyles.mapBodyMiddle}>3</div>
        <div className={commonStyles.mapBodyRight}>4</div>
      </div>
    </div>
  );
};
export default memo(Index);
