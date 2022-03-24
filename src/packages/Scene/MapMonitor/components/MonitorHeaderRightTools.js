import React, { memo, useState } from 'react';
import { Divider, Tooltip, Modal } from 'antd';
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
import LocationTracking from '../Modal/LocationTracking';
import DownLoadMRV from '../Modal/DownLoadMRV';
import DashBoard from '../DashBoard';

const MonitorHeaderRightTools = (props) => {
  const { dispatch, isInnerFullscreen, positionVisible, dashBoardVisible } = props;

  const [downLoadVisible, setDownLoadVisble] = useState(false);

  function changeInnerFullScreen(payload) {
    dispatch({ type: 'global/changeInnerFullScreen', payload });
  }
  function switchPositionModal(visible) {
    dispatch({ type: 'monitor/savePositionVisible', payload: visible });
  }

  function switchDownLoadnModal(visible) {
    setDownLoadVisble(visible);
  }

  function switchDashboard(visible) {
    dispatch({ type: 'monitorView/saveDashBoardVisible', payload: visible });
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
        <AimOutlined
          onClick={() => {
            switchPositionModal(true);
          }}
        />
      </Tooltip>
      <Divider type="vertical" />

      {/* MRV */}
      <Tooltip title={formatMessage({ id: 'monitor.MRV' })} placement={'bottom'}>
        <CloudDownloadOutlined
          onClick={() => {
            switchDownLoadnModal(true);
          }}
        />
      </Tooltip>
      <Divider type="vertical" />

      {/* Dashboard */}
      <Tooltip title={formatMessage({ id: 'monitor.dashboard' })} placement={'bottom'}>
        <DashboardOutlined
          onClick={() => {
            switchDashboard(true);
          }}
        />
      </Tooltip>

      {/* 定位 */}
      <Modal
        destroyOnClose
        visible={positionVisible}
        width={400}
        onCancel={() => {
          switchPositionModal(false);
        }}
        title={formatMessage({ id: 'monitor.location' })}
        footer={null}
      >
        <LocationTracking />
      </Modal>
      <Modal
        destroyOnClose
        visible={downLoadVisible}
        width={400}
        onCancel={() => {
          switchDownLoadnModal(false);
        }}
        title={'MRV'}
        footer={null}
      >
        <DownLoadMRV />
      </Modal>

      {/* 仪表盘 */}
      {dashBoardVisible && <DashBoard />}
    </>
  );
};
export default connect(({ global, monitor, monitorView }) => ({
  isInnerFullscreen: global.isInnerFullscreen,
  positionVisible: monitor.positionVisible,
  dashBoardVisible: monitorView.dashBoardVisible,
}))(memo(MonitorHeaderRightTools));
