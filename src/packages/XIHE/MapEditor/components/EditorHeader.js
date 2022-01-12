import React, { memo } from 'react';
import { RightOutlined } from '@ant-design/icons';
import SelectMap from '../HeaderItems/SelectMap';
import SelectLogicArea from '../HeaderItems/SelectLogicArea';
import SelectRouteMap from '../HeaderItems/SelectRouteMap';
import EditorHeaderRightTools from '../HeaderItems/EditorHeaderRightTools';
import styles from '../HeaderItems/index.module.less';

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
