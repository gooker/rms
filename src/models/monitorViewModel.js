import { AgvPollingTaskPathManager } from '@/workers/AgvPollingTaskPathManager';
import { AgvBrand, CoordinationType } from '@/config/consts';
export default {
  namespace: 'monitorView',
  state: {
    selectAgv: [],
    agvLockView: {
      showAgvLock: [],
      showLockCellPolling: false,
    },
    routeView: {
      showRoute: true,
      showFullPath: false,
      showTagetLine: false,
    },
    showCellLock: true,

    shownPriority: [],
    distanceShow: false,
    cellPointShow: true,
    coordinationShow: false,
    stationRealTimeRateView: false, // 站点实时速率显示
    backImgeView: false, // 背景
    emergencyAreaShow: true, // 紧急区域

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
    agvAlarmList: [],
    // 小车运行信息
    agvRunningInfoList: [],

    dashBoardVisible: false, // dashboard

    // 地图显示模式
    shownNavigationCellType: [AgvBrand.MUSHINY, AgvBrand.SEER], // 显示的导航点类型
    shownCellCoordinateType: CoordinationType.LAND, // land 表示物理点位、navi表示导航点位
  },
  reducers: {
    saveViewState(state, action) {
      return { ...state, ...action.payload };
    },

    savePollingCost(state, action) {
      return {
        ...state,
        showCostPolling: action.payload,
      };
    },
    saveAgvLockView(state, action) {
      return {
        ...state,
        agvLockView: { ...state.agvLockView, ...action.payload },
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

    saveAgvAlarmList(state, action) {
      return {
        ...state,
        agvAlarmList: action.payload,
      };
    },
    saveAgvRunningInfoList(state, action) {
      return {
        ...state,
        agvRunningInfoList: action.payload,
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
    *routePolling({ payload }, { select, call, put }) {
      const { flag, agvs } = payload;
      const { mapContext } = yield select(({ monitor }) => monitor);
      const { selectAgv } = yield select(({ monitorView }) => monitorView);
      if (flag) {
        const robotIds = agvs || selectAgv;
        if (robotIds?.length > 0) {
          AgvPollingTaskPathManager.start(robotIds, (response) => {
            if (response && Array.isArray(response)) {
              const tasks = response.filter(Boolean);
              mapContext.registerShowTaskPath(tasks, true);
            }
          });
        } else {
          // 清理地图上的路径
          mapContext?.registerShowTaskPath([], true);
        }
      } else {
        AgvPollingTaskPathManager.terminate();
      }
    },
  },
};
