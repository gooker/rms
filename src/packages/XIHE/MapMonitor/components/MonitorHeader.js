import React, { memo } from 'react';
import { RightOutlined } from '@ant-design/icons';
import SelectMap from '../MapHeader/SelectMap';
import SelectLogicArea from '../MapHeader/SelectLogicArea';
import SelectRouteMap from '../MapHeader/SelectRouteMap';
import MonitorHeaderRightTools from './MonitorHeaderRightTools';
import styles from '../MapHeader/index.module.less';

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
