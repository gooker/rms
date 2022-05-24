import React, { memo } from 'react';
import { connect } from '@/utils/RmsDva';
import { NameSpace } from '@/config/config';
import { getDomainNameByUrl } from '@/utils/util';
import commonStyle from '@/common.module.less';

const IntegrationLogManagement = (props) => {
  const { currentUser } = props;
  const currentUrl = `/${NameSpace.Platform}/log-explorer/file-explorer?dir=/Users/${currentUser.username}/logs`;
  const currentData = {
    name: '日志浏览',
    url: getDomainNameByUrl(currentUrl),
    key: 'logView',
  };
  const iframeLoaded = () => {
    const iframeDOM = document.getElementById(`${currentData.name}${currentData.key}newTestLog`);
    if (iframeDOM) {
      const iframeMessage = {
        type: 'init',
      };
      iframeDOM.contentWindow.postMessage(iframeMessage, '*');
    }
  };

  function validatePws(_, value) {
    var regex = /^\S*(?=\S{12,})(?=\S*\d)(?=\S*[A-Z])(?=\S*[a-z])(?=\S*[!@#$%^&*? ])\S*$/;
    if (value && !regex.test(value)) {
      if (value.length < 12) {
        return Promise.reject(new Error('密码必须至少为 12 个字符'));
      }
      return Promise.reject(new Error('密码必须包含大写、小写、数字和特殊字符'));
    }
    return Promise.resolve();
  }

  return (
    <div className={commonStyle.commonPageStyle}>
      <iframe
        seamless
        src={
          'http://192.168.0.80:8088/platform/log-explorer/file-explorer?dir=/Users/wangrifeng/logs'
        }
        title={currentData.name}
        name={`${currentData.name}?${new Date().getTime()}`}
        id={`${currentData.name}${currentData.key}newTestLog`}
        width="100%"
        height="100%"
        frameBorder="0"
        onLoad={iframeLoaded}
        style={{ width: '100%', border: 'medium none' }}
      />
    </div>
  );
};
export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(memo(IntegrationLogManagement));
