import React, { memo } from 'react';
import classNames from 'classnames';
import { find } from 'lodash';
import { Tooltip } from 'antd';
import { GlobalOutlined, UserOutlined } from '@ant-design/icons';
import { AppCode } from '@/config/config';
import styles from './Portal.module.less';
import { isNull } from '@/utils/util';

const Apps = [
  {
    code: AppCode.I18N,
    icon: <GlobalOutlined />,
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.SSO,
    icon: <UserOutlined />,
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.LatentTote,
    width: '90%',
    height: '65%',
  },
  {
    code: AppCode.LatentPod,
    width: '90%',
    height: '65%',
  },
  {
    code: AppCode.Tote,
    width: '60%',
    height: '80%',
  },
  {
    code: AppCode.FlexibleSorting,
    width: '100%',
    height: '80%',
  },
  {
    code: AppCode.ForkLift,
    width: '90%',
    height: '80%',
  },
  {
    code: AppCode.ResourceManage,
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.SmartTask,
    width: '90%',
    height: '80%',
  },
  {
    code: AppCode.Scene,
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.Cleaning,
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.AgvManned,
    width: '75%',
    height: '77%',
  },
  {
    code: AppCode.Tool,
    width: '70%',
    height: '70%',
  },
  {
    code: AppCode.Strategy,
    width: '80%',
    height: '70%',
  },
  {
    code: AppCode.Report,
    width: '73%',
    height: '73%',
  },
  {
    code: AppCode.Customized,
    width: '70%',
    height: '70%',
  },
];

const CommonPortal = (props) => {
  const { name, code, currentApp, checkoutApp } = props;
  const appConfig = find(Apps, { code });
  if (isNull(appConfig)) {
    console.log(`未识别的应用编码: ${code}`);
    return null;
  }
  const { color, icon, width, height } = appConfig;
  return (
    <Tooltip title={name} placement={'right'}>
      <div key={name} className={styles.portalItem}>
        <div
          onClick={() => {
            checkoutApp(code);
          }}
          className={classNames(styles.portalItemContainer, styles.selectApp)}
        >
          <div style={{ width, height }}>
            {icon ? (
              icon
            ) : (
              <img alt={code} src={require(`@/../public/images/${code}.png`).default} />
            )}
          </div>
        </div>
        <div />
        <div style={currentApp === code ? { background: 'rgb(105 171 255)' } : {}} />
      </div>
    </Tooltip>
  );
};
export default memo(CommonPortal);
