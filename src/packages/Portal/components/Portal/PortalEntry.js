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
    width: '90%',
    height: '65%',
  },
  {
    code: AppCode.LatentPod,
    color: '#2bb656',
    width: '90%',
    height: '65%',
  },
  {
    code: AppCode.Tote,
    color: '#4caf50',
    width: '60%',
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
    width: '90%',
    height: '80%',
  },
  {
    code: AppCode.ResourceManage,
    color: '#e6d833',
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
    color: '#b25500',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.Cleaning,
    color: '#76c7fd',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.AgvManned,
    color: '#c4c43b',
    width: '75%',
    height: '77%',
  },
  {
    code: AppCode.Tool,
    color: '#3f51b5',
    width: '80%',
    height: '80%',
  },
  {
    code: AppCode.Strategy,
    color: '#00c424',
    width: '80%',
    height: '70%',
  },
  {
    code: AppCode.Report,
    color: '#298914',
    width: '73%',
    height: '73%',
  },
  {
    code: AppCode.Customized,
    color: '#0099FF',
    width: '70%',
    height: '70%',
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
        <div style={currentApp === code ? { background: color } : {}} />
      </div>
    </Tooltip>
  );
};
export default memo(CommonPortal);
