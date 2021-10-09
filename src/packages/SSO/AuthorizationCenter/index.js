import React, { memo } from 'react';
import { Divider } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import ApplyCode from './ApplyCode';
import UploadCert from './UploadCert';
import styles from './UploadSSOAppInfo.module.less';

const AuthorizationCenter = () => {
  return (
    <div className={styles.initPage}>
      <div className={styles.panel}>
        <div style={{ height: 50 }}>
          <Divider orientation="left">
            <FormattedMessage id="sso.init.applyCode" />
          </Divider>
        </div>
        <ApplyCode />
      </div>
      <div className={styles.panel}>
        <div style={{ height: 50 }}>
          <Divider orientation="left">
            <FormattedMessage id="sso.init.uploadCert" />
          </Divider>
        </div>
        <UploadCert />
      </div>
    </div>
  );
};
export default memo(AuthorizationCenter);
