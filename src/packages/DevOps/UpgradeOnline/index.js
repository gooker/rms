import React, { memo } from 'react';
import { Button, Tabs } from 'antd';
import { formatMessage } from '@/utils/util';
import { UpgradeTarget } from './contants';
import FormattedMessage from '@/components/FormattedMessage';
import UpgradeManagePanel from './component/UpgradeManagePanel';
import MiddlePlatformPanel from './component/MiddlePlatformPanel';
import commonStyle from '@/common.module.less';
import style from './upgradeOnline.module.less';
import BackupPanel from '@/packages/DevOps/UpgradeOnline/component/BackupPanel';

const { TabPane } = Tabs;

const UpgradeOnline = () => {
  return (
    <div className={commonStyle.commonPageStyle}>
      <Tabs type='card' size={'large'}>
        <TabPane
          key={UpgradeTarget.FE}
          tab={formatMessage({ id: 'upgradeOnline.frontend' })}
          style={{ paddingTop: 16 }}
        >
          <UpgradeManagePanel type={UpgradeTarget.FE} />
          <div className={style.deployBtn}>
            <Button danger>
              <FormattedMessage id={'upgradeOnline.deploy'} />
            </Button>
          </div>
        </TabPane>
        <TabPane
          key={UpgradeTarget.Middle}
          tab={formatMessage({ id: 'upgradeOnline.middlePlatform' })}
          style={{ paddingTop: 16 }}
        >
          <MiddlePlatformPanel />
        </TabPane>
        <TabPane
          key='backup'
          tab={formatMessage({ id: 'upgradeOnline.backup' })}
          style={{ paddingTop: 16 }}
        >
          <BackupPanel />
        </TabPane>
      </Tabs>
    </div>
  );
};
export default memo(UpgradeOnline);
