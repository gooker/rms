import React, { memo } from 'react';
import UpgradeManagePanel from '@/packages/DevOps/UpgradeOnline/component/UpgradeManagePanel';
import { UpgradeTarget } from '@/packages/DevOps/UpgradeOnline/contants';
import style from '@/packages/DevOps/UpgradeOnline/upgradeOnline.module.less';
import { Button, Form } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/util';

const MiddlePlatformPanel = () => {
  return (
    <div>
      <Form.Item label={formatMessage({ id: 'upgradeOnline.middlePlatform' })}>
        <UpgradeManagePanel type={UpgradeTarget.Middle} />
      </Form.Item>
      <Form.Item label={formatMessage({ id: 'upgradeOnline.plugin' })}>
        <UpgradeManagePanel type={UpgradeTarget.Plugin} />
      </Form.Item>
      <div className={style.deployBtn}>
        <Button danger>
          <FormattedMessage id={'upgradeOnline.deploy'} />
        </Button>
      </div>
    </div>
  );
};
export default memo(MiddlePlatformPanel);
