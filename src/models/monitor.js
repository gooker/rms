import { message } from 'antd';
import { findIndex, isPlainObject } from 'lodash';
import {
  fetchWCSAgvList,
  fetchActiveMap,
  fetchStoreCellGroup,
  fetchToteRackLayout,
  fetchForkLiftPodLayout,
} from '@/services/api';
import {
  fetchGetPodList,
  fetchChargerList,
  fetchToteSizeList,
  fetchMapAGVLocks,
} from '@/services/XIHE';
import {
  updateTemporaryBlockCell,
  deleteTemporaryBlockCell,
  fetchAutoReleasePod,
  fetchAgvTaskPath,
  fetchSetPod,
  fetchDeletePod,
  fetchPodToCell,
  agvEmptyRun,
  agvTryToCharge,
  agvToRest,
  latentPodToWorkStation,
  batchUpdateLatentPod,
  fetchLatentPausedEventList,
  fetchTemporaryBlockCells,
  autoCallLatentPodToWorkstation,
  saveLatentAutomaticTaskConfig,
  fetchLatentAutoTaskConfig,
  fetchToteAutoTaskConfig,
  fetchForkliftAutoTaskConfig,
} from '@/services/monitor';

import { getCurrentLogicAreaData } from '@/utils/mapUtils';
import { dealResponse, formatMessage, isNull } from '@/utils/utils';
import { hasPermission, isAppInUse } from '@/utils/Permission';
import { AppCode, AGVType } from '@/config/config';

