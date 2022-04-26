import React, { memo, useEffect, useState } from 'react';
import { fetchAllRobotType } from '@/services/resourceManageAPI';
import { dealResponse, formatMessage } from '@/utils/util';
import commonStyle from '@/common.module.less';

const CustomAgvType = (props) => {
  const {} = props;
  const [datasource, setDatasource] = useState([]);

  useEffect(() => {
    fetchAllRobotType().then((response) => {
      if (!dealResponse(response, false, formatMessage({ id: 'app.message.fetchDataFailed' }))) {
        setDatasource(response);
      }
    });
  }, []);

  return <div className={commonStyle.commonPageStyle}>111</div>;
};
export default memo(CustomAgvType);
