import React, { memo, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { NameSpace } from '@/config/config';
import { getDomainNameByUrl, parseUrlParams } from '@/utils/util';
import styles from './integration.module.less';
import commonStyle from '@/common.module.less';

const IntegrationLogManagement = (props) => {
  const { currentUser } = props;

  const [loading, setLoading] = useState(true);

  let currentUrl = `/${NameSpace.Platform}/log-explorer/file-explorer`;
  currentUrl = getDomainNameByUrl(currentUrl);

  const params = {
    userName: currentUser.username,
    token: window.sessionStorage.getItem('token'),
    sectionId: window.localStorage.getItem('sectionId'),
  };
  const currentData = {
    name: '日志浏览',
    url: parseUrlParams(currentUrl, params),
  };

  function iframeLoaded() {
    setLoading(false);
  }

  return (
    <div className={commonStyle.commonPageStyleNoPadding} style={{ background: '#fff' }}>
      <iframe
        seamless
        src={currentData.url}
        title={currentData.name}
        name={`${currentData.name}?${new Date().getTime()}`}
        width='100%'
        height='100%'
        onLoad={iframeLoaded}
        style={{ width: '100%', border: 'medium none' }}
      />
      {loading && (
        <div className={styles.loadingMask}>
          <LoadingOutlined style={{ fontSize: 40 }} />
        </div>
      )}
    </div>
  );
};
export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(memo(IntegrationLogManagement));
