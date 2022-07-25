import React, { memo } from 'react';
import { Tooltip } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { fetchGlobalExtraData } from '@/utils/init';
import styles from './Header.module.less';
import { formatMessage } from '@/utils/util';

const ReloadGlobalResource = ({ globalFetching }) => {
  return (
    <Tooltip
      title={formatMessage({ id: 'app.header.refreshGlobal' })}
      color={'#ffffff'}
      overlayInnerStyle={{ color: '#000000' }}
    >
      <span className={styles.action}>
        <ReloadOutlined onClick={fetchGlobalExtraData} spin={globalFetching} />
      </span>
    </Tooltip>
  );
};
export default connect(({ global }) => ({
  globalFetching: global.globalFetching,
}))(memo(ReloadGlobalResource));
