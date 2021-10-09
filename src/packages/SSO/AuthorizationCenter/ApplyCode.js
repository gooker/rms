import React, { memo, useState } from 'react';
import { Input, Button, message } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { getApplyToken } from '@/services/user';
import { dealResponse, isNull ,formatMessage} from '@/utils/utils';
import styles from './UploadSSOAppInfo.module.less';

// 获取申请码
const ApplyCode = () => {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState(null);

  async function applyAppCode() {
    setLoading(true);
    const res = await getApplyToken();
    if (dealResponse(res)) {
      message.error(formatMessage({ id: 'sso.init.apply.failed' }));
    } else {
      setCode(res?.applyToken);
    }
    setLoading(false);
  }
  return (
    <div className={styles.applyCode}>
      <Input.TextArea value={code} />
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 13 }}>
        <Button type="primary" loading={loading} onClick={applyAppCode} disabled={!isNull(code)}>
          <FormattedMessage id="sso.init.apply" />
        </Button>
        <Button type="link">
          <FormattedMessage id="sso.init.nextStepWithCert" />
        </Button>
      </div>
    </div>
  );
};
export default memo(ApplyCode);
