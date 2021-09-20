/* eslint-disable camelcase */
import React, { memo, useCallback, useState } from 'react';
import { connect } from '@/utils/dva';
import { message } from 'antd';
import intl from 'react-intl-universal';
import request from '@/utils/request';
import { useBoolean, useMount, useSize, useUnmount } from '@umijs/hooks';
import { fetchGetRobotPath } from '@/services/map';
import AgvModal from './components/AgvModal/AgvModal';
import MapContext from './components/MonitorMapContext';
import MonitorLeftTool from './components/MapMonitorLeftTool';
import TunnelModal from './components/TunnelModal/TunnelModal';
import MonitorRightTool from './components/MapMonitorRightTool';
import ChargerModal from './components/ChargerModal/ChargerModal';
import { AGVSocketConnect } from '@/pages/MapTool/service/Service';
import MonitorMapBridging from '../MapMonitor/components/MonitorMapBridging';
import MapMonitorRightSliderMenu from './components/MapMonitorRightSiderMenu';
import WorkStationModal from './components/WorkStationModal/WorkStationModal';
import { dealResponse, isItemOfArray, isNull, sleep, useMountInterval } from '@/utils/utils';
import {
  covertData2ChartsData,
  convertWaitingData2Chart,
} from './components/WorkStationModal/echarts';
import { GlobalDrawerWidth } from '@/Const';
import config from '@/config';
import styles from './monitor.less';

const {
  nameSpace: { latent_lifting_namespace },
} = config;

const GetWorkStationInstrumentURL = `/${latent_lifting_namespace}/agv-task/getWorkStationInstrument`;
const GetWorkStationPre30WaitingURL = `/${latent_lifting_namespace}/api/getStopWaitKpiDTO`;

let mapRef = null;
let checkModal = false;
const ToolBarHeight = 35;
const usedEmployerColors = [];
const workStationPolling = [];

