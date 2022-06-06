import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { IeOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { getAllEnvironments } from '@/utils/util';
import styles from './Header.module.less';

const SelectEnvironment = () => {
  const { allEnvs, activeEnv } = getAllEnvironments();
  const env = find(allEnvs, { id: activeEnv });
  return (
    <Tooltip
      title={env?.envName}
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
