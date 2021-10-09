import React, { memo, useState } from 'react';
import { Button, message } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import UploadPanel from '@/components/UploadPanel';
import { dealResponse, isStrictNull,formatMessage } from '@/utils/utils';
import { uploadCertication } from '@/services/user';
import styles from './UploadSSOAppInfo.module.less';

const UploadCert = () => {
  const [certication, setCertication] = useState(null);

  async function upload() {
    const res = await uploadCertication(certication);
    if (dealResponse(res)) {
      message.error(formatMessage({ id: 'sso.init.upload.failed' }));
    } else {
      message.success(formatMessage({ id: 'sso.init.upload.success' }));
    }
  }

  return (
    <div className={styles.uploadCert}>
      <UploadPanel
        styles={{ flex: 1 }}
        remove={() => {
          setCertication(null);
        }}
        analyzeFunction={(evt) => {
          try {
            setCertication(evt.target.result);
          } catch (error) {
            message.error(formatMessage({ id: 'app.groupManage.tip.fileError' }));
          }
        }}
      />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 30 }}>
        <Button type="primary" disabled={isStrictNull(certication)} onClick={upload}>
          <FormattedMessage id="sso.init.upload" />
        </Button>
      </div>
    </div>
  );
};
export default memo(UploadCert);
