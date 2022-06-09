import React, { memo } from 'react';
import { sortBy } from 'lodash';
import CommonPortal from './PortalEntry';
import { connect } from '@/utils/RmsDva';
import { AppCode } from '@/config/config';
import { formatMessage } from '@/utils/util';
import styles from './Portal.module.less';

const Portal = (props) => {
  const { dispatch, isAdmin, grantedAPP, currentApp } = props;

  function checkoutApp(appCode) {
    dispatch({ type: 'global/saveCurrentApp', payload: appCode });
  }

  function getAppList() {
    if (!Array.isArray(grantedAPP) || grantedAPP.length === 0) return [];
    if (isAdmin) {
      // 如果是admin账户登录，就只显示SSO APP
      return grantedAPP.filter((item) => item === AppCode.SSO);
    }
    // 对grantedAPP进行排序，提高与用户体验
    const baseOrder = Object.keys(AppCode);
    let sortedSeed = grantedAPP.map((item) => ({
      code: item,
      index: baseOrder.indexOf(item),
    }));
    sortedSeed = sortBy(sortedSeed, ['index']).map(({ code }) => code);
    return sortedSeed;
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