const MapMonitor = (props) => {
  const { dispatch, mqClient, drawerVisible } = props;

  const [bodySize] = useSize(document.body);

  // 小车运维
  const [agvOB, setAgvOB] = useState({});
  const { state: showAgvModal, setFalse: closeAgvModal, setTrue: openAgvModal } = useBoolean(false);
  // 通道运维
  const [tunnel, setTunnel] = useState(null);
  const {
    state: showTunnelModal,
    setFalse: closeTunnelModal,
    setTrue: openTunnelModal,
  } = useBoolean(false);

  // 工作站运维
  const [workStationOB, setWorkStationOB] = useState('{}');
  const [workStationWaitingData, setWorkStationWaitingData] = useState({});
  const [workStationTaskHistoryData, setWorkStationTaskHistoryData] = useState({});
  const {
    state: showWorkStationModal,
    setFalse: closeWorkStationModal,
    setTrue: openWorkStationModal,
  } = useBoolean(false);

  // 充电桩运维
  const [charger, setCharger] = useState(null);
  const {
    state: chargerModalVisible,
    setFalse: closeChargerModal,
    setTrue: openChargerModal,
  } = useBoolean(false);

  useMount(() => {
    document.body.addEventListener('click', closeMaintainModal);
    return () => {
      document.body.removeEventListener('click', closeMaintainModal);
    };
  });

  useUnmount(() => {
    dispatch({ type: 'monitor/unmount' });

    // MQ Reset
    if (mqClient) {
      mqClient.registePodInStation(null);
      mqClient.registeOpenAutoTask(null);
      mqClient.registeToteAGVStatus(null);
      mqClient.registeLatentAGVStatus(null);
      mqClient.registeLatentPodStatus(null);
      mqClient.registeForkLiftAGVStatus(null);
      mqClient.registeToteStatusCallback(null);
      mqClient.registeLatentLiftingPauseTaskEvent(null);
    }
  });

  // 轮询用
  useMountInterval(startPollingTaskPath, 500);
  useMountInterval(startPollingWorkStationState, 3 * 1000);

  const getMapRef = useCallback((reference) => {
    mapRef = reference;
  }, []);

  // 添加窗口监听，用于关闭Check的Modal
  function closeMaintainModal(ev) {
    // 获取冒泡经过的所有层级的class属性值
    const classCollection = ev.path
      .map((node) => {
        if (node.getAttribute) {
          return node.getAttribute('class')?.trim();
        }
        return null;
      })
      .filter(Boolean);
    const isClickModal = isItemOfArray(classCollection, [
      'ant-modal-root', // 任务详情弹窗
      'antd-pro-common-common-checkModal', // 运维弹窗
      'ant-popover-content', // 小车弹窗中的PopConfirm组件
      'ant-tooltip-content', // 操作Tip
      'ant-dropdown-menu-item ant-dropdown-menu-item-only-child ant-dropdown-menu-item-active', // 点击工作站颜色选择组件
      'ant-select-dropdown ant-select-dropdown-placement-bottomLeft', // 充电桩运维窗口硬件选择器
    ]);
    if (!checkModal && !isClickModal) {
      closeAgvModal();
      closeWorkStationModal();
      closeTunnelModal();
      closeChargerModal();
    }
    checkModal = false;
  }

  // 地图初始化
  async function finishNotice() {
    if (mqClient) {
      // 统一订阅一些Topic
      AGVSocketConnect(mqClient, mapRef);
      mqClient.registePodInStation((podInfo) => {
        dispatch({
          type: 'monitor/savePodToWorkStation',
          payload: podInfo,
        });
      });
      mqClient.registeOpenAutoTask((autoTask) => {
        dispatch({
          type: 'monitor/fetchSaveSocketAutomaticTaskStatus',
          payload: JSON.parse(autoTask),
        });
      });
      mqClient.registeLatentLiftingPauseTaskEvent(() => {
        dispatch({ type: 'monitor/fetchLatentSopMessageList' });
      });
      mqClient.registChargerStatusListener((state) => {
        mapRef.updateChargerState(state);
      });
    }

    // Monitor 初始化
    const init = await dispatch({ type: 'monitor/initMap' });
    if (!init) return;
    const initStatus = await dispatch({ type: 'monitor/initStatus' });
    await sleep(2000);
    if (mapRef) {
      // 潜伏车
      const { latentLiftingList, podList, storeCellGroup } = initStatus;
      mapRef.renderLatentAGV(latentLiftingList ?? []);
      mapRef.renderLatentPod(podList ?? []);
      mapRef.renderStoreCellGroup(storeCellGroup);

      // 料箱车
      const { toteList, rackLayout, rackSizeList } = initStatus;
      mapRef.renderToteAGV(toteList ?? []);
      if (!isNull(rackLayout) && !isNull(rackSizeList)) {
        if (Object.keys(rackSizeList).length > 0) {
          mapRef.renderTotePod(rackLayout, rackSizeList);
        }
      }

      // 叉车
      const { forkList, forkPodList } = initStatus;
      mapRef.renderForkLiftAGV(forkList ?? []);
      mapRef.renderForkPodLayout(forkPodList ?? []);

      // 分拣车
      const { sorterList } = initStatus;
      mapRef.renderSorterAGV(sorterList ?? []);

      // 渲染充电桩已绑定HardwareID标记(这里只是处理已经绑定HardwareId的情况)
      const { chargerList } = initStatus;
      if (Array.isArray(chargerList)) {
        chargerList.forEach((item) => {
          mapRef.updateChargerHardware(item.name, item.hardwareId);
          mapRef.updateChargerState({ n: item.name, s: item.status });
        });
      }
    }
  }

  // 获取小车任务路径
  async function startPollingTaskPath() {
    const {
      viewSetting: { selectAgv, showRoute },
    } = props;
    if (selectAgv && selectAgv.length > 0) {
      // 如果 showRoute 为空就清理地图上的路径
      if (showRoute) {
        const response = await fetchGetRobotPath(selectAgv);
        if (dealResponse(response)) {
          message.error(
            `${intl.formatMessage({ id: 'app.monitor.fetchTaskPathFail' })}: ${selectAgv.join()}`,
          );
          return false;
        }
        if (response && Array.isArray(response)) {
          const tasks = response.filter(Boolean);
          mapRef && mapRef.registeShowTaskPath(tasks, selectAgv, true);
        } else {
          message.error(intl.formatMessage({ id: 'app.monitor.taskPathDataIllegal' }));
        }
      } else {
        mapRef && mapRef.registeShowTaskPath([], [], true);
      }
    } else {
      // 清理地图上的路径
      mapRef && mapRef.registeShowTaskPath([], [], true);
    }
  }

  // 获取工作站雇佣车
  function startPollingWorkStationState() {
    if (workStationPolling && workStationPolling.length > 0) {
      const promises = [];
      const workStationPromise = [];

      workStationPolling.forEach((workStationID) => {
        const [stopCellId, direction] = workStationID.split('-');
        workStationPromise.push(workStationID);
        promises.push(
          request(GetWorkStationInstrumentURL, {
            method: 'GET',
            data: { stopCellId, stopDirection: direction },
          }),
        );
      });
      // 并发请求
      Promise.all(promises)
        .then((response) => {
          // 生成工作站任务历史数据
          const _workStationTaskHistoryData = { ...workStationTaskHistoryData };
          for (let index = 0; index < workStationPromise.length; index++) {
            const workStationID = workStationPromise[index];
            const data = response[index];
            if (dealResponse(data)) {
              message.error(
                `${intl.formatMessage({
                  id: 'app.monitor.fetchWorkstationTaskHistoryFail',
                })}: ${workStationID}`,
              );
            } else {
              const { robotIds, taskCountMap } = data;
              const taskHistoryData = covertData2ChartsData(taskCountMap);
              _workStationTaskHistoryData[workStationID] = { robotIds, taskHistoryData };
            }
          }
          setWorkStationTaskHistoryData(_workStationTaskHistoryData);

          // 根据返回数据刷新小车标记
          Object.keys(_workStationTaskHistoryData).forEach((workStationID) => {
            const { robotIds } = _workStationTaskHistoryData[workStationID];
            mapRef && mapRef.markWorkStationAgv(robotIds, true, null, workStationID);
          });
        })
        .catch(() => {
          message.error(intl.formatMessage({ id: 'app.monitor.fetchWorkstationTaskHistoryFail' }));
        });
    }
  }

  // 标记工作站雇佣车 (因为Modal组件使用了memo, 所以这里方法需要用useCallback处理下)
  const markWorkStationAgv = useCallback(
    (agvs, checked, color, workStationID, inputWorkStationOB) => {
      if (mapRef) {
        // 更新workStationOB中的状态
        setWorkStationOB(inputWorkStationOB);

        // 更新地图显示
        mapRef.markWorkStation(workStationID, checked, color);
        mapRef.markWorkStationAgv(agvs, checked, color, workStationID);

        // 更新已被使用的颜色
        if (checked) {
          workStationPolling.push(workStationID);
          usedEmployerColors.push(color);
        } else {
          workStationPolling.splice(workStationPolling.indexOf(workStationID), 1);
          usedEmployerColors.splice(usedEmployerColors.indexOf(color), 1);
        }
      }
    },
    [],
  );

  // 地图小车左点击事件
  function checkAGV(agvId, agvType) {
    checkModal = true;
    setAgvOB(JSON.stringify({ agvId, agvType }));
    closeWorkStationModal();
    closeTunnelModal();
    closeChargerModal();
    openAgvModal();
  }

  // 地图小车右点击事件
  function simpleCheckAgv(agvId) {
    dispatch({
      type: 'monitor/fetchUpdateSelectAgv',
      payload: { agvId: `${agvId}` },
    }).then((response) => {
      if (response && Array.isArray(response)) {
        mapRef && mapRef.renderLockCell(response);
      }
    });
  }

  // 地图工作站左点击事件
  async function checkWorkStation(workStationJSONStr) {
    checkModal = true;
    setWorkStationOB(workStationJSONStr);
    closeAgvModal();
    closeTunnelModal();
    closeChargerModal();
    openWorkStationModal();

    // 请求该工作站的展示数据并缓存
    const { stopCellId, direction } = JSON.parse(workStationJSONStr);
    if (!isNull(stopCellId) && !isNull(direction)) {
      Promise.all([
        // 任务数据
        request(GetWorkStationInstrumentURL, {
          method: 'GET',
          data: { stopCellId, stopDirection: direction },
        }),
        // 最近30次等待时间
        request(GetWorkStationPre30WaitingURL, {
          method: 'POST',
          data: { stopCellId, stopDirection: direction },
        }),
      ]).then((response) => {
        const [taskHistoryResponse, waitingDataResponse] = response;

        // 任务数据
        if (dealResponse(taskHistoryResponse)) {
          message.error(intl.formatMessage({ id: 'app.monitor.fetchWorkstationTaskHistoryFail' }));
        } else {
          const { robotIds, taskCountMap } = taskHistoryResponse;
          const _workStationTaskHistoryData = { ...workStationTaskHistoryData };
          const taskHistoryData = covertData2ChartsData(taskCountMap);
          _workStationTaskHistoryData[`${stopCellId}-${direction}`] = { robotIds, taskHistoryData };
          setWorkStationTaskHistoryData(_workStationTaskHistoryData);
        }

        // 最近30次等待时间
        if (dealResponse(waitingDataResponse)) {
          message.error(intl.formatMessage({ id: 'app.monitor.fetchWorkstationPre30WattingFail' }));
        } else {
          const _workStationWaitingData = { ...workStationWaitingData };
          _workStationWaitingData[`${stopCellId}-${direction}`] =
            convertWaitingData2Chart(waitingDataResponse);
          setWorkStationWaitingData(_workStationWaitingData);
        }
      });
    }
  }

  // 查看通道闸门锁状态
  function checkTunnelGate(cell) {
    checkModal = true;
    const tunnelName = cell.data.filter((item) => item.startsWith('tunnel_'))[0];
    setTunnel(tunnelName?.replace('tunnel_', ''));
    closeAgvModal();
    closeWorkStationModal();
    closeChargerModal();
    openTunnelModal();
  }

  // 查看储位组状态
  function checkStoreGroup(cell) {
    checkModal = true;
    let tunnelName = cell.data.filter((item) => item.startsWith('store_group_cell'))[0];
    tunnelName = tunnelName.match(/store_group_cell_(\w+)_[\d+]/)[1];
    setTunnel(tunnelName);
    closeAgvModal();
    closeWorkStationModal();
    openTunnelModal();
  }

  // 查看充电桩状态
  function checkCharger(chargerData) {
    checkModal = true;
    closeAgvModal();
    closeWorkStationModal();
    closeTunnelModal();
    setCharger(chargerData.name);
    openChargerModal();
  }

  return (
    <MapContext.Provider value={mapRef}>
      <div className={styles.monitorContainer}>
        {/* 顶部工具栏 */}
        <div
          className={styles.monitorTool}
          style={{
            height: ToolBarHeight,
            width: drawerVisible ? `calc(100% - ${GlobalDrawerWidth}px)` : '100%',
          }}
        >
          <MonitorLeftTool />
          <MonitorRightTool />
        </div>

        {/* 地图展示区 */}
        <div className={styles.mapContainer}>
          <MonitorMapBridging
            getMapRef={getMapRef}
            width={bodySize.width}
            height={bodySize.height - ToolBarHeight}
            finishNotice={finishNotice}
            checkAGV={checkAGV}
            checkCharger={checkCharger}
            simpleCheckAgv={simpleCheckAgv}
            checkTunnelGate={checkTunnelGate}
            checkStoreGroup={checkStoreGroup}
            checkWorkStation={checkWorkStation}
          />
        </div>

        {/* 工具抽屉 */}
        <MapMonitorRightSliderMenu />

        {/* 小车弹窗 */}
        {showAgvModal ? <AgvModal agv={agvOB} /> : null}

        {/* 工作站弹窗 */}
        {showWorkStationModal ? (
          <WorkStationModal
            workStation={workStationOB} // 当前查看的工作站数据
            dataSource={workStationTaskHistoryData} // 到站次数数据
            waiting={workStationWaitingData} // 最后30次等待时间
            usedColors={usedEmployerColors} // 已使用的颜色
            marker={markWorkStationAgv} // 标记函数
          />
        ) : null}

        {/* 通道弹窗 */}
        {showTunnelModal ? <TunnelModal tunnel={tunnel} /> : null}

        {/* 充电桩运维弹窗 */}
        {chargerModalVisible ? <ChargerModal name={charger} /> : null}
      </div>
    </MapContext.Provider>
  );
};
export default connect(({ global, monitor }) => {
  return {
    mqClient: global.mqClient,
    currentMap: monitor.currentMap,
    viewSetting: monitor.viewSetting,
    drawerVisible: monitor.drawerVisible,
    dashBoardVisible: monitor.dashBoardVisible,
  };
})(memo(MapMonitor));
