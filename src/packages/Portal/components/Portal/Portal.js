import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { AppCode } from '@/config/config';
import PortalEntry from './PortalEntry';
import styles from './Portal.module.less';

const { I18N, SSO, XIHE, Mixrobot, LatentLifting, Tote, Sorter, ForkLifting } = PortalEntry;

const PortalWidth = 25;
const PortalHeight = 25;

const Portal = (props) => {
  const { dispatch, isAdmin, grantedAPP, currentApp, customLogo } = props;

  async function checkoutApp(appCode) {
    dispatch({ type: 'global/saveCurrentApp', payload: appCode });
  }

  function getAppList() {
    if (!Array.isArray(grantedAPP) || grantedAPP.length === 0) return [];

    // 如果是admin账户登录，就只显示SSO APP
    if (isAdmin) {
      return grantedAPP.filter((item) => item === AppCode.SSO);
    }

    // I18N,SSO 排在最后
    const appList = [...grantedAPP].filter((item) => ![AppCode.SSO, AppCode.I18N].includes(item));
    if (grantedAPP.includes(AppCode.I18N)) {
      appList.push(AppCode.I18N);
    }
    appList.push(AppCode.SSO);
    return appList;
  }

  function renderAppInfo() {
    return (
      <>
        {getAppList().map((appCode) => {
          if (appCode === AppCode.LatentLifting) {
            return (
              <LatentLifting
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={PortalWidth}
                height={PortalHeight}
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
                width={PortalWidth}
                height={PortalHeight}
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
                width={PortalWidth}
                height={PortalHeight}
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
                width={PortalWidth}
                height={PortalHeight}
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
                width={PortalWidth}
                height={PortalHeight}
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
                width={PortalWidth}
                height={PortalHeight}
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
                  width={PortalWidth}
                  height={PortalHeight}
                />
              );
            }
            return (
              <XIHE
                key={appCode}
                currentApp={currentApp}
                checkoutApp={checkoutApp}
                name={appCode}
                width={PortalWidth}
                height={PortalHeight}
              />
            );
          }

          return (
            <XIHE
              key={appCode}
              currentApp={currentApp}
              checkoutApp={checkoutApp}
              name={appCode}
              width={PortalWidth}
              height={PortalHeight}
            />
          );
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
    grantedAPP: global.grantedAPP,
    currentApp: global.currentApp,
  };
})(memo(Portal));
