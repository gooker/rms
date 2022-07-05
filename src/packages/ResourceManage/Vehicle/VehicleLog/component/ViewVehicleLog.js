import React, { memo, useEffect } from 'react';
import { Modal } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage, getDomainNameByUrl, parseUrlParams } from '@/utils/util';
import commonStyle from '@/common.module.less';
import { NameSpace } from '@/config/config';

const ViewVehicleLog = (props) => {
  const { onCancel, visible, id } = props;

  useEffect(() => {
    if (!visible) {
    }
  }, [visible]);

  const { currentUser } = props;
  // let currentUrl = `/${NameSpace.Platform}/vehicle/logs/${id}/?dir=/Users/${currentUser.username}/logs`;
  let currentUrl = `/${NameSpace.Platform}/vehicle/logs/${id}/`;
  currentUrl = getDomainNameByUrl(currentUrl);
  let params = {
    sectionId: window.localStorage.getItem('sectionId'),
    userName: currentUser.username,
    token: window.sessionStorage.getItem('token'),
  };

  const currentData = {
    name: '车辆日志',
    url: currentUrl,// parseUrlParams(currentUrl,params ),
    key: 'VehiclelogView',
  };
  const iframeLoaded = () => {
    const iframeDOM = document.getElementById(
      `${currentData.name}${currentData.key}VehiclelogView`,
    );
    if (iframeDOM) {
      const iframeMessage = {
        type: 'init',
      };
      iframeDOM.contentWindow.postMessage(iframeMessage, '*');
    }
  };

  return (
    <Modal
      destroyOnClose
      visible={visible}
      title={formatMessage({ id: 'app.logDownload' })}
      maskClosable={false}
      onCancel={onCancel}
      footer={null}
      width={'60vw'}
    >
      <div className={commonStyle.commonPageStyle}>
        <iframe
          seamless
          src={currentData.url}
          title={currentData.name}
          name={`${currentData.name}?${new Date().getTime()}`}
          id={`${currentData.name}${currentData.key}VehiclelogView`}
          width="100%"
          height="100%"
          frameBorder="0"
          onLoad={iframeLoaded}
          style={{ width: '100%', border: 'medium none' }}
        />
      </div>
    </Modal>
  );
};
export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(memo(ViewVehicleLog));
