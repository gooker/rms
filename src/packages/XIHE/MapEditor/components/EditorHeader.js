import React, { memo } from 'react';
import { RightOutlined } from '@ant-design/icons';
import SelectMap from '../../components/MapHeader/SelectMap';
import SelectLogicArea from '../../components/MapHeader/SelectLogicArea';
import SelectRouteMap from '../../components/MapHeader/SelectRouteMap';
import EditorHeaderRightTools from './EditorHeaderRightTools';
import styles from '../../components/MapHeader/index.module.less';

const EditorHeader = () => {
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
        <EditorHeaderRightTools />
      </div>
    </>
  );
};
export default memo(EditorHeader);
