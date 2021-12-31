import React, { memo, useState } from 'react';
import { Tooltip } from 'antd';
import { EditorRightTools } from '../enums';
import styles from './editorLayout.module.less';

const EditorBodyRight = (props) => {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <div className={styles.bodyRightSide}>
      {EditorRightTools.map(({ label, value, icon }) => (
        <Tooltip key={value} placement="right" title={label}>
          <div
            className={activeKey === value ? styles.rightContentActive : undefined}
            onClick={() => {
              setActiveKey(value);
            }}
          >
            {icon}
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
export default memo(EditorBodyRight);
