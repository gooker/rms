import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import styles from './Header.module.less';

const ReloadGlobalResource = () => {
  function reload() {
    //
  }

  return (
    <Tooltip title={'刷新全局资源'} color={'#ffffff'} overlayInnerStyle={{ color: '#000000' }}>
      <span className={styles.action}>
        <ReloadOutlined onClick={reload} />
      </span>
    </Tooltip>
  );
};
export default memo(ReloadGlobalResource);
