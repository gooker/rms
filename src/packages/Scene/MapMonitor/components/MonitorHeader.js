import React, { memo } from 'react';
import { RightOutlined } from '@ant-design/icons';
import SelectMap from '../HeaderItems/SelectMap';
import SelectLogicArea from '../HeaderItems/SelectLogicArea';
import SelectRouteMap from '../HeaderItems/SelectRouteMap';
import MonitorHeaderRightTools from './MonitorHeaderRightTools';
import styles from '../HeaderItems/index.module.less';

const MonitorHeader = (props) => {
  const {} = props;
  return (
    <>
      <div className={styles.mapSwitcher}>
        <SelectMap />

        <RightOutlined style={{ opacity: '0.4' }} />
        <SelectLogicArea />

        <RightOutlined style={{ opacity: '0.4' }} />
        <SelectRouteMap />
      </div>
      <div className={styles.mapHeaderTools}>
        <MonitorHeaderRightTools />
      </div>
    </>
  );
};
export default memo(MonitorHeader);
