import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { IeOutlined } from '@ant-design/icons';
import { getAllEnvironments } from '@/utils/util';
import styles from './Header.module.less';

const SelectEnvironment = () => {
  const { activeEnv } = getAllEnvironments();

  return (
    <Tooltip
      title={activeEnv}
      color={'#fff'}
      overlayInnerStyle={{
        color: '#000',
      }}
    >
      <span className={styles.action}>
        <IeOutlined />
      </span>
    </Tooltip>
  );
};
export default memo(SelectEnvironment);
