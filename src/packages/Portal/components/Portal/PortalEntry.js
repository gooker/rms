import React, { memo } from 'react';
import classNames from 'classnames';
import { find } from 'lodash';
import { Tooltip } from 'antd';
import { GlobalOutlined, UserOutlined } from '@ant-design/icons';
import { AppCode } from '@/config/config';
import styles from './Portal.module.less';

const Apps = [
  {
    code: AppCode.I18N,
    icon: <GlobalOutlined />,
    color: '#0099FF',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.SSO,
    icon: <UserOutlined />,
    color: '#993366',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.LatentTote,
    color: '#03a9f4',
    width: '95%',
    height: '70%',
  },
  {
    code: AppCode.LatentPod,
    color: '#2bb656',
    width: '95%',
    height: '70%',
  },
  {
    code: AppCode.Tote,
    color: '#4caf50',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.FlexibleSorting,
    color: '#0dd0d9',
    width: '100%',
    height: '80%',
  },
  {
    code: AppCode.ForkLift,
    color: '#80b600',
    width: '95%',
    height: '80%',
  },
  {
    code: AppCode.ResourceManage,
    color: '#0099FF',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.SmartTask,
    color: '#c7a62c',
    width: '90%',
    height: '80%',
  },
  {
    code: AppCode.Scene,
    color: '#0099FF',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.Cleaning,
    color: '#0099FF',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.AgvManned,
    color: '#c4c43b',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.Tool,
    color: '#0099FF',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.Strategy,
    color: '#0099FF',
    width: '80%',
    height: '70%',
  },
  {
    code: AppCode.Report,
    color: '#0099FF',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.Customized,
    color: '#0099FF',
    width: '80%',
    height: '80%',
  },
];

const CommonPortal = (props) => {
  const { name, code, currentApp, checkoutApp } = props;
  const { color, icon, width, height } = find(Apps, { code });
  return (
    <Tooltip title={name} placement={'right'}>
      <div key={name} className={styles.portalItem}>
        <div
          onClick={() => {
            checkoutApp(code);
          }}
          className={classNames(styles.portalItemContainer, styles.selectApp)}
          style={{ background: color }}
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
        <div>11</div>
      </div>
    </Tooltip>
  );
};
export default memo(CommonPortal);
