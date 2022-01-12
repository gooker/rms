import React, { memo } from 'react';
import { RightOutlined } from '@ant-design/icons';
import SelectMap from '../MapHeader/SelectMap';
import SelectLogicArea from '../MapHeader/SelectLogicArea';
import SelectRouteMap from '../MapHeader/SelectRouteMap';
import EditorHeaderRightTools from '../MapHeader/EditorHeaderRightTools';
import styles from '../MapHeader/index.module.less';

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
