import React, { memo, useState } from 'react';
import { Tooltip } from 'antd';
import classnames from 'classnames';
import { EditorLeftTools } from '../enums';
import commonStyles from '@/common.module.less';
import styles from './editorLayout.module.less';

const EditorBodyLeft = (props) => {
  const [activeKey, setActiveKey] = useState('choose');

  return (
    <div className={classnames(commonStyles.mapBodyLeft, styles.bodyLeftSide)}>
      {EditorLeftTools.map(({ label, value, icon }) => (
        <Tooltip key={value} placement="right" title={label}>
          <span
            className={activeKey === value ? styles.leftContentActive : undefined}
            onClick={() => {
              setActiveKey(value);
            }}
          >
            {icon}
          </span>
        </Tooltip>
      ))}
    </div>
  );
};
export default memo(EditorBodyLeft);
