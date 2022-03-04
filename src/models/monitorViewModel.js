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

    // 自动轮询成本热度
    showCostPolling: false,
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
        agvLockView: {...state.agvLockView,...action.payload},
      };
    },
    saveRouteView(state, action) {
      return {
        ...state,
        routeView: {...state.routeView,...action.payload},
      };
    },
  },
  effects: {},
};
