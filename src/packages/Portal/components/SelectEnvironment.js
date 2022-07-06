import React, { memo, useEffect, useState } from 'react';
import { Modal, Tooltip } from 'antd';
import { IeOutlined } from '@ant-design/icons';
import { find, isPlainObject } from 'lodash';
import { formatMessage, getAllEnvironments } from '@/utils/util';
import styles from './Header.module.less';

const SelectEnvironment = () => {
  const [envName, setEnvName] = useState(null);
  const [allEnvironments, setAllEnvironments] = useState([]);

  useEffect(() => {
    async function getActiveEnvName() {
      const { allEnvs, activeEnv } = await getAllEnvironments(window.dbContext);
      const env = find(allEnvs, { id: activeEnv });
      setEnvName(env?.envName);
      setAllEnvironments(allEnvs);
    }

    getActiveEnvName();
  }, []);

  function showCurrentNamespace() {
    const nameSpacesInfo = window.nameSpacesInfo;
    if (isPlainObject(nameSpacesInfo)) {
      const list = Object.entries(nameSpacesInfo);
      Modal.info({
        title: formatMessage({ id: 'environmentManager.apis' }),
        content: (
          <ul>
            {list.map(([key, value], index) => (
              <li key={index}>{`${key}: ${value}`}</li>
            ))}
          </ul>
        ),
      });
    }
  }

  if (allEnvironments.length <= 1) return null;
  return (
    <Tooltip title={envName} color={'#ffffff'} overlayInnerStyle={{ color: '#000000' }}>
      <span className={styles.action}>
        <IeOutlined onClick={showCurrentNamespace} />
      </span>
    </Tooltip>
  );
};
export default memo(SelectEnvironment);
