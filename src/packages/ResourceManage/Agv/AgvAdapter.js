import React, { memo, useEffect, useState } from 'react';
import commonStyle from '@/common.module.less';
import { fetchAllAdaptor } from '@/services/resourceManageAPI';
import { dealResponse, formatMessage } from '@/utils/util';

const AgvAdapter = (props) => {
  const {} = props;
  const [datasource, setDatasource] = useState([]);

  useEffect(() => {
    fetchAllAdaptor().then((response) => {
      if (!dealResponse(response, false, formatMessage({ id: 'app.message.fetchDataFailed' }))) {
        setDatasource(response);
      }
    });
  }, []);

  return <div className={commonStyle.commonPageStyle}>111</div>;
};
export default memo(AgvAdapter);
