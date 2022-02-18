import React, { memo, useState } from 'react';
import { Button, message } from 'antd';
import UploadPanel from '@/components/UploadPanel';
import FormattedMessage from '@/components/FormattedMessage';
import { uploadCertification } from '@/services/SSO';
import { dealResponse, formatMessage, isStrictNull } from '@/utils/util';
import styles from './UploadSSOAppInfo.module.less';

const UploadCert = () => {
  const [certification, setCertification] = useState(null);

  async function upload() {
    const res = await uploadCertification(JSON.parse(certification));
    if (dealResponse(res)) {
      message.error(formatMessage({ id: 'app.message.operateFailed' }));
    } else {
      message.success(formatMessage({ id: 'app.authCenter.updateAuth.successTip' }));
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  }

  return (
    <div className={styles.uploadCert}>
      <UploadPanel
        styles={{ flex: 1 }}
        remove={() => {
          setCertification(null);
        }}
        analyzeFunction={(evt) => {
          try {
            setCertification(evt.target.result);
          } catch (error) {
            message.error(formatMessage({ id: 'app.message.fileCorrupted' }));
          }
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
        <Button type="primary" disabled={isStrictNull(certification)} onClick={upload}>
          <FormattedMessage id="app.button.upload" />
        </Button>
      </div>
    </div>
  );
};
export default memo(UploadCert);
