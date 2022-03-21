import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { AppCode } from '@/config/config';
import CommonPortal from './PortalEntry';
import styles from './Portal.module.less';
import { formatMessage } from '@/utils/util';

const Portal = (props) => {
  const { dispatch, isAdmin, grantedAPP, currentApp } = props;

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
        {getAppList().map((appCode) => (
          <CommonPortal
            key={appCode}
            code={appCode}
            name={formatMessage({ id: `app.module.${appCode}` })}
            currentApp={currentApp}
            checkoutApp={checkoutApp}
          />
        ))}
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
