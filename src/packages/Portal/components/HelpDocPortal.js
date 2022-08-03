import React, { memo, useEffect } from 'react';
import { connect } from '@/utils/RmsDva';
import { getSortedAppList } from '@/utils/util';
import CommonPortal from '@/packages/Portal/components/Portal/PortalEntry';
import styles from '@/packages/Portal/components/Portal/Portal.module.less';

const HelpDocPortal = (props) => {
  const { dispatch, isAdmin, grantedAPP, currentApp } = props;

  useEffect(() => {
    if (window.location.pathname === '/') {
      const { currentApp } = window.$$state().global;
      if (currentApp) {
        checkoutApp(currentApp);
      }
    } else {
      //
    }
  }, []);

  function checkoutApp(appCode) {
    dispatch({ type: 'help/updateCurrentApp', payload: appCode });
  }

  function renderAppInfo() {
    return (
      <>
        {getSortedAppList(grantedAPP, isAdmin).map((appCode) => (
          <CommonPortal
            key={appCode}
            code={appCode}
            currentApp={currentApp}
            checkoutApp={checkoutApp}
          />
        ))}
      </>
    );
  }

  return <div className={styles.portal}>{renderAppInfo()}</div>;
};
export default connect(({ global, user, help }) => {
  const isAdmin = user?.currentUser?.username === 'admin';
  return {
    isAdmin,
    grantedAPP: global.grantedAPP,
    currentApp: help.currentApp,
  };
})(memo(HelpDocPortal));
