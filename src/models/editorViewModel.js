// 用于保存显示与全局loading标识符
import { NavigationType, CoordinateType } from '@/config/config';

export default {
  namespace: 'editorView',

  state: {
    mapMode: 'standard',
    hideBlock: false,
    showDistance: false,
    showCoordinate: false,
    showRelationsDir: [0, 1, 2, 3],
    shownPriority: [10, 20, 100, 1000],
    showRelationsCells: [],
    forceUpdate: {}, // 部分组件需要手动渲染
    showBackImg: false, // 是否显示背景，包括：线框、Label、图片
    mapHistoryVisible: false, // 地图修改历史
    positionVisible: false, // 定位功能弹窗
    shortcutToolVisible: false, // 是否显示便捷操作工具
    zoneMarkerVisible: false, // 是否显示区域配置弹窗
    labelMarkerVisible: false, // 是否显示Label配置弹窗
    settingEStop: false, // 绘制区域用于配置地图功能
    saveMapLoading: false, // 保存地图
    activeMapLoading: false, // 激活地图

    // 地图控制
    mapRotation: 0, // 手动旋转地图
    shownCellCoordinateType: CoordinateType.NAVI, // land 表示物理点位、navi表示导航点位
    shownNavigationCellType: [NavigationType.M_QRCODE, NavigationType.SEER_SLAM], // 显示的导航点类型
  },

  reducers: {
    saveState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    savePositionVisible(state, action) {
      return {
        ...state,
        positionVisible: action.payload,
      };
    },
    updateMapRotation(state, action) {
      return {
        ...state,
        mapRotation: action.payload,
      };
    },
    updateShownNavigationCellType(state, action) {
      return {
        ...state,
        shownNavigationCellType: action.payload,
      };
    },
    updateShownCellCoordinateType(state, action) {
      return {
        ...state,
        shownCellCoordinateType: action.payload,
      };
    },
    saveForceUpdate(state, action) {
      return {
        ...state,
        forceUpdate: {},
      };
    },
    saveShortcutToolVisible(state, action) {
      return {
        ...state,
        shortcutToolVisible: action.payload,
      };
    },
    saveMapHistoryVisible(state, action) {
      return {
        ...state,
        mapHistoryVisible: action.payload,
      };
    },
    saveMapLoading(state, action) {
      return {
        ...state,
        saveMapLoading: action.payload,
      };
    },
    saveActiveMapLoading(state, action) {
      return {
        ...state,
        activeMapLoading: action.payload,
      };
    },
    updateZoneMarkerVisible(state, action) {
      return {
        ...state,
        zoneMarkerVisible: action.payload,
      };
    },
    updateLabelInputVisible(state, action) {
      return {
        ...state,
        labelMarkerVisible: action.payload,
      };
    },
  },
};
