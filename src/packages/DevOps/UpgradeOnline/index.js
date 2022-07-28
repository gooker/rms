import React, { memo } from 'react';
import TitleCard from '@/components/TitleCard';
import UpgradeManagePanel from './component/UpgradeManagePanel';
import commonStyle from '@/common.module.less';

const UpgradeOnline = () => {
  return (
    <div className={commonStyle.commonPageStyle}>
      <TitleCard title={'前端'}>
        <UpgradeManagePanel type={'FE'} />
      </TitleCard>
      <TitleCard title={'中台'}>
        {/*<UpgradeManagePanel type={'Middle'} />*/}
        {/*<UpgradeManagePanel type={'Plugin'} />*/}
      </TitleCard>
      <TitleCard title={'历史备份'}></TitleCard>
    </div>
  );
};
export default memo(UpgradeOnline);
