import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { IeOutlined } from '@ant-design/icons';
import { find } from 'lodash';
import { getAllEnvironments } from '@/utils/util';
import styles from './Header.module.less';

const SelectEnvironment = () => {
  const [envName, setEnvName] = useState(null);

  useEffect(() => {
    async function getActiveEnvName() {
      const { allEnvs, activeEnv } = await getAllEnvironments(window.dbContext);
      const env = find(allEnvs, { id: activeEnv });
      setEnvName(env?.envName);
    }

    getActiveEnvName();
  }, []);

  return (
    <Tooltip title={envName} color={'#ffffff'} overlayInnerStyle={{ color: '#000000' }}>
      <span className={styles.action}>
        <IeOutlined />
      </span>
    </Tooltip>
  );
};
export default memo(SelectEnvironment);
