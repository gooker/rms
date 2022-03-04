import { fetchActiveMap, fetchAgvList, fetchToteRackLayout } from '@/services/api';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import { message } from 'antd';
import { hasAppPermission, hasPermission } from '@/utils/Permission';
import { AGVType, AppCode } from '@/config/config';
import { findIndex } from 'lodash';
import { fetchChargerList, fetchEmergencyStopList, fetchLatentPodList,fetchMapAGVLocks } from '@/services/XIHE';
import {
  fetchTemporaryBlockCells,
  updateTemporaryBlockCell,
  deleteTemporaryBlockCell,
  fetchLatentAutoTaskConfig,
  saveLatentAutomaticTaskConfig,
  fetchAutoReleasePod,
  autoCallLatentPodToWorkstation,
  batchUpdateLatentPod,
  fetchSetPod,
  fetchLatentPausedEventList,
} from '@/services/monitor';
import { Category } from '@/packages/XIHE/MapMonitor/enums';
import { getCurrentLogicAreaData } from '@/utils/mapUtil';

export default {
  namespace: 'monitor',

  state: {
    // 地图信息
    currentMap: undefined, // undefined还未去获取数据, null表示当前没有激活的地图
    currentLogicArea: 0, // id
    currentRouteMap: 'DEFAULT', // code
    preRouteMap: null, // 记录上一个路线区数据, 用于切换路线区时候拿到上一次路线区的数据做清理工作
    currentCells: [], // 当前视图的点位数据
    mapContext: null, // 地图实体对象
    elevatorCellMap: null, // 保存电梯替换点与地图原始点位的Map关系
    stationRealRate: [], // 站点实时速率

    // 小车、货架等信息
    allAGVs: [],
    latentAgv: [],
    latentPod: [],
    toteAgv: [],
    toteRack: null,
    sorterAgv: [],
    chargerList: [], // 硬件充电桩
    temporaryBlock: [], // 临时不可走点

    // “显示”
    viewSetting: {


      tempBlockShown: true,
      temporaryCell: [],

      shownPriority: [10, 20, 100, 1000],
      distanceShow: false,
      coordinationShow: false,
      cellPointShow: true,
      stationRealTimeRateView: false, // 站点实时速率显示
      emergencyAreaShow: true, // 紧急区域
      backImgeView: false, // 背景

      toteBinShown: true,

      // 追踪小车
      trackingCar: undefined,
      trackingCarSure: undefined,

      // 定位
      locationType: undefined,
      locationValue: undefined,
    },

    // 运行信息
    podToWorkstationInfo: [],
    latentStopMessageList: [],
    autoCallPodToWorkstationStatus: '',
    automaticToteWorkstationTaskStatus: '',
    automaticForkLiftWorkstationTaskStatus: '',

    // 自动呼叫 & 自动释放
    latentAutomaticTaskConfig: null,
    latentAutomaticTaskForm: null,
    latentAutomaticTaskUsage: {},

    // 急停区
    emergencyStopList: [], // 急停区
    globalActive: null, // 全局急停开启关闭
    logicActive: [], // 逻辑区急停开启关闭

    // 右侧操作栏
    categoryPanel: null, // 右侧展示哪个类型的菜单
    checkingElement: null, // 展示菜单的内容

    // 监控地图是否渲染完成
    mapRendered: false,
    positionVisible: false, // 定位功能弹窗

    // 热度类型
    hotType:null,
    costHeatOpacity:true,


    // 弹窗
    categoryModal: null,
  },

  reducers: {
    saveState(state, action) {
      return { ...state, ...action.payload };
    },
    saveCheckingElement(state, action) {
      return {
        ...state,
        categoryPanel: Category.Prop,
        checkingElement: action.payload,
      };
    },
    saveStationElement(state, action) {
      return {
        ...state,
        categoryPanel: Category.Report,
        categoryModal: action.payload?.type,
      };
    },
    saveCategoryModal(state, action) {
      return {
        ...state,
        categoryModal: action.payload,
      };
    },
    saveMapRendered(state, action) {
      return {
        ...state,
        mapRendered: action.payload,
      };
    },
    saveCategoryPanel(state, action) {
      return {
        ...state,
        categoryPanel: action.payload,
      };
    },
    savePositionVisible(state, action) {
      return {
        ...state,
        positionVisible: action.payload,
      };
    },
    saveCurrentMap(state, action) {
      return {
        ...state,
        currentMap: action.payload,
      };
    },
    saveCurrentCells(state, action) {
      return {
        ...state,
        currentCells: action.payload,
      };
    },
    saveMapContext(state, action) {
      return {
        ...state,
        mapContext: action.payload,
      };
    },
    saveElevatorCellMap(state, action) {
      return {
        ...state,
        elevatorCellMap: action.payload,
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

    saveAutoCallPodToWorkstationStatus(state, action) {
      return {
        ...state,
        autoCallPodToWorkstationStatus: action.payload,
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
    saveViewSetting(state, action) {
      return {
        ...state,
        viewSetting: action.payload,
      };
    },
    savePodToWorkstationInfo(state, action) {
      return { ...state, podToWorkstationInfo: action.payload };
    },
    saveLatentSopMessageList(state, action) {
      return {
        ...state,
        latentStopMessageList: action.payload,
      };
    },
  },

  effects: {
    // ***************** 获取地图数据 ***************** //
    *initMonitorMap(_, { call, put }) {
      const activeMap = yield call(fetchActiveMap);
      if (isNull(activeMap)) {
        message.warn(formatMessage({ id: 'app.message.noActiveMap' }));
        yield put({ type: 'saveCurrentMap', payload: null });
      }
      if (dealResponse(activeMap)) {
        message.error(formatMessage({ id: 'app.message.fetchMapFail' }));
      }
      if (activeMap) {
        const { elevatorList } = activeMap;
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
        yield put({ type: 'saveCurrentMap', payload: activeMap });
      }
    },

    // ***************** 获取监控小车、货架等相关信息 ***************** //
    *initMonitorLoad(_, { call, select, put }) {
      const { currentMap } = yield select(({ monitor }) => monitor);
      if (isNull(currentMap)) return null;

      const promises = [];
      const promiseFields = []; // 每个Promise返回值对应的 state 字段
      // 潜伏车模块
      if (hasAppPermission(AppCode.LatentLifting)) {
        promises.push(fetchAgvList(AGVType.LatentLifting));
        promiseFields.push('latentAgv');
        promises.push(fetchLatentPodList());
        promiseFields.push('latentPod');
      }

      // 料箱车模块
      if (hasAppPermission(AGVType.Tote)) {
        promises.push(fetchAgvList(AGVType.Tote));
        promiseFields.push('toteAgv');
        promises.push(fetchToteRackLayout());
        promiseFields.push('toteRack');
      }

      // 分拣车模块
      if (hasAppPermission(AGVType.Sorter)) {
        promises.push(fetchAgvList(AGVType.Sorter));
        promiseFields.push('sorterAgv');
      }

      // 地图充电桩与硬件绑定关系
      if (hasPermission('/map/monitor/chargerMaintain') && currentMap.id) {
        promises.push(fetchChargerList(currentMap.id));
        promiseFields.push('chargerList');
      }

      // 地图临时不可走点
      promises.push(fetchTemporaryBlockCells());
      promiseFields.push('temporaryBlock');

      // 地图急停区
      promises.push(fetchEmergencyStopList(currentMap.id));
      promiseFields.push('emergencyStopList');

      /**
       * 并发发送请求
       * result {status:'fulfilled|rejected', value:any}
       */
      const [...responses] = yield Promise.allSettled(promises);
      const resource = {};
      const additionalStates = {};
      let allAGVs = [];
      responses.forEach(({ status, value }, index) => {
        if (status === 'fulfilled' && !dealResponse(value)) {
          resource[promiseFields[index]] = value;
          additionalStates[promiseFields[index]] = value;
          if (['latentAgv', 'toteAgv', 'sorterAgv'].includes(promiseFields[index])) {
            allAGVs = [...allAGVs, ...value];
          }
        } else {
          resource[promiseFields[index]] = null;
          additionalStates[promiseFields[index]] = null;
        }
      });
      additionalStates.allAGVs = allAGVs;
      yield put({ type: 'saveState', payload: additionalStates });
      return resource;
    },

    // *****显示******
    *fetchUpdateViewSetting({ payload }, { put, select }) {
      const { viewSetting } = yield select((state) => state.monitor);
      const { key, value } = payload;
      const newViewSetting = { ...viewSetting, [key]: value };
      yield put({ type: 'saveViewSetting', payload: newViewSetting });
    },

    // *****临时不可走点
    *fetchTemporaryLockedCells(_, { call, put }) {
      const response = yield call(fetchTemporaryBlockCells);
      if (dealResponse(response)) {
        return [];
      }
      yield put({ type: 'saveState', payload: { temporaryBlock: response } });
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
      if (dealResponse(response, true, formatMessage({ id: 'app.message.operateSuccess' }))) {
        return false;
      }
    },

    /// /////////////// 潜伏车工作站自动任务 //////////////////
    *fetchSaveLatentAutomaticTaskConfig({ payload }, { call, select }) {
      const sectionId = window.localStorage.getItem('sectionId');
      const requestParam = payload.map((item) => ({ ...item, sectionId }));
      const response = yield call(saveLatentAutomaticTaskConfig, requestParam);
      if (dealResponse(response)) {
        return false;
      }
    },

    // get list
    *fetchLatentAutoCallPodToWorkstation({ payload }, { call, put }) {
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

    // 自动释放
    *openAutoReleasePod({ payload }, { select, call }) {
      const params = { ...payload, isAutoRelease: true };
      const response = yield call(fetchAutoReleasePod, params);
      if (dealResponse(response, true, formatMessage({ id: 'monitor.latentAutoTaskReleaseOn' }))) {
        return false;
      }
    },

    *cancelAutoReleasePod(_, { call, select }) {
      const params = { isAutoRelease: false };
      const response = yield call(fetchAutoReleasePod, params);
      if (dealResponse(response, true, formatMessage({ id: 'monitor.latentAutoTaskReleaseOff' }))) {
        return false;
      }
    },

    // 自动呼叫
    *openAutomatCcall({ payload }, { select, call }) {
      const params = { ...payload, isAutoCall: true };
      const response = yield call(autoCallLatentPodToWorkstation, params);
      if (dealResponse(response, true, formatMessage({ id: 'monitor.latentAutoTaskOn' }))) {
        return false;
      }
    },
    *cancelAutomatiCcall(_, { call, select }) {
      const params = { isAutoCall: false };
      const response = yield call(autoCallLatentPodToWorkstation, params);
      if (dealResponse(response, true, formatMessage({ id: 'monitor.latentAutoTaskOff' }))) {
        return false;
      }
    },

    // 批量添加潜伏货架
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
        message.error(formatMessage({ id: 'monitor.models.storageArea' }));
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
      return !dealResponse(setPodResponse);
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
          result = podToWorkstationInfo.filter((_, index) => {
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
      const { podToWorkstationInfo } = yield select(({ monitor }) => monitor);
      const newPodToWorkstationInfo = podToWorkstationInfo.filter(
        (record) => record.taskId !== taskId,
      );
      yield put({ type: 'savePodToWorkstationInfo', payload: newPodToWorkstationInfo });
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
    *updateStationRate({ payload }, { call, put }) {
      const { mapContext, response } = payload;
       // 后端类型返回 不为空 就存起来 return 目前理论上只会有一个类型有值
      let currentData = Object.values(response).filter((item) => !isStrictNull(item));
      currentData = currentData[0];
      mapContext?.renderCommonStationRate(currentData);
      yield put({
        type: 'saveState',
        payload: { stationRealRate: currentData },
      });
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
  },
};
