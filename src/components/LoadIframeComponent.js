import React, { memo, useEffect, useState } from 'react';
import { find } from 'lodash';
import { connect } from '@/utils/RmsDva';
import { parseUrlParams } from '@/utils/util';
import commonStyle from '@/common.module.less';
import { mockData } from '@/packages/Configuration/CustomMenuManager/components/mockData';

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

  return (
    <div className={commonStyle.commonPageStyleNoPadding}>
      <iframe
        seamless
        title={currentData.name}
        src={currentData?.url}
        name={`${currentData.name}?${new Date().getTime()}`}
        id={`${currentData.name}${currentData.key}newTestLog`}
        width='100%'
        height='100%'
        style={{ width: '100%', border: 'medium none', margin: 0, padding: 0 }}
      />
    </div>
  );
};
export default connect(({ user }) => ({
  currentUser: user.currentUser,
}))(memo(LoadIframeComponent));
