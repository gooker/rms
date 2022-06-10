import React, { memo, useEffect, useRef } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from '@/utils/RmsDva';
import { isNull } from '@/utils/util';
import { setMonitorSocketCallback } from '@/utils/mapUtil';
import { HeaderHeight, MonitorOperationType } from './enums';
import MonitorModals from './Modal';
import MonitorHeader from './components/MonitorHeader';
import MonitorBodyRight from './components/MonitorBodyRight';
import MonitorMapContainer from './components/MonitorMapContainer';
import { LockCellPolling, VehiclePollingTaskPathManager } from '@/workers/WebWorkerManager';
import styles from './monitorLayout.module.less';
import commonStyles from '@/common.module.less';

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
      VehiclePollingTaskPathManager.terminate();
      LockCellPolling.terminate();
    };
  }, []);

  useEffect(() => {
    if (!isNull(mapContext)) {
      setMonitorSocketCallback(socketClient, mapContext, dispatch);
      // TODO: 展示实时
      // fetchStationRealTimeRate().then((response) => {
      //   if (!dealResponse(response)) {
      //     // 后端类型返回 不为空 就存起来 return 目前理论上只会有一个类型有值
      //     let currentData = Object.values(response).filter((item) => !isStrictNull(item));
      //     currentData = currentData[0];
      //     mapContext.renderCommonStationRate(currentData);
      //     dispatch({ type: 'monitor/saveStationRate', payload: currentData });
      //   }
      // });

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
          <LoadingOutlined spin style={{ fontSize: 20, color: '#ffffff' }} />
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
