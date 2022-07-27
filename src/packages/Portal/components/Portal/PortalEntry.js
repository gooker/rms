import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { find } from 'lodash';
import { formatMessage, isNull } from '@/utils/util';
import { AppCode } from '@/config/config';
import styles from './Portal.module.less';

const CommonPortal = (props) => {
  const Apps = [
    {
      code: AppCode.Map,
      label: formatMessage({ id: 'app.module.Map' }),
      desc: formatMessage({ id: 'app.module.Map.desc' }),
    },
    {
      code: AppCode.ResourceManage,
      label: formatMessage({ id: 'app.module.ResourceManage' }),
      desc: formatMessage({ id: 'app.module.ResourceManage.desc' }),
    },
    {
      code: AppCode.SmartTask,
      label: formatMessage({ id: 'app.module.SmartTask' }),
      desc: formatMessage({ id: 'app.module.SmartTask.desc' }),
    },
    {
      code: AppCode.Configuration,
      label: formatMessage({ id: 'app.module.Configuration' }),
      desc: formatMessage({ id: 'app.module.Configuration.desc' }),
    },
    {
      code: AppCode.DevOps,
      label: formatMessage({ id: 'app.module.DevOps' }),
      desc: formatMessage({ id: 'app.module.DevOps.desc' }),
    },
    {
      code: AppCode.Report,
      label: formatMessage({ id: 'app.module.Report' }),
      desc: formatMessage({ id: 'app.module.Report.desc' }),
    },
    {
      code: AppCode.SSO,
      label: formatMessage({ id: 'app.module.SSO' }),
      desc: formatMessage({ id: 'app.module.SSO.desc' }),
    },
  ];

  const { code, currentApp, checkoutApp } = props;
  const appConfig = find(Apps, { code });
  if (isNull(appConfig)) {
    console.warn(`[RMS]: Unrecognized application code -> ${code}`);
    return null;
  }
  const { label, desc } = appConfig;
  return (
    <Tooltip key={code} title={desc} placement='rightTop'>
      <div
        className={styles.portalItem}
        style={{ background: currentApp === code ? '#3f57a1' : '#515151' }}
        onClick={() => {
          checkoutApp(code);
        }}
      >
        {label}
      </div>
    </Tooltip>
  );
};
export default memo(CommonPortal);
