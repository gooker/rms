import React, { memo, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from '@/utils/RmsDva';
import { isNull, dealResponse } from '@/utils/util';
import { setMonitorSocketCallback } from '@/utils/mapUtil';

import MonitorMapContainer from './components/MonitorMapContainer';
import MonitorBodyRight from './components/MonitorBodyRight';
import MonitorHeader from './components/MonitorHeader';
import { fetchStationRealTimeRate } from '@/services/monitor';
import { commonStationCallback } from './Modal/CommonStationReport/stationUtil';
import MonitorModals from './Modal';
import { HeaderHeight } from './enums';
import styles from './monitorLayout.module.less';
import commonStyles from '@/common.module.less';

const MapMonitor = (props) => {
  const {
    dispatch,
    socketClient,
    currentMap,
    mapContext,
    mapRendered,
    categoryModal,
    categoryPanel,
  } = props;

  const [commonPointOB, setCommonPointOB] = useState({});
  const [commonPointWaitingData, setCommonPointWaitingData] = useState({});
  const [commonPointTaskHistoryData, setCommonPointTaskHistoryData] = useState({});
  const [commonPointTrafficData, setCommonPointTrafficData] = useState({});
  const [commonPointPolling, setCommonPointPolling] = useState([]);

  useEffect(() => {
    socketClient.applyMonitorRegistration();
    dispatch({ type: 'monitor/initMonitorMap' });

    return () => {
      socketClient.cancelMonitorRegistration();
      dispatch({
        type: 'saveState',
        payload: {
          mapContext: false,
        },
      });
    };
  }, []);

  useEffect(() => {
    if (!isNull(mapContext)) {
      setMonitorSocketCallback(socketClient, mapContext, dispatch);
      fetchStationRealTimeRate().then((response) => {
        if (!dealResponse(response)) {
          dispatch({ type: 'monitor/updateStationRate', payload: { mapContext, response } });
        }
      });
    }
  }, [mapContext]);

  useEffect(() => {
    renderMonitorLoad();
  }, [mapRendered]);

  // 渲染监控里的小车、货架等
  async function renderMonitorLoad() {
    if (mapRendered) {
      const resource = await dispatch({ type: 'monitor/initMonitorLoad' });
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

  // 通用站点
  async function checkCommonStation(commonOb) {
    // 请求该工作站的展示数据并缓存
    const { _commonPointTaskHistoryData, _trafficData, _commonWaitingData } =
      await commonStationCallback(commonOb, commonPointTaskHistoryData);
    dispatch({
      type: 'monitor/saveStationElement',
      payload: {
        type: 'CommonStation',
      },
    });
    setCommonPointOB({ ...commonOb });
    setCommonPointTaskHistoryData(_commonPointTaskHistoryData);
    setCommonPointTrafficData(_trafficData);
    setCommonPointWaitingData(_commonWaitingData);
  }

  return (
    <div id={'mapMonitorPage'} className={commonStyles.commonPageStyleNoPadding}>
      <div
        style={{ flex: `0 0 ${HeaderHeight}px` }}
        className={classnames(commonStyles.mapLayoutHeader, styles.monitorHeader)}
      >
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
      {/* {categoryModal === 'CommonStation' && categoryPanel === 'Report' && (
        <CommonStationReport
          commonPoint={commonPointOB} // 当前查看的通用站点数据
          dataSource={commonPointTaskHistoryData} // 到站次数数据
          waiting={commonPointWaitingData} // 最后30次等待时间
          traffic={commonPointTrafficData} // 货物流量
          refresh={checkCommonStation}
        />
      )} */}
    </div>
  );
};
export default connect(({ monitor, global, monitorView }) => ({
  socketClient: global.socketClient,
  currentMap: monitor.currentMap,
  mapContext: monitor.mapContext,
  mapRendered: monitor.mapRendered,
  categoryModal: monitor.categoryModal,
  categoryPanel: monitor.categoryPanel,
}))(memo(MapMonitor));
