import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { AppCode } from '@/config/config';
import PortalEntry from './PortalEntry';
import styles from './Portal.module.less';

const { I18N, SSO, XIHE, Mixrobot, LatentLifting, Tote, Sorter, ForkLifting } = PortalEntry;

const Portal = (props) => {
  const { dispatch, isAdmin, appList, currentApp, customLogo } = props;

  async function checkoutApp(appCode) {
    dispatch({ type: 'global/saveCurrentApp', payload: appCode });
  }

  function getAppList() {
    if (!Array.isArray(appList) || appList.length === 0) return [];

    // 如果是admin账户登录，就只显示SSO APP
    if (isAdmin) {
      return appList.filter((item) => item === AppCode.SSO);
    }

    // 顺序: XIHE, Latent, Tote, Sorter, I18N,SSO
    const grantedApps = [];
    if (appList.includes(AppCode.XIHE)) {
      grantedApps.push(AppCode.XIHE);
    }
    if (appList.includes(AppCode.LatentLifting)) {
      grantedApps.push(AppCode.LatentLifting);
    }
    if (appList.includes(AppCode.Tote)) {
      grantedApps.push(AppCode.Tote);
    }
    if (appList.includes(AppCode.Sorter)) {
      grantedApps.push(AppCode.Sorter);
    }
    if (appList.includes(AppCode.I18N)) {
      grantedApps.push(AppCode.I18N);
    }
    if (appList.includes(AppCode.SSO)) {
      grantedApps.push(AppCode.SSO);
    }
    return grantedApps;
  }

  function renderAppInfo() {
    const grantedApps = getAppList();
    return (
      <>
        {grantedApps.map((appCode) => {
          if (appCode === AppCode.LatentLifting) {
            return (
              <LatentLifting
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={45}
                height={40}
              />
            );
          }
          if (appCode === AppCode.Tote) {
            return (
              <Tote
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={45}
                height={40}
              />
            );
          }
          if (appCode === AppCode.ForkLifting) {
            return (
              <ForkLifting
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={45}
                height={40}
              />
            );
          }
          if (appCode === AppCode.Sorter) {
            return (
              <Sorter
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={45}
                height={40}
              />
            );
          }

          if (appCode === AppCode.I18N) {
            return (
              <I18N
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={45}
                height={40}
              />
            );
          }
          if (appCode === AppCode.SSO) {
            return (
              <SSO
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={45}
                height={40}
              />
            );
          }
          if (appCode === AppCode.XIHE) {
            // 如果是自定义的Logo，就显示M
            if (customLogo) {
              return (
                <Mixrobot
                  key={appCode}
                  currentApp={currentApp}
                  checkoutApp={checkoutApp}
                  name={appCode}
                  width={45}
                  height={40}
                />
              );
            }
            return (
              <XIHE
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={45}
                height={40}
              />
            );
          }
        })}
      </>
    );
  }

  return <div className={styles.portal}>{renderAppInfo()}</div>;
};
export default connect(({ global, user }) => {
  const isAdmin = user?.currentUser?.username === 'admin';
  return {
    isAdmin,
    customLogo: !!global.logo,
    appList: global.grantedAPP,
    currentApp: global.currentApp,
  };
})(memo(Portal));
