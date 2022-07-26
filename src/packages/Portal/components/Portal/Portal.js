import React, { memo } from 'react';
import CommonPortal from './PortalEntry';
import { connect } from '@/utils/RmsDva';
import { getSortedAppList } from '@/utils/util';
import styles from './Portal.module.less';

const Portal = (props) => {
  const { dispatch, isAdmin, grantedAPP, currentApp } = props;

  function checkoutApp(appCode) {
    dispatch({ type: 'global/saveCurrentApp', payload: appCode });
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
export default connect(({ global, user }) => {
  const isAdmin = user?.currentUser?.username === 'admin';
  return {
    isAdmin,
    customLogo: !!global.logo,
    grantedAPP: global.grantedAPP,
    currentApp: global.currentApp,
  };
})(memo(Portal));
