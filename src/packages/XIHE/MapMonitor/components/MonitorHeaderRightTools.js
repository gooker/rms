import React, { memo } from 'react';
import { Divider, Tooltip } from 'antd';
import {
  AimOutlined,
  ReloadOutlined,
  DashboardOutlined,
  FullscreenOutlined,
  CloudDownloadOutlined,
} from '@ant-design/icons';
import { formatMessage } from '@/utils/utils';

const MonitorHeaderRightTools = (props) => {
  const {} = props;
  return (
    <>
      {/* 重载 */}
      <Tooltip title={formatMessage({ id: 'monitor.reload' })}>
        <ReloadOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* 地图全屏 */}
      <Tooltip title={formatMessage({ id: 'mapEditor.fullScreen' })}>
        <FullscreenOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* 定位 */}
      <Tooltip title={formatMessage({ id: 'monitor.location' })}>
        <AimOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* MRV */}
      <Tooltip title={formatMessage({ id: 'monitor.MRV' })}>
        <CloudDownloadOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* Dashboard */}
      <Tooltip title={formatMessage({ id: 'monitor.dashboard' })}>
        <DashboardOutlined />
      </Tooltip>
    </>
  );
};
export default memo(MonitorHeaderRightTools);
