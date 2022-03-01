import React, { memo, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from '@/utils/RmsDva';
import { isNull, dealResponse } from '@/utils/util';
import { setMonitorSocketCallback } from '@/utils/mapUtil';
import { AgvPollingTaskPathManager } from '@/workers/AgvPollingTaskPathManager';
import { WorkStationStatePolling } from '@/workers/WorkStationPollingManager';
import MonitorMapContainer from './components/MonitorMapContainer';
import MonitorBodyRight from './components/MonitorBodyRight';
import MonitorHeader from './components/MonitorHeader';
import WorkStationReport from './Modal/WorkStationReport/WorkStationReport';
import { fetchWorkStationInstrument, fetchWorkStationPre30Waiting } from '@/services/monitor';
import {
  covertData2ChartsData,
  convertWaitingData2Chart,
} from '@/packages/XIHE/MapMonitor/Modal/WorkStationReport/workStationEchart';

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
    selectAgv,
    showRoute,
    categoryModal,
    categoryPanel,
  } = props;

  const [workStationOB, setWorkStationOB] = useState({});
  const [workStationWaitingData, setWorkStationWaitingData] = useState({});
  const [workStationTaskHistoryData, setWorkStationTaskHistoryData] = useState({});
  const [workStationPolling, setWorkStationPolling] = useState([]);

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
    }
  }, [mapContext]);

  useEffect(() => {
    renderMonitorLoad();
  }, [mapRendered]);

  // 轮询小车任务路径
  useEffect(() => {
    // 轮询小车任务路径
    if (selectAgv && selectAgv.length > 0 && showRoute) {
      AgvPollingTaskPathManager.start(selectAgv, (response) => {
        if (response && Array.isArray(response)) {
          const tasks = response.filter(Boolean);
          mapContext.registerShowTaskPath(tasks, selectAgv, true);
        }
      });
    } else {
      // 清理地图上的路径
      mapContext?.registerShowTaskPath([], [], true);
    }

    return () => {
      AgvPollingTaskPathManager.terminate();
    };
  }, [selectAgv, showRoute]);

  // 轮询 工作站雇佣车标记
  useEffect(() => {
    if (workStationPolling && workStationPolling.length > 0) {
      const promises = [];
      const workStationPromise = [];

      // 收集请求队列
      workStationPolling.forEach((workStationID) => {
        const [stopCellId, direction] = workStationID.split('-');
        workStationPromise.push(stopCellId);
        promises.push({ stopCellId, stopDirection: direction });
      });

      WorkStationStatePolling.start(promises, (response) => {
        // 生成工作站任务历史数据
        const currentResponse = [...response];
        const _workStationTaskHistoryData = { ...workStationTaskHistoryData };
        currentResponse.map((data, index) => {
          if (!dealResponse(data)) {
            const stopCellId = workStationPromise[index];
            const { robotIds, taskCountMap } = data;
            const taskHistoryData = covertData2ChartsData(taskCountMap);
            _workStationTaskHistoryData[stopCellId] = { robotIds, taskHistoryData };
          }
        });

        setWorkStationTaskHistoryData(_workStationTaskHistoryData);

        // 根据返回数据刷新小车标记
        Object.keys(_workStationTaskHistoryData).forEach((stopId) => {
          const { robotIds } = _workStationTaskHistoryData[stopId];
          mapContext?.markWorkStationAgv(robotIds, true, null, stopId);
        });
      });
    }
    return () => {
      WorkStationStatePolling.terminate();
    };
  }, [workStationPolling]);

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

  // 工作站点击
  async function checkWorkStation({ station, name, angle, direction, stopCellId, flag, color }) {
    if (!isNull(stopCellId) && !isNull(direction)) {
      Promise.all([
        fetchWorkStationInstrument({ stopCellId, stopDirection: direction }),
        fetchWorkStationPre30Waiting({ stopCellId, stopDirection: direction }),
      ]).then((response) => {
        const [taskHistoryResponse, waitingDataResponse] = response;
        let _workStationTaskHistoryData;
        let _workStationWaitingData;
        // 任务数据
        if (!dealResponse(taskHistoryResponse)) {
          const { robotIds, taskCountMap } = taskHistoryResponse;
          _workStationTaskHistoryData = { ...workStationTaskHistoryData };
          const taskHistoryData = covertData2ChartsData(taskCountMap);
          _workStationTaskHistoryData[`${stopCellId}`] = { robotIds, taskHistoryData };
          setWorkStationTaskHistoryData(_workStationTaskHistoryData);
        }

        // 最近30次等待时间
        if (!dealResponse(waitingDataResponse)) {
          _workStationWaitingData = { ...workStationWaitingData };
          _workStationWaitingData[`${stopCellId}`] = convertWaitingData2Chart(waitingDataResponse);
          setWorkStationWaitingData(_workStationWaitingData);
        }
        setWorkStationOB({ station, name, angle, direction, stopCellId, flag, color });
        dispatch({
          type: 'monitor/saveStationElement',
          payload: {
            type: 'WorkStation',
            data: {
              workStationTaskHistoryData: _workStationTaskHistoryData,
              workStationWaitingData: _workStationWaitingData,
              workStation: { station, name, angle, direction, stopCellId, flag, color },
            },
          },
        });
      });
    }
  }

  // 标记事件 工作站雇佣车
  const workStationMark = (agvs, checked, stationOB) => {
    if (mapContext) {
      const { stopCellId, color, direction } = stationOB;
      const currentStopCellId = `${stopCellId}`;
      setWorkStationOB(stationOB);

      // 更新地图显示
      mapContext.markWorkStation(currentStopCellId, checked, color);
      mapContext.markWorkStationAgv(agvs, checked, color, currentStopCellId);

      // 更新已被使用的颜色
      let _currenyWorkStations = [...workStationPolling];

      if (checked) {
        _currenyWorkStations.push(`${currentStopCellId}-${direction}`);
      } else {
        _currenyWorkStations.splice(
          _currenyWorkStations.indexOf(`${currentStopCellId}-${direction}`),
          1,
        );
      }
      setWorkStationPolling([..._currenyWorkStations]);
    }
  };

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
        <MonitorMapContainer checkWorkStation={checkWorkStation} />
        <MonitorBodyRight />
      </div>
      <MonitorModals />
      {categoryModal === 'WorkStation' && categoryPanel === 'Report' && (
        <WorkStationReport
          workStation={workStationOB} // 当前查看的工作站数据
          dataSource={workStationTaskHistoryData} // 到站次数数据
          waiting={workStationWaitingData} // 最后30次等待时间
          marker={workStationMark} // 标记函数/>
          refresh={checkWorkStation}
        />
      )}
    </div>
  );
};
export default connect(({ monitor, global }) => ({
  socketClient: global.socketClient,
  currentMap: monitor.currentMap,
  mapContext: monitor.mapContext,
  mapRendered: monitor.mapRendered,
  selectAgv: monitor.viewSetting?.selectAgv,
  showRoute: monitor.viewSetting?.showRoute,
  categoryModal: monitor.categoryModal,
  categoryPanel: monitor.categoryPanel,
}))(memo(MapMonitor));
