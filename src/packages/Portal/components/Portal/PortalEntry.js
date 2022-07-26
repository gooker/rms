import React, { memo } from 'react';
import { find } from 'lodash';
import { formatMessage, isNull } from '@/utils/util';
import { AppCode } from '@/config/config';
import styles from './Portal.module.less';

const CommonPortal = (props) => {
  const Apps = [
    {
      code: AppCode.Map,
      label: formatMessage({ id: 'app.module.Map' }),
    },
    {
      code: AppCode.ResourceManage,
      label: formatMessage({ id: 'app.module.ResourceManage' }),
    },
    {
      code: AppCode.SmartTask,
      label: formatMessage({ id: 'app.module.SmartTask' }),
    },
    {
      code: AppCode.Configuration,
      label: formatMessage({ id: 'app.module.Configuration' }),
    },
    {
      code: AppCode.DevOps,
      label: formatMessage({ id: 'app.module.DevOps' }),
    },
    {
      code: AppCode.Report,
      label: formatMessage({ id: 'app.module.Report' }),
    },
    {
      code: AppCode.SSO,
      label: formatMessage({ id: 'app.module.SSO' }),
    },
  ];

  const { code, currentApp, checkoutApp } = props;
  const appConfig = find(Apps, { code });
  if (isNull(appConfig)) {
    console.warn(`[RMS]: Unrecognized application code -> ${code}`);
    return null;
  }
  return (
    <div
      key={code}
      className={styles.portalItem}
      style={{ background: currentApp === code ? '#3f57a1' : '#515151' }}
      onClick={() => {
        checkoutApp(code);
      }}
    >
      {appConfig.label}
    </div>
  );
};
export default memo(CommonPortal);