export default {
  namespace: 'monitor',

  state: {
    // 地图信息
    currentMap: null,
    currentLogicArea: 0, // id
    currentRouteMap: 'DEFAULT', // code
    preRouteMap: null, // 记录上一个路线区数据, 用于切换路线区时候拿到上一次路线区的数据做清理工作
    elevatorCellMap: null, // 保存电梯替换点与地图原始点位的Map关系
    currentCells: [], // 当前视图的点位数据

    // “显示” Tab 缓存信息
    viewSetting: {
      selectAgv: [],

      showLockCell: [],
      showRoute: true,
      showFullPath: false,
      showTagetLine: false,

      tempBlockShown: true,
      temporaryCell: [],
      shownPriority: [],
      distanceShow: false,
      coordinationShow: false,
      cellPointShow: true,
      toteBinShown: true,

      // 追踪小车
      trackingCar: undefined,
      trackingCarSure: undefined,

      // 定位
      locationType: undefined,
      locationValue: undefined,
    },

    // WCS小车列表
    forkAgvList: [],
    toteAgvList: [],
    sorterAgvList: [],
    latentLiftingList: [],

    // 运行信息
    podToWorkstationInfo: [],
    latentStopMessageList: [],
    autoCallPodToWorkstationStatus: '',
    automaticToteWorkstationTaskStatus: '',
    automaticForkLiftWorkstationTaskStatus: '',

    // 可见性信息
    dashBoardVisible: false,
    drawerVisible: false,

    // 自动呼叫 & 自动释放
    latentAutomaticTaskConfig: null,
    latentAutomaticTaskForm: null,
    latentAutomaticTaskUsage: {},

    // 页面查看元素
    checkModalVisible: false,
    charger: null,
  },

  reducers: {
    saveState(state, action) {
      return { ...state, ...action.payload };
    },
    saveCurrentMap(state, action) {
      return {
        ...state,
        currentMap: action.payload,
        currentLogicArea: 0,
        currentRouteMap: 'DEFAULT',
        preRouteMap: null,
      };
    },
    saveCurrentLogicArea(state, action) {
      return {
        ...state,
        currentLogicArea: action.payload,
        currentRouteMap: 'DEFAULT',
        preRouteMap: null,
      };
    },
    saveCurrentRouteMap(state, action) {
      const currentLogicAreaData = state.currentMap.logicAreaList[state.currentLogicArea];
      const currentRouteMapData = currentLogicAreaData.routeMap[state.currentRouteMap];
      return {
        ...state,
        currentRouteMap: action.payload,
        preRouteMap: currentRouteMapData,
      };
    },
    savePreRouteMap(state, action) {
      return {
        ...state,
        preRouteMap: action.payload,
      };
    },
    saveCurrentCells(state, action) {
      return {
        ...state,
        currentCells: action.payload,
      };
    },
    saveDrawerVisible(state, action) {
      return {
        ...state,
        drawerVisible: action.payload,
      };
    },
    saveDashBoardVisible(state, action) {
      return {
        ...state,
        dashBoardVisible: action.payload,
      };
    },
    saveElevatorCellMap(state, action) {
      return {
        ...state,
        elevatorCellMap: action.payload,
      };
    },
    savePodToWorkstationInfo(state, action) {
      return { ...state, podToWorkstationInfo: action.payload };
    },
    saveViewSetting(state, action) {
      return {
        ...state,
        viewSetting: action.payload,
      };
    },
    saveLatentLiftingList(state, action) {
      return {
        ...state,
        latentLiftingList: action.payload,
      };
    },
    saveAutoCallPodToWorkstationStatus(state, action) {
      return {
        ...state,
        autoCallPodToWorkstationStatus: action.payload,
      };
    },
    saveToteAgvList(state, action) {
      return {
        ...state,
        toteAgvList: action.payload,
      };
    },
    saveAutomaticToteWorkstationTaskStatus(state, action) {
      return {
        ...state,
        automaticToteWorkstationTaskStatus: action.payload,
      };
    },
    saveAutomaticForkLiftWorkstationTaskStatus(state, action) {
      return {
        ...state,
        automaticForkLiftWorkstationTaskStatus: action.payload ?? {},
      };
    },
    saveLatentSopMessageList(state, action) {
      return {
        ...state,
        latentStopMessageList: action.payload,
      };
    },
    switchShowPriority(state, action) {
      return {
        ...state,
        shownPriority: action.payload,
      };
    },
    saveForkAgvList(state, action) {
      return {
        ...state,
        forkAgvList: action.payload,
      };
    },
    saveSorterAgvList(state, action) {
      return {
        ...state,
        sorterAgvList: action.payload,
      };
    },

    // 自动呼叫 & 自动释放
    saveLatentAutomaticTaskConfig(state, action) {
      return {
        ...state,
        latentAutomaticTaskConfig: action.payload,
      };
    },
    saveLatentAutomaticTaskForm(state, action) {
      return {
        ...state,
        latentAutomaticTaskForm: action.payload,
      };
    },

    saveLatentAutomaticTaskUsage(state, action) {
      return {
        ...state,
        latentAutomaticTaskUsage: action.payload,
      };
    },
  },

  effects: {
    *unmount(_, { put }) {
      yield put({
        type: 'saveState',
        payload: {
          // 地图信息
          currentMap: null,
          currentLogicArea: 0, // id
          currentRouteMap: 'DEFAULT', // code
          preRouteMap: null, // 记录上一个路线区数据, 用于切换路线区时候拿到上一次路线区的数据做清理工作
          elevatorCellMap: null, // 保存电梯替换点与地图原始点位的Map关系
          currentCells: [], // 当前视图的点位数据

          // “显示” Tab 缓存信息
          viewSetting: {
            selectAgv: [],

            showLockCell: [],
            showRoute: true,
            showFullPath: false,
            showTagetLine: false,

            tempBlockShown: true,
            temporaryCell: [],
            shownPriority: [],
            distanceShow: false,
            coordinationShow: false,
            cellPointShow: true,
            toteBinShown: true,

            // 追踪小车
            trackingCar: undefined,
            trackingCarSure: undefined,

            // 定位
            locationType: undefined,
            locationValue: undefined,
          },

          // WCS小车列表
          forkAgvList: [],
          toteAgvList: [],
          sorterAgvList: [],
          latentLiftingList: [],

          // 运行信息
          podToWorkstationInfo: [],
          latentStopMessageList: [],
          autoCallPodToWorkstationStatus: '',
          automaticToteWorkstationTaskStatus: '',
          automaticForkLiftWorkstationTaskStatus: '',

          // 可见性信息
          dashBoardVisible: false,
          drawerVisible: false,

          // 自动呼叫 & 自动释放
          latentAutomaticTaskConfig: null,
          latentAutomaticTaskForm: null,
          latentAutomaticTaskUsage: {},
        },
      });
    },

    // 加载地图初始化信息数据，点位路线等基本信息
    *initMap(_, { call, put }) {
      const response = yield call(fetchActiveMap);
      if (!response || dealResponse(response)) {
        message.warn(formatMessage({ id: 'app.editor.activeMap.zero' }), 10);
        return false;
      }

      const { elevatorList } = response;
      if (!isNull(elevatorList)) {
        let elevatorCellMap = {};
        elevatorList.forEach(({ logicLocations }) => {
          Object.values(logicLocations).forEach(({ innerMapping }) => {
            const currentLogicReplaceCellId = Object.keys(innerMapping)[0];
            elevatorCellMap = { [currentLogicReplaceCellId]: [], ...elevatorCellMap };
            elevatorCellMap[currentLogicReplaceCellId].push(
              innerMapping[currentLogicReplaceCellId],
            );
          });
        });
        yield put({ type: 'saveElevatorCellMap', payload: elevatorCellMap });
      }

      yield put({ type: 'saveCurrentMap', payload: response });
      return true;
    },

    // 加载地图上的小车和货位信息
    *initStatus(_, { call, put, select }) {
      const { currentMap } = yield select((state) => state.monitor);

      const sectionId = window.localStorage.getItem('sectionId');

      // @权限控制: Monitor初始化只访问有权限的APP API
      const result = {};

      // @权限控制: 潜伏车访问控制
      if (isAppInUse(AppCode.LatentLifting)) {
        // 加载潜伏车列表
        const latentLiftingList = yield call(fetchWCSAgvList, AGVType.LatentLifting);
        if (!dealResponse(latentLiftingList)) {
          yield put({
            type: 'saveLatentLiftingList',
            payload: latentLiftingList,
          });
          result.latentLiftingList = latentLiftingList;
        }

        // 加载潜伏车货架列表
        const podList = yield call(fetchGetPodList, sectionId);
        if (!dealResponse(podList)) {
          result.podList = podList.map((record) => {
            return { ...record, id: record.podId };
          });
        }

        // 加载潜伏车存储位配置信息
        const storeCellGroup = yield call(fetchStoreCellGroup, currentMap.id);
        if (!dealResponse(storeCellGroup)) {
          if (isPlainObject(storeCellGroup.storeGroups)) {
            result.storeCellGroup = storeCellGroup.storeGroups;
          }
        }
      }

      // @权限控制: 料箱车访问控制
      if (isAppInUse(AppCode.Tote)) {
        // 加载料箱车列表
        const toteList = yield call(fetchWCSAgvList, AGVType.Tote);
        if (!dealResponse(toteList)) {
          result.toteList = toteList;
          yield put({ type: 'saveToteAgvList', payload: toteList });
        }

        // 加载料箱尺寸Mapping数据
        const rackSizeList = yield call(fetchToteSizeList);
        if (!dealResponse(rackSizeList)) {
          const rackSizeListObject = {};
          for (let index = 0; index < rackSizeList.length; index++) {
            const element = rackSizeList[index];
            if (rackSizeListObject[element.sizeType] != null) {
              rackSizeListObject[element.sizeType][element.code] = element.value;
            } else {
              rackSizeListObject[element.sizeType] = {};
              rackSizeListObject[element.sizeType][element.code] = element.value;
            }
          }
          result.rackSizeList = rackSizeListObject;
        }

        // 加载料箱布局信息
        const rackLayout = yield call(fetchToteRackLayout, { mapId: currentMap.id });
        if (!dealResponse(rackLayout)) {
          result.rackLayout = rackLayout;
        }
      }

      // @权限控制: 叉车访问控制
      if (isAppInUse(AppCode.ForkLifting)) {
        // 加载叉车列表
        const forkList = yield call(fetchWCSAgvList, AGVType.ForkLifting);
        if (!dealResponse(forkList)) {
          result.forkList = forkList;
          yield put({ type: 'saveForkAgvList', payload: forkList });
        }

        // 加载叉车地图布局
        const podLayout = yield call(fetchForkLiftPodLayout);
        if (!dealResponse(podLayout)) {
          result.forkPodList = podLayout;
        }
      }

      // @权限控制: 分拣车访问控制
      if (isAppInUse(AppCode.Sorter)) {
        const sorterList = yield call(fetchWCSAgvList, AGVType.Sorter);
        if (!dealResponse(sorterList)) {
          result.sorterList = sorterList;
          yield put({ type: 'saveSorterAgvList', payload: sorterList });
        }
      }

      // 地图充电桩与硬件绑定关系
      if (hasPermission('/map/monitor/chargerMaintain') && currentMap.id) {
        const chargerList = yield call(fetchChargerList, currentMap.id);
        if (!dealResponse(chargerList)) {
          result.chargerList = chargerList;
        }
      }

      return result;
    },

    // 拉取所有小车信息
    *refreshAllAgvList(object, { call, put }) {
      // @权限控制: 潜伏车访问控制
      if (isAppInUse(AppCode.LatentLifting)) {
        // 加载潜伏车列表
        const latentLiftingList = yield call(fetchWCSAgvList, AGVType.LatentLifting);
        if (!dealResponse(latentLiftingList)) {
          yield put({ type: 'saveLatentLiftingList', payload: latentLiftingList });
        }
      }

      // @权限控制: 料箱车访问控制
      if (isAppInUse(AppCode.Tote)) {
        // 加载料箱车列表
        const toteList = yield call(fetchWCSAgvList, AGVType.Tote);
        if (!dealResponse(toteList)) {
          yield put({ type: 'saveToteAgvList', payload: toteList });
        }
      }

      // @权限控制: 叉车访问控制
      if (isAppInUse(AppCode.ForkLifting)) {
        // 加载叉车列表
        const forkList = yield call(fetchWCSAgvList, AGVType.ForkLifting);
        if (!dealResponse(forkList)) {
          yield put({ type: 'saveForkAgvList', payload: forkList });
        }
      }

      // @权限控制: 分拣车访问控制
      if (isAppInUse(AppCode.Sorter)) {
        const sorterList = yield call(fetchWCSAgvList, AGVType.Sorter);
        if (!dealResponse(sorterList)) {
          yield put({ type: 'saveSorterAgvList', payload: sorterList });
        }
      }
    },

    *fetchAgvList(_, { call, put, select }) {
      const latentLiftingList = yield call(fetchWCSAgvList, AGVType.LatentLifting);
      if (dealResponse(latentLiftingList)) {
        return false;
      }
      yield put({
        type: 'saveLatentLiftingList',
        payload: latentLiftingList,
      });
      return latentLiftingList;
    },

    *fetchPodToWorkStation({ payload }, { call }) {
      const response = yield call(latentPodToWorkStation, payload);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchEmptyRun({ payload }, { call }) {
      const response = yield call(agvEmptyRun, AGVType.LatentLifting, payload);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchGetPodList({ payload }, { call }) {
      const response = yield call(fetchGetPodList, payload);
      if (dealResponse(response)) {
        return false;
      }
      return response;
    },

    *fetchSetPod({ payload }, { call }) {
      const response = yield call(fetchSetPod, [payload]);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchDeletePod({ payload }, { call }) {
      const response = yield call(fetchDeletePod, payload);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchDeletePodAndAddPod({ payload }, { call }) {
      const sectionId = window.localStorage.getItem('sectionId');
      const { podNumber, podLength, podWidth, batchAngle } = payload;

      // 删除已有货架
      const response = yield call(batchUpdateLatentPod, { ...payload, sectionId });
      if (dealResponse(response)) {
        return false;
      }

      // 请求新增货架
      const currentLogicArea = getCurrentLogicAreaData('monitor');
      const { storeCellIds } = currentLogicArea;
      if (isNull(storeCellIds) || storeCellIds.length === 0) {
        message.error(formatMessage({ id: 'app.models.storageArea' }));
        return false;
      }
      const result = [];
      for (let index = 0; index < storeCellIds.length; index++) {
        if (index + 1 > podNumber) {
          break;
        }
        const element = storeCellIds[index];
        result.push({
          sectionId,
          length: podLength,
          width: podWidth,
          cellId: element,
          angle: batchAngle,
          podId: element,
        });
      }
      const setPodResponse = yield call(fetchSetPod, result);
      if (dealResponse(setPodResponse)) {
        return false;
      }
    },

    *fetchGoToRest({ payload }, { call }) {
      const response = yield call(agvToRest, AGVType.LatentLifting, payload);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchTryToCharge({ payload }, { call }) {
      const response = yield call(agvTryToCharge, AGVType.LatentLifting, payload);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchPodToCell({ payload }, { call }) {
      const response = yield call(fetchPodToCell, payload);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchUpdateViewSetting({ payload }, { put, select }) {
      const { viewSetting } = yield select((state) => state.monitor);
      const { key, value } = payload;
      const newViewSetting = { ...viewSetting, [key]: value };
      yield put({ type: 'saveViewSetting', payload: newViewSetting });
    },

    *fetchAllLockCells({ payload, then }, { call, select }) {
      const { currentLogicArea } = yield select((state) => state.monitor);
      const { lockTypes, robotIds } = payload;
      const response = yield call(fetchMapAGVLocks, currentLogicArea, lockTypes, robotIds);
      if (dealResponse(response)) {
        return false;
      }
      then && then(response);
    },

    *fetchGetRobotPath({ payload }, { call }) {
      const response = yield call(fetchAgvTaskPath, payload);
      if (dealResponse(response)) {
        return false;
      }
      return response;
    },

    *fetchTemporaryLockedCells(_, { call, put }) {
      const response = yield call(fetchTemporaryBlockCells);
      if (dealResponse(response)) {
        return [];
      }
      yield put({ type: 'saveTemporaryLockedCells', payload: response });
      return response;
    },

    *fetchSaveTemporaryCell({ payload }, { call }) {
      const response = yield call(updateTemporaryBlockCell, payload);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchDeleteTemporaryCell({ payload }, { call }) {
      const response = yield call(deleteTemporaryBlockCell, payload);
      if (dealResponse(response, 1, '操作完成')) {
        return false;
      }
    },

    /// /////////////// 潜伏车工作站自动任务 //////////////////
    *fetchSaveLatentAutomaticTaskConfig({ payload }, { call, select }) {
      const sectionId = yield select((state) => state.user.sectionId);
      const requestParam = payload.map((item) => ({ ...item, sectionId }));
      const response = yield call(saveLatentAutomaticTaskConfig, requestParam);
      if (dealResponse(response)) {
        return false;
      }
    },

    *fetchSelectAutoCallPodToWorkstationStatus({ payload }, { call, put }) {
      let response = yield call(fetchLatentAutoTaskConfig, payload);
      if (dealResponse(response)) {
        return false;
      }

      if (response === null) {
        response = {};
      }
      const {
        monitorCallPodDTO,
        monitorCallPodDTOS = [],
        callByUser,
        callTime,
        releaseByUser,
        releaseTime,
      } = response;
      yield put({ type: 'saveLatentAutomaticTaskForm', payload: monitorCallPodDTO });
      yield put({ type: 'saveAutoCallPodToWorkstationStatus', payload: response });
      yield put({
        type: 'saveLatentAutomaticTaskUsage',
        payload: { callByUser, callTime, releaseByUser, releaseTime },
      });

      // monitorCallPodDTOS 添加id列用于表格编辑
      let _monitorCallPodDTOS = [];
      if (monitorCallPodDTOS != null) {
        _monitorCallPodDTOS = monitorCallPodDTOS.map((item, index) => ({
          id: index,
          ...item,
        }));
      }

      yield put({ type: 'saveLatentAutomaticTaskConfig', payload: _monitorCallPodDTOS || [] });
    },

    *fetchSaveSocketAutomaticTaskStatus({ payload }, { put }) {
      const {
        callTime,
        callByUser,
        releaseTime,
        releaseByUser,
        monitorCallPodDTO,
        monitorCallPodDTOS = [],
      } = payload;
      yield put({
        type: 'saveLatentAutomaticTaskUsage',
        payload: { callByUser, callTime, releaseByUser, releaseTime },
      });
      yield put({ type: 'saveAutoCallPodToWorkstationStatus', payload });
      yield put({ type: 'saveLatentAutomaticTaskForm', payload: monitorCallPodDTO });

      // monitorCallPodDTOS添加id列便于在表格中操作数据
      const _monitorCallPodDTOS = monitorCallPodDTOS.map((item, index) => ({
        id: index,
        ...item,
      }));
      yield put({ type: 'saveLatentAutomaticTaskConfig', payload: _monitorCallPodDTOS || [] });
    },

    *fetchAutoCallPodToWorkstation({ payload }, { select, call }) {
      const sectionId = yield select((state) => state.user.sectionId);
      const params = { ...payload, sectionId, isAutoCall: true };
      const response = yield call(autoCallLatentPodToWorkstation, params);
      if (dealResponse(response, 1, '自动呼叫已经开启')) {
        return false;
      }
    },

    *fetchCancelAutoCallPodToWorkstation(_, { call, select }) {
      const sectionId = yield select((state) => state.user.sectionId);
      const params = { isAutoCall: false, sectionId };
      const response = yield call(autoCallLatentPodToWorkstation, params);
      if (dealResponse(response, 1, '自动呼叫已经关闭')) {
        return false;
      }
    },

    *fetchAutoReleasePod({ payload }, { select, call }) {
      const sectionId = yield select((state) => state.user.sectionId);
      const params = { ...payload, sectionId, isAutoRelease: true };
      const response = yield call(fetchAutoReleasePod, params);
      if (dealResponse(response, 1, '自动释放已经开启')) {
        return false;
      }
    },

    *fetchCancelAutoReleasePod(_, { call, select }) {
      const sectionId = yield select((state) => state.user.sectionId);
      const params = { isAutoRelease: false, sectionId };
      const response = yield call(fetchAutoReleasePod, params);
      if (dealResponse(response, 1, '自动释放已经关闭')) {
        return false;
      }
    },

    *savePodToWorkStation({ payload }, { select, put }) {
      let result = [];
      if (Array.isArray(payload)) {
        yield put({
          type: 'savePodToWorkstationInfo',
          payload,
        });
      } else {
        const { stopCellId, direction, releasePod } = payload;
        const podToWorkstationInfo = yield select((state) => state.monitor.podToWorkstationInfo);
        const filterIndex = findIndex(podToWorkstationInfo, (record) => {
          if (record) {
            return record.stopCellId === stopCellId && record.direction === direction;
          }
          return false;
        });
        if (filterIndex !== -1) {
          result = podToWorkstationInfo.filter((record, index) => {
            return index !== filterIndex;
          });
          if (!releasePod) {
            result = [payload, ...result];
          }
        } else {
          result = [payload, ...podToWorkstationInfo];
        }
        yield put({
          type: 'savePodToWorkstationInfo',
          payload: result,
        });
      }
    },

    *removeWorkStationInfo({ payload }, { select, put }) {
      const { taskId } = payload;
      const podToWorkstationInfo = yield select((state) => state.monitor.podToWorkstationInfo);
      const newPodToWorkstationInfo = podToWorkstationInfo.filter((record) => {
        return record.taskId !== taskId;
      });

      yield put({
        type: 'savePodToWorkstationInfo',
        payload: newPodToWorkstationInfo,
      });
    },

    *fetchAutomaticToteWorkstationTaskStatus(_, { call, put }) {
      const response = yield call(fetchToteAutoTaskConfig);
      if (dealResponse(response)) {
        return;
      }
      yield put({
        type: 'saveAutomaticToteWorkstationTaskStatus',
        payload: response ?? {},
      });
    },

    *fetchAutomaticForkLiftWorkstationTaskStatus(_, { call, put }) {
      const response = yield call(fetchForkliftAutoTaskConfig);
      if (dealResponse(response)) {
        return;
      }
      yield put({
        type: 'saveAutomaticForkLiftWorkstationTaskStatus',
        payload: response,
      });
    },

    *fetchLatentSopMessageList({ payload }, { call, put }) {
      const response = yield call(fetchLatentPausedEventList, payload);
      if (dealResponse(response)) {
        return false;
      }
      yield put({
        type: 'saveLatentSopMessageList',
        payload: response,
      });
    },

    // 小车弹窗
    *fetchUpdateSelectAgv({ payload }, { select, put, call }) {
      const { viewSetting, currentLogicArea } = yield select((state) => state.monitor);
      const { selectAgv, showLockCell } = viewSetting;

      const { agvId } = payload;
      const newSelectAgv = selectAgv.slice();
      const index = newSelectAgv.indexOf(agvId);
      // 标记是否是删除已选小车，只需要处理通过右击删除已选小车的流程, 如果是新增的话则需要人为手动刷新锁格信息
      let flag = false;
      if (index === -1) {
        newSelectAgv.push(agvId);
      } else {
        flag = true;
        newSelectAgv.splice(index, 1);
      }
      // 更新已选小车数据
      yield put({ type: 'saveViewSetting', payload: { ...viewSetting, selectAgv: newSelectAgv } });

      // 如果还存在已选小车就重新拉取小车锁格数据
      if (flag) {
        if (newSelectAgv.length > 0 && showLockCell.length > 0) {
          const response = yield call(
            fetchMapAGVLocks,
            currentLogicArea,
            showLockCell,
            newSelectAgv,
          );
          if (dealResponse(response)) {
            return false;
          }
          return response;
        }
        return [];
      }
    },
  },
};
