import React, { memo, useState, useEffect } from 'react';
import commonStyles from '@/common.module.less';
import { getContentHeight, getRandomString } from '@/utils/util';
import EventManager from '@/utils/EventManager';

const TablePageWrapper = (props) => {
  const [tool, table, ...restChildren] = props.children;

  const [pageHeight, setPageHeight] = useState(getContentHeight());

  useEffect(() => {
    const functionId = getRandomString(8);
    function resize(rect) {
      setPageHeight(rect.height);
    }
    EventManager.subscribe('resize', resize, functionId);
    return () => {
      EventManager.unsubscribe('resize', functionId);
    };
  }, []);

  return (
    <div
      className={commonStyles.commonPageStyle}
      style={{ height: pageHeight, ...(props.style || {}) }}
    >
      <div>{tool}</div>
      <div className={commonStyles.tableWrapper}>{table}</div>
      <div>{restChildren}</div>
    </div>
  );
};
export default memo(TablePageWrapper);
