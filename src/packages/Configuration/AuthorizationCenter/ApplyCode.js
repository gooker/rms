import React, { memo, useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { saveAs } from 'file-saver';
import FormattedMessage from '@/components/FormattedMessage';
import { getApplyToken } from '@/services/SSOService';
import { dealResponse, formatMessage } from '@/utils/util';
import styles from './UploadSSOAppInfo.module.less';

// 获取申请码
const ApplyCode = (props) => {
  const { autoDownload } = props;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    autoDownload && applyAppCode();
  }, []);

  async function applyAppCode() {
    setLoading(true);
    const res = await getApplyToken();
    if (dealResponse(res)) {
      message.error(formatMessage({ id: 'app.authCenter.init.apply.failed' }));
    } else {
      const blob = new Blob([res?.applyToken], { type: 'text/plain;charset=utf-8;' });
      saveAs(blob, 'auth_apply_token.txt');
    }
    setLoading(false);
  }

  return (
    <div className={styles.applyCode}>
      <div
        style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 13, paddingLeft: '5%' }}
      >
        <Button type="primary" loading={loading} onClick={applyAppCode}>
          <FormattedMessage id="app.button.download" />
        </Button>
        <Button type="link">
          <FormattedMessage id="app.authCenter.init.nextStepWithCert" />
        </Button>
      </div>
    </div>
  );
};
export default memo(ApplyCode);
