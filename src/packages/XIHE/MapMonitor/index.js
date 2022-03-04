import React, { memo, useEffect, useState } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { connect } from '@/utils/RmsDva';
import { isNull, dealResponse, isStrictNull } from '@/utils/util';
import { setMonitorSocketCallback } from '@/utils/mapUtil';
import { AgvPollingTaskPathManager } from '@/workers/AgvPollingTaskPathManager';
import { WorkStationStatePolling } from '@/workers/WorkStationPollingManager';
import { CommonStationStatePolling } from '@/workers/CommonStationPollingManager';
import { StationRatePolling } from '@/workers/StationRateManager';
import { CostHeatPollingManager } from '@/workers/CostHeatPollingManager';
import MonitorMapContainer from './components/MonitorMapContainer';
import MonitorBodyRight from './components/MonitorBodyRight';
import MonitorHeader from './components/MonitorHeader';
import WorkStationReport from './Modal/WorkStationReport/WorkStationReport';
import CommonStationReport from './Modal/CommonStationReport/CommonStationReport';
import {
  fetchWorkStationInstrument,
  fetchWorkStationPre30Waiting,
  fetchStationRealTimeRate,
} from '@/services/monitor';
import {
  covertData2ChartsData,
  convertWaitingData2Chart,
} from '@/packages/XIHE/MapMonitor/Modal/WorkStationReport/workStationEchart';
import {
  transformCommonTrafficData,
  transitionRobots,
} from './Modal/CommonStationReport/commonStationEchart';
import { commonStationCallback } from './Modal/CommonStationReport/stationReport';
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
    stationRealTimeRateView,
    categoryModal,
    categoryPanel,
    showCostPolling,
    hotType,
  } = props;

  const [workStationOB, setWorkStationOB] = useState({});
  const [workStationWaitingData, setWorkStationWaitingData] = useState({});
  const [workStationTaskHistoryData, setWorkStationTaskHistoryData] = useState({});
  const [workStationPolling, setWorkStationPolling] = useState([]);

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

  // 轮询成本热度
  useEffect(() => {
    if (!isStrictNull(hotType) && showCostPolling) {
      CostHeatPollingManager.start({ type: hotType, startTime: '', endTime: '' }, (response) => {
        mapContext.renderCellHeat(response);
      });
    }
    return () => {
      CostHeatPollingManager.terminate();
    };
  }, [showCostPolling, hotType]);

  // 轮询站点速率
  useEffect(() => {
    stationRealTimeRateView &&
      StationRatePolling.start((value) => {
        dispatch({ type: 'monitor/updateStationRate', payload: { mapContext, response: value } });
      });
    return () => {
      StationRatePolling.terminate();
    };
  }, [stationRealTimeRateView]);

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

  // 轮询 通用站点雇佣车标记
  useEffect(() => {
    if (commonPointPolling && commonPointPolling.length > 0) {
      const promises = [];
      const commonPointPromise = [];
      // 收集请求队列
      commonPointPolling.forEach((ele) => {
        const [stopCellId, direction] = ele.split('-');
        commonPointPromise.push(stopCellId);
        promises.push({ stopCellId, stopDirection: direction });
      });

      CommonStationStatePolling.start(promises, (response) => {
        // 生成工作站任务历史数据
        const currentResponse = [...response];
        const _commonPointTaskHistoryData = { ...commonPointTaskHistoryData };
        currentResponse.map((data, index) => {
          if (!dealResponse(data)) {
            //到站次数
            const TaskCountData = { ...data };
            const stopCellId = commonPointPromise[index];
            const robotIdMap = transitionRobots(TaskCountData);
            const taskHistoryData = transformCommonTrafficData(TaskCountData);
            _commonPointTaskHistoryData[stopCellId] = {
              robotIdMap,
              taskHistoryData,
            };
          }
        });

        setCommonPointTaskHistoryData(_commonPointTaskHistoryData);

        // 根据返回数据刷新小车标记
        Object.keys(_commonPointTaskHistoryData).forEach((stopId) => {
          const { robotIdMap } = _commonPointTaskHistoryData[stopId];
          const robotIds = [];
          Object.values(robotIdMap).map((ids) => {
            robotIds.push(...ids);
          });
          mapContext.markCommonPointAgv(robotIds, true, null, stopId);
        });
      });
    }

    return () => {
      CommonStationStatePolling.terminate();
    };
  }, [commonPointPolling]);

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
  // 标记事件 通用站点雇佣车
  function markCommonPointAgv(agvs, checked, commonOB) {
    if (mapContext) {
      const { stopCellId, color, angle: direction } = commonOB;
      const currentStopCellId = `${stopCellId}`;
      setCommonPointOB(commonOB);

      // 更新地图显示
      mapContext.markCommonPoint(currentStopCellId, checked, color);
      mapContext.markCommonPointAgv(agvs, checked, color, currentStopCellId);

      let _currentCommonStations = [...commonPointPolling];
      if (checked) {
        _currentCommonStations.push(`${currentStopCellId}-${direction}`);
      } else {
        _currentCommonStations.splice(
          _currentCommonStations.indexOf(`${currentStopCellId}-${direction}`),
          1,
        );
      }
      setCommonPointPolling([..._currentCommonStations]);
    }
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
        <MonitorMapContainer
          checkWorkStation={checkWorkStation}
          checkCommonStation={checkCommonStation}
        />
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
      {categoryModal === 'CommonStation' && categoryPanel === 'Report' && (
        <CommonStationReport
          commonPoint={commonPointOB} // 当前查看的通用站点数据
          dataSource={commonPointTaskHistoryData} // 到站次数数据
          waiting={commonPointWaitingData} // 最后30次等待时间
          traffic={commonPointTrafficData} // 货物流量
          marker={markCommonPointAgv} // 标记函数
          refresh={checkCommonStation}
        />
      )}
    </div>
  );
};
export default connect(({ monitor, global,monitorView }) => ({
  socketClient: global.socketClient,
  currentMap: monitor.currentMap,
  mapContext: monitor.mapContext,
  mapRendered: monitor.mapRendered,
  selectAgv: monitor.viewSetting?.selectAgv,
  showRoute: monitor.viewSetting?.showRoute,
  stationRealTimeRateView: monitor.viewSetting?.stationRealTimeRateView,
  categoryModal: monitor.categoryModal,
  categoryPanel: monitor.categoryPanel,
  showCostPolling: monitorView?.showCostPolling,
  hotType: monitor?.hotType,
}))(memo(MapMonitor));
