import React, { memo, useEffect, useState } from 'react';
import { useMount } from 'ahooks';
import { connect } from '@/utils/RmsDva';
import { mockData } from '@/packages/SSO/CustomMenuManager/components/mockData';
import { parseUrlParams } from '@/utils/util';
import commonStyle from '@/common.module.less';
import { find } from 'lodash';

const LoadIframeComponent = (props) => {
  const [currentData, setCurrentData] = useState({});
  const { location, currentUser } = props;

  let params = {
    sectionId: window.localStorage.getItem('sectionId'),
    userName: currentUser.username,
    token: window.sessionStorage.getItem('token'),
  };
  useEffect(() => {
    if (location && location?.pathname) {
      let newMockData = [];
      // 处理自定义的菜单 start
      const startsBase = '@@_';
      mockData.map((data) => {
        const { parentPath, key } = data;
        let newPath = parentPath;
        if (parentPath.startsWith(startsBase)) {
          newPath = parentPath.replace(startsBase, '/');
        }
        newMockData.push({
          ...data,
          newPathName: `${newPath}/${key}`,
          url: parseUrlParams(data.url, params),
        });
      });

      const currentData = find(newMockData, { newPathName: location.pathname });
      setCurrentData(currentData);
    }
  }, []);

  useMount(() => {
    document.body.addEventListener('message', receiver);
    return () => {
      document.body.removeEventListener('message', receiver);
    };
  });

  function receiver(e) {
    e.source.postMessage('received', e.origin); //向原网页返回信息
  }
  const iframeLoaded = () => {
    const iframeDOM = document.getElementById(`${currentData.name}${currentData.key}newTestLog`);
    if (iframeDOM) {
      const iframeMessage = {
        type: 'init',
      };
      iframeDOM.contentWindow.postMessage(iframeMessage, '*');
    }
  };
  return (
    <div className={commonStyle.commonPageStyle}>
      <iframe
        seamless
        title={currentData.name}
        src={currentData?.url}
        name={`${currentData.name}?${new Date().getTime()}`}
        id={`${currentData.name}${currentData.key}newTestLog`}
        width="100%"
        height="100%"
        frameBorder="0"
        marginWidth="0"
        marginHeight="0"
        onLoad={iframeLoaded}
        style={{ width: '100%', border: 'medium none', margin: 0, padding: 0 }}
      />
    </div>
  );
};
export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(memo(LoadIframeComponent));
