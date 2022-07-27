import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import styles from './Header.module.less';

const HelpDoc = () => {
  return (
    <Tooltip
      title={formatMessage({ id: 'app.header.helpDoc' })}
      color={'#ffffff'}
      overlayInnerStyle={{ color: '#000000' }}
    >
      <span className={styles.action}>
        <QuestionCircleOutlined />
      </span>
    </Tooltip>
  );
};
export default memo(HelpDoc);
