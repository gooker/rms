import React, { memo, useEffect, useState } from 'react';
import { message, Modal } from 'antd';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import { getAuthorityInfo } from '@/services/SSO';
import AuthorityPanel from './AuthorityPanel';
import AuthorityInformation from './AuthorityInformation';
import commonStyles from '@/common.module.less';

/**
 * 判断授权状态
 * 1. 如果没有上传证书，那么返回值为 null
 * 2. 如果已经上传的证书，需要用 lastDay(秒) 字段判断是否过期
 */
const { confirm } = Modal;
const AuthorizationCenter = () => {
  const [authorityInfo, setAuthorityInfo] = useState('NULL');
  const [autoDownloadToken, setAutoDownloadToken] = useState(false);

  useEffect(() => {
    getAuthorityInformation();
  }, []);

  // 获取当前系统授权信息
  async function getAuthorityInformation() {
    setAutoDownloadToken(false);
    const response = await getAuthorityInfo();
    if (!dealResponse(response)) {
      setAuthorityInfo(response);
    } else {
      message.error(formatMessage({ id: 'app.authCenter.fetchInfo.failed' }));
    }
  }

  // 重新授权
  function reAuthority() {
    confirm({
      title: formatMessage({ id: 'app.message.systemHint' }),
      content: formatMessage({ id: 'app.authCenter.reAuth.warning' }),
      cancelText: formatMessage({ id: 'app.button.cancel' }),
      okText: formatMessage({ id: 'app.authCenter.continue' }),
      onOk() {
        setAuthorityInfo(null);
        setAutoDownloadToken(true);
      },
    });
  }

  // 更新授权
  function updateAuth() {
    message.success(formatMessage({ id: 'app.authCenter.updateAuth.successTip' }));
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  }

  function renderContent() {
    if (authorityInfo === 'NULL') return null;

    // 没有授权证书
    if (isNull(authorityInfo)) {
      return <AuthorityPanel autoDownload={autoDownloadToken} />;
    } else {
      // 有授权证书
      return (
        <AuthorityInformation data={authorityInfo} reAuth={reAuthority} updateAuth={updateAuth} />
      );
    }
  }

  return <div className={commonStyles.commonPageStyle}>{renderContent()}</div>;
};
export default memo(AuthorizationCenter);
