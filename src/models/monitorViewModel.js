import { VehiclePollingTaskPathManager } from '@/workers/WebWorkerManager';
import { CoordinateType, NavigationType } from '@/config/config';

const MonitorViewModelState = {
  // ************************* 路径锁格 ************************* //
  // 小车的uniqueId
  selectVehicle: [],
  // 点位锁格
  showCellLock: true,
  // 逻辑区路径锁格
  showLogicLockedCell: false,
  // 小车锁
  vehicleLockView: {
    showLockCellPolling: false,
  },
  // 显示路径
  routeView: {
    showRoute: true,
    showFullPath: false,
    showTargetLine: false,
  },

  // ************************* 地图显示 ************************* //
  showCellPoint: true, // 显示地图点位
  showDistance: false, // 是否显示距离
  showCoordinate: false, // 是否显示点位坐标
  showCellsLine: false, // 是否显示点位之间的连线
  shownPriority: [], // 可见的箭头(cost)
  showBackImage: false, // 背景
  emergencyAreaShown: true, // 紧急区域

  // ************************* 其他 ************************* //
  // 站点实时速率显示
  stationRealTimeRateView: false,

  // 自动轮询成本热度
  showCostPolling: false,

  // 热度类型
  hotType: null,
  costHeatOpacity: true,

  // 临时不可走点
  tempBlockShown: true,
  temporaryCell: [],

  // 料箱货架
  toteBinShown: true,

  // 追踪小车
  trackingView: {
    trackingCar: undefined,
    trackingCarSure: false,
    locationType: 'cell',
    locationValue: null,
  },

  // 工作站
  workStationView: {
    workStationOB: {},
    workStationPolling: [],
    workStationWaitingData: {},
    workStationTaskHistoryData: {},
  },

  // 通用工作站
  commonStationView: {
    commonPointOB: {},
    commonPointPolling: [],
    commonPointWaitingData: {},
    commonPointTaskHistoryData: {},
    commonPointTrafficData: {},
  },

  // 小车告警异常
  vehicleAlarmList: [],

  // 小车运行信息
  vehicleRunningInfoList: [],

  dashBoardVisible: false, // dashboard

  // 地图显示模式
  shownNavigationCellType: [NavigationType.M_QRCODE, NavigationType.SEER_SLAM], // 显示的导航点类型
  shownCellCoordinateType: CoordinateType.LAND, // land 表示物理点位、navi表示导航点位
};

export default {
  namespace: 'monitorView',

  state: {
    ...MonitorViewModelState,
  },

  reducers: {
    unmount(state) {
      return {
        ...MonitorViewModelState,
      };
    },
    saveState(state, action) {
      return { ...state, ...action.payload };
    },

    savePollingCost(state, action) {
      return {
        ...state,
        showCostPolling: action.payload,
      };
    },
    saveVehicleLockView(state, action) {
      return {
        ...state,
        vehicleLockView: { ...state.vehicleLockView, ...action.payload },
      };
    },
    saveRouteView(state, action) {
      return {
        ...state,
        routeView: { ...state.routeView, ...action.payload },
      };
    },
    saveTrackingView(state, action) {
      return {
        ...state,
        trackingView: { ...state.trackingView, ...action.payload },
      };
    },
    saveWorkStationView(state, action) {
      return {
        ...state,
        workStationView: { ...state.workStationView, ...action.payload },
      };
    },
    saveCommonStationView(state, action) {
      return {
        ...state,
        commonStationView: { ...state.commonStationView, ...action.payload },
      };
    },

    saveVehicleAlarmList(state, action) {
      return {
        ...state,
        vehicleAlarmList: action.payload,
      };
    },
    saveVehicleRunningInfoList(state, action) {
      return {
        ...state,
        vehicleRunningInfoList: action.payload,
      };
    },
    saveDashBoardVisible(state, action) {
      return {
        ...state,
        dashBoardVisible: action.payload,
      };
    },
  },

  effects: {
    *routePolling({ payload }, { select }) {
      const { flag, ids } = payload;
      const props = yield select(({ monitor }) => monitor);
      const { selectVehicle } = yield select(({ monitorView }) => monitorView);
      const uniqueIds = ids || selectVehicle;
      if (flag && uniqueIds?.length > 0) {
        VehiclePollingTaskPathManager.start(uniqueIds, (response) => {
          if (response && Array.isArray(response)) {
            const tasks = response.filter(Boolean);
            props.mapContext.registerShowTaskPath(tasks, true);
          }
        });
      } else {
        props.mapContext?.registerShowTaskPath([], false);
        VehiclePollingTaskPathManager.terminate();
      }
    },
  },
};
