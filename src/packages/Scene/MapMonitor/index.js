import React, { memo, useEffect, useRef } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from '@/utils/RmsDva';
import { dealResponse, isNull, isStrictNull } from '@/utils/util';
import { setMonitorSocketCallback } from '@/utils/mapUtil';
import MonitorMapContainer from './components/MonitorMapContainer';
import MonitorBodyRight from './components/MonitorBodyRight';
import MonitorHeader from './components/MonitorHeader';
import { fetchStationRealTimeRate } from '@/services/monitor';
import MonitorModals from './Modal';
import { HeaderHeight, MonitorOperationType } from './enums';
import styles from './monitorLayout.module.less';
import commonStyles from '@/common.module.less';
import { AgvPollingTaskPathManager,LockCellPolling } from '@/workers/WebWorkerManager';

const MapMonitor = (props) => {
  const { dispatch, socketClient, currentMap, mapContext } = props;
  const keyDown = useRef(false);

  useEffect(() => {
    socketClient.applyMonitorRegistration();
    dispatch({ type: 'monitor/initMonitorMap' });

    return () => {
      socketClient.cancelMonitorRegistration();
      dispatch({ type: 'monitor/unmount' });
      dispatch({ type: 'monitorView/unmount' });
      window.sessionStorage.removeItem('MONITOR_MAP');
      AgvPollingTaskPathManager.terminate();
      LockCellPolling.terminate();
    };
  }, []);

  useEffect(() => {
    if (!isNull(mapContext)) {
      setMonitorSocketCallback(socketClient, mapContext, dispatch);
      fetchStationRealTimeRate().then((response) => {
        if (!dealResponse(response)) {
          // 后端类型返回 不为空 就存起来 return 目前理论上只会有一个类型有值
          let currentData = Object.values(response).filter((item) => !isStrictNull(item));
          currentData = currentData[0];
          mapContext.renderCommonStationRate(currentData);
          dispatch({ type: 'monitor/saveStationRate', payload: currentData });
        }
      });

      // ****************************** S键 ****************************** //
      // 按下S键
      function onXKeyDown(event) {
        // 不能干扰输入框
        if (event.target instanceof HTMLInputElement) return;
        if (event.keyCode === 83 && !keyDown.current) {
          keyDown.current = true;
          mapContext.pixiUtils.viewport.drag({ pressDrag: false });
          dispatch({ type: 'monitor/saveOperationType', payload: MonitorOperationType.Choose });
        }
      }
      // 抬起S键
      function onXKeyUp(event) {
        if (event.target instanceof HTMLInputElement) return;
        if (event.keyCode === 83) {
          keyDown.current = false;
          mapContext.pixiUtils.viewport.drag({ pressDrag: true });
          dispatch({ type: 'monitor/saveOperationType', payload: MonitorOperationType.Drag });
        }
      }

      if (window.currentPlatForm.isPc) {
        document.addEventListener('keydown', onXKeyDown);
        document.addEventListener('keyup', onXKeyUp);
      }

      return () => {
        if (window.currentPlatForm.isPc) {
          document.removeEventListener('keydown', onXKeyDown);
          document.removeEventListener('keyup', onXKeyUp);
        }
      };
    }
  }, [mapContext]);

  return (
    <div id={'mapMonitorPage'} className={commonStyles.commonPageStyleNoPadding}>
      <div
        style={{ height: `${HeaderHeight}px` }}
        className={classnames(commonStyles.mapLayoutHeader, styles.monitorHeader)}
      >
        {currentMap === undefined ? (
          <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />
        ) : (
          <MonitorHeader />
        )}
      </div>
      <div className={styles.mapLayoutBody}>
        <MonitorMapContainer />
        <MonitorBodyRight />
      </div>
      <MonitorModals />
    </div>
  );
};
export default connect(({ monitor, global }) => ({
  socketClient: global.socketClient,
  currentMap: monitor.currentMap,
  mapContext: monitor.mapContext,
}))(memo(MapMonitor));
