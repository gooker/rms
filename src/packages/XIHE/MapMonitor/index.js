import React, { memo, useEffect } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from '@/utils/dva';
import { isNull } from '@/utils/utils';
import { setMonitorSocketCallback } from '@/utils/mapUtils';
import MonitorMapContainer from './components/MonitorMapContainer';
import MonitorBodyRight from './components/MonitorBodyRight';
import MonitorHeader from './components/MonitorHeader';
import MonitorModals from './Modal';
import styles from './monitorLayout.module.less';
import commonStyles from '@/common.module.less';

const MapMonitor = (props) => {
  const { dispatch, socketClient, currentMap, mapContext, mapRendered } = props;

  useEffect(() => {
    socketClient.applyMonitorRegistration();
    dispatch({ type: 'monitor/initMonitorMap' });
    return () => {
      socketClient.cancelMonitorRegistration();
    };
  }, []);

  useEffect(() => {
    if (!isNull(mapContext)) {
      setMonitorSocketCallback(socketClient, mapContext, dispatch);
    }
  }, [mapContext]);

  useEffect(() => {
    renderMonitorLoad();
  }, [mapRendered]);

  // 渲染监控里的小车、货架等
  async function renderMonitorLoad() {
    if (mapRendered) {
      const resource = await dispatch({ type: 'monitor/initMonitorLoad' });
      console.log('地图渲染完成: ', resource);
      if (!isNull(resource)) {
        const { latentAgv, latentPod, toteAgv, toteRack, sorterAgv, temporaryBlock } = resource;
        mapContext.renderLatentAGV(latentAgv);
        mapContext.renderLatentPod(latentPod);
        mapContext.renderToteAGV(toteAgv);
        mapContext.renderTotePod(toteRack);
        mapContext.renderSorterAGV(sorterAgv);

        // 临时不可走点
        mapContext.renderTemporaryLock(temporaryBlock);

        // 渲染充电桩已绑定HardwareID标记(这里只是处理已经绑定HardwareId的情况)
        const { chargerList, emergencyStopList } = resource;
        if (Array.isArray(chargerList)) {
          chargerList.forEach((item) => {
            mapContext.updateChargerHardware(item.name, item.hardwareId);
            mapContext.updateChargerState({ n: item.name, s: item.status });
          });
        }

        // 急停区
        mapContext.renderEmergencyStopArea(emergencyStopList);
      }
    }
  }

  return (
    <div id={'mapMonitorPage'} className={commonStyles.commonPageStyleNoPadding}>
      <div className={classnames(commonStyles.mapLayoutHeader, styles.monitorHeader)}>
        {currentMap === undefined ? (
          <LoadingOutlined style={{ fontSize: 20, color: '#fff' }} spin />
        ) : (
          <MonitorHeader />
        )}
      </div>
      <div className={commonStyles.mapLayoutBody}>
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
  mapRendered: monitor.mapRendered,
}))(memo(MapMonitor));
