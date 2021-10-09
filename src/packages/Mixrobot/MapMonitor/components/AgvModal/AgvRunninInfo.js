import React, { memo, useEffect, useState } from 'react';
import { fetchAgvRunningInfo } from './AgvModalApi';
import Dictionary from '@/utils/Dictionary';
import { dealResponse, isNull } from '@/utils/utils';
import styles from './agvRunninInfo.less';

/**
 * agvRunningStatus: Normal(正常), Warning(警告), Error(异常), Stopping(完成)
 */
const { green, red, yellow, blue } = Dictionary('color', 'all');
const MessageColor = {
  Normal: green,
  Warning: yellow,
  Error: red,
  Stopping: blue,
};

const AgvRunninInfo = (props) => {
  const { agv } = props;
  const { agvId } = JSON.parse(agv);

  const [infoList, setInfoList] = useState([]);

  useEffect(() => {
    getAgvRunningInfo();
  }, []);

  async function getAgvRunningInfo() {
    const response = await fetchAgvRunningInfo({ robotId: agvId });
    if (!isNull(response) && !dealResponse(response)) {
      const newInfoList = [];
      Object.values(response).forEach(({ agvRunningStatus, agvInfoTypeI18n, detailFormat }) => {
        newInfoList.push({ type: agvRunningStatus, title: agvInfoTypeI18n, message: detailFormat });
      });
      setInfoList(newInfoList);
    }
  }

  return (
    <>
      {infoList.map((item, index) => (
        <div key={index} className={styles.agvInfoRow}>
          <div className={styles.agvInfoTitle}>
            <span
              className={styles.agvRunningState}
              style={{ background: MessageColor[item.type] }}
            />
            <span className={styles.agvInfoTitleContent}>{item.title}</span>
          </div>
          <div className={styles.agvInfoMessage}>{item.message}</div>
        </div>
      ))}
    </>
  );
};
export default memo(AgvRunninInfo);
