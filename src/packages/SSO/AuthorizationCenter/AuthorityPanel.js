import React, { memo } from 'react';
import { Divider } from 'antd';
import ApplyCode from './ApplyCode';
import UploadCert from './UploadCert';
import styles from './UploadSSOAppInfo.module.less';
import FormattedMessage from '@/components/FormattedMessage';

const AuthorityPanel = (props) => {
  const { autoDownload } = props;

  return (
    <div className={styles.authPanel}>
      <div className={styles.unAuthTip}>
        <FormattedMessage id={'app.authCenter.unauthorized.pageTip'} />
      </div>
      <div className={styles.panel}>
        <div style={{ height: 50 }}>
          <Divider orientation="left">
            <FormattedMessage id="app.authCenter.init.applyCode" />
          </Divider>
        </div>
        <ApplyCode autoDownload={autoDownload} />
      </div>
      <div className={styles.panel}>
        <div style={{ height: 50 }}>
          <Divider orientation="left">
            <FormattedMessage id="app.authCenter.init.uploadCert" />
          </Divider>
        </div>
        <UploadCert />
      </div>
    </div>
  );
};
export default memo(AuthorityPanel);
