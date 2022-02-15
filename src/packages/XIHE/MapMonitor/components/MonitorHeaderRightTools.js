import React, { memo } from 'react';
import { Divider, Tooltip } from 'antd';
import {
  AimOutlined,
  ReloadOutlined,
  DashboardOutlined,
  FullscreenOutlined,
  CloudDownloadOutlined,
  FullscreenExitOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';

const MonitorHeaderRightTools = (props) => {
  const { dispatch, isInnerFullscreen } = props;

  function changeInnerFullScreen(payload) {
    dispatch({ type: 'global/changeInnerFullScreen', payload });
  }

  return (
    <>
      {/* 重载 */}
      <Tooltip title={formatMessage({ id: 'monitor.reload' })} placement={'bottom'}>
        <ReloadOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* 地图全屏 */}
      <Tooltip title={formatMessage({ id: 'app.common.fullScreen' })} placement={'bottom'}>
        {isInnerFullscreen ? (
          <FullscreenExitOutlined
            onClick={() => {
              changeInnerFullScreen(false);
            }}
          />
        ) : (
          <FullscreenOutlined
            onClick={() => {
              changeInnerFullScreen(true);
            }}
          />
        )}
      </Tooltip>
      <Divider type="vertical" />

      {/* 定位 */}
      <Tooltip title={formatMessage({ id: 'monitor.location' })} placement={'bottom'}>
        <AimOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* MRV */}
      <Tooltip title={formatMessage({ id: 'monitor.MRV' })} placement={'bottom'}>
        <CloudDownloadOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* Dashboard */}
      <Tooltip title={formatMessage({ id: 'monitor.dashboard' })} placement={'bottom'}>
        <DashboardOutlined />
      </Tooltip>
    </>
  );
};
export default connect(({ global }) => ({
  isInnerFullscreen: global.isInnerFullscreen,
}))(memo(MonitorHeaderRightTools));
