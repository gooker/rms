import React, { memo, useState } from 'react';
import { Divider, Modal, Tooltip } from 'antd';
import {
  AimOutlined,
  DashboardOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import LocationTracking from '../Modal/LocationTracking';
import DashBoard from '../DashBoard';

const MonitorHeaderRightTools = (props) => {
  const { dispatch, isInnerFullscreen, positionVisible, dashBoardVisible } = props;

  const [MRVVisible, setMRVVisible] = useState(false);

  function changeInnerFullScreen(payload) {
    dispatch({ type: 'global/changeInnerFullScreen', payload });
  }
  function switchPositionModal(visible) {
    dispatch({ type: 'monitor/savePositionVisible', payload: visible });
  }

  function switchMRVModalVisible(visible) {
    setMRVVisible(visible);
  }

  function switchDashboard(visible) {
    dispatch({ type: 'monitorView/saveDashBoardVisible', payload: visible });
  }

  return (
    <>
      {/* 重载 */}
      <Tooltip title={formatMessage({ id: 'monitor.reload' })} placement={'top'}>
        <ReloadOutlined />
      </Tooltip>
      <Divider type="vertical" />

      {/* 地图全屏 */}
      <Tooltip title={formatMessage({ id: 'app.common.fullScreen' })} placement={'top'}>
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
      <Tooltip title={formatMessage({ id: 'monitor.location' })} placement={'top'}>
        <AimOutlined
          onClick={() => {
            switchPositionModal(true);
          }}
        />
      </Tooltip>
      <Divider type='vertical' />

      {/* MRV */}
      {/*<Tooltip title={formatMessage({ id: 'monitor.MRV' })} placement={'top'}>*/}
      {/*  <CloudDownloadOutlined*/}
      {/*    onClick={() => {*/}
      {/*      switchMRVModalVisible(true);*/}
      {/*    }}*/}
      {/*  />*/}
      {/*</Tooltip>*/}
      {/*<Divider type="vertical" />*/}

      {/* Dashboard */}
      <Tooltip title={formatMessage({ id: 'monitor.dashboard' })} placement={'top'}>
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
        width={500}
        onCancel={() => {
          switchPositionModal(false);
        }}
        title={formatMessage({ id: 'monitor.location' })}
        footer={null}
      >
        <LocationTracking />
      </Modal>

      {/* MRV 下载*/}
      {/*<Modal*/}
      {/*  destroyOnClose*/}
      {/*  visible={MRVVisible}*/}
      {/*  width={400}*/}
      {/*  onCancel={() => {*/}
      {/*    switchMRVModalVisible(false);*/}
      {/*  }}*/}
      {/*  title={'MRV'}*/}
      {/*  footer={null}*/}
      {/*>*/}
      {/*  <DownLoadMRV />*/}
      {/*</Modal>*/}

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
