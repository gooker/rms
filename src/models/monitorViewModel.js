import { AgvPollingTaskPathManager } from '@/workers/AgvPollingTaskPathManager';
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

    shownPriority: [10, 20, 100, 1000],
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
