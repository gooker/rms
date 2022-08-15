import Dictionary from '@/utils/Dictionary';

const Colors = Dictionary().color;

/**-------------------------------- 车辆 --------------------------------*/
// 车辆状态
export const VehicleState = {
  error: 'Error', // error
  standBy: 'StandBy', // stand_by
  charging: 'Charging', // charging
  working: 'Working', // on_task
  offline: 'Offline', // offline
  connecting: 'Connecting', // offline
  waiting: 'Waiting', // offline
};

// 车辆在后台记录的状态字符
export const VehicleBackendState = {
  error: 'error',
  standBy: 'stand_by',
  charging: 'charging',
  working: 'on_task',
  offline: 'offline',
  waiting: 'offline',
  connecting: 'offline',
};

/**-------------------------------- 任务 --------------------------------*/
// 任务状态
export const TaskStatus = ['New', 'Executing', 'Finished', 'Cancelled', 'Error', 'Wait'];

/**-------------------------------- 充电桩 --------------------------------*/
// 充电桩状态
export const ChargerStatus = [
  'ERROR',
  'OFFLINE',
  'ASSIGNED',
  'CHARGING',
  'AVAILABLE',
  'CONNECTED',
  'CONNECTING',
];

/**-------------------------------- 地图 --------------------------------*/
export const GlobalAlpha = 0.6;
export const MapScaleRatio = 1.08;
export const MonitorAdaptStorageKey = 'MONITOR_CELL_ADAPT_THRESHOLD';
export const MonitorMapSizeKey = 'MONITOR_MAP_SIZE';
export const EditorAdaptStorageKey = 'EDITOR_CELL_ADAPT_THRESH6LD';
export const EditorMapSizeKey = 'EDITOR_MAP_SIZE';

// 地图点选操作类型
export const SelectionType = {
  SINGLE: 'SINGLE',
  CTRL: 'CTRL',
  SHIFT: 'SHIFT',
};

// 地图元素枚举
export const ElementType = {
  Vehicle: 'Vehicle',
  workStation: 'WORK_STATION',
  station: 'STATION',
  charger: 'CHARGER',
  pod: 'POD',
  toteRack: 'TOTE_RACK',
};

/**
 * 地图编辑可选择元素类型枚举
 * 点位、线条、区域标记、Label、充电桩、工作站、通用站点、电梯、投递点、交汇点
 */
export const MapSelectableSpriteType = {
  CELL: 'cell',
  ZONE: 'zone',
  ROUTE: 'route',
  LABEL: 'label',
  CHARGER: 'charger',
  STATION: 'station',
  ELEVATOR: 'elevator',
  DELIVERY: 'delivery',
  WORKSTATION: 'workStation',
  INTERSECTION: 'intersection',
  EMERGENCYSTOP: 'emergencyStop',
};

// 监控地图可选的元素类型
export const MonitorSelectableSpriteType = {
  Vehicle: 'Vehicle',
  LatentPod: 'LatentPod',
  ToteRack: 'ToteRack',
  Delivery: 'delivery',
  Station: 'station',
  WorkStation: 'workStation',
  Charger: 'charger',
};

// 急停区类型枚举
export const EmergencyStopMode = [
  { label: 'editor.emergency.VehiclePathFinished', value: 'VehiclePathFinished' },
  { label: 'editor.emergency.NearestQRCode', value: 'NearestQRCode' },
  { label: 'editor.emergency.ImmediateStop', value: 'ImmediateStop' },
  { label: 'editor.emergency.LockPath', value: 'LockPath' },
];

/**
 *  点位热度相关
 * */
// 点位热度圆半径
export const HeatCircleRadius = 400;
export const CellHeatType = {
  cost_type: 'COST_HEAT',
};

// 地图区域标记类型
export const ZoneMarkerType = {
  RECT: 'RECT',
  CIRCLE: 'CIRCLE',
  IMG: 'IMG',
};

/**-------------------------------- 颜色 --------------------------------*/
// 小车状态颜色
export const VehicleStateColor = {
  Offline: Colors.gray,
  Connecting: Colors.gray,
  available: Colors.blue,
  Idle: Colors.blue,
  Working: Colors.green,
  Charging: Colors.yellow,
  Error: Colors.red,
  StandBy: Colors.purple,
  Waiting: Colors.purple,
};

// 任务状态颜色
export const TaskStatusColor = {
  New: 'warning',
  Wait: 'warning',
  Executing: 'processing',
  Finished: 'success',
  Error: 'error',
  Cancelled: 'default',
};

// 充电桩颜色
export const ChargerStateColor = {
  AVAILABLE: 0x009bda, // 可用
  ASSIGNED: 0x009f42, // 已分配
  CONNECTING: 0x5f208f, // 连接中
};

export const TaskPathColor = {
  passed: '0x808080',
  locked: '0x34bf49',
  future: '0xfbb034',
};

export const CellTypeColor = {
  blank: '0xffffff',
  normal: '0xffdd00',
  storeType: '0x49a942',
  blockType: '0x6d6e70',
};

export const GeoLockColor = {
  PATH: '0x00FFFF',
  ROTATION: '0xFFFF00',
  SPECIAL: '0xFF0000',
  WillLocked: '0xF6830F',
};

// 急停区状态颜色
export const EStopStateColor = {
  inactive: {
    color: 0x999999,
    fillColor: 0x666666,
  },
  active: {
    safe: {
      color: 0xf10d0d,
      fillColor: 0xf56161,
    },
    unSafe: {
      color: 0xffe600,
      fillColor: 0xdec674,
    },
  },
};

// 工作站状态颜色
export const StationStateColor = {
  START: '#abf579',
  PAUSED: '#fddd1c',
  END: '#f3602d',
};

export const CostColor = {
  10: '0x388e3c', // 绿色
  20: '0x1976d2', // 蓝色
  100: '0xffca28', // 黄色
  1000: '0xe64a19', // 红色
};

/**-------------------------------- 尺寸 --------------------------------*/
export const CellSize = {
  width: 60,
  height: 60,
};

export const LatentVehicleSize = {
  width: 690,
  height: 920,
};

export const ToteVehicleSize = {
  width: 860,
  height: 1560,
};

export const ToteOffset = {
  left: 440,
  right: 440,
};

export const ForkLiftVehicleSize = {
  width: 1050,
  height: 1743.5,
  radius: 1219, // 因为叉车的锚点不是车的中心点，所以这里记录叉车锚点与车头的距离(非插齿)
};

export const SorterVehicleSize = {
  width: 480,
  height: 760,
};

export const ChargerSize = {
  width: 500,
  height: 200,
};

export const LatentPodSize = {
  width: 1050,
  height: 1050,
};

export const WorkStationSize = {
  width: 2700,
  height: 2700,
};

export const CommonFunctionSize = {
  width: 1000,
  height: 1000,
};

export const ElevatorSize = {
  width: 900,
  height: 1300,
};

// 地图元素 zIndex
export const zIndex = {
  zoneMarker: 1,
  line: 1,
  label: 2,
  targetLine: 3,
  cell: 4,
  temporaryLock: 6,
  vehicle: 7,
  pod: 8,
  cellHeat: 9,
  functionIcon: 10,
  emergencyStop: 11,
  sourceLock: 12,
};

/**-------------------------------- 其他 --------------------------------*/
// 日志下载文件类型
export const LogFileTypes = [
  'syslog.txt',
  'syslog1.old',
  'syslog2.old',
  'syslog3.old',
  'config.txt',
];

// 纸张尺寸
export const PaperSize = [
  { label: 'A0', value: 'A0' },
  { label: 'A1', value: 'A1' },
  { label: 'A2', value: 'A2' },
  { label: 'A3', value: 'A3' },
  { label: 'A4', value: 'A4' },
  { label: 'A5', value: 'A5' },
];

export const JspdfData = {
  A0: [2383.94, 3370.39],
  A1: [1683.78, 2383.94],
  A2: [1190.55, 1683.78],
  A3: [841.89, 1190.55],
  A4: [595.28, 841.89],
  A5: [419.53, 595.28],
  A6: [297.64, 419.53],
  A7: [209.76, 297.64],
};

// Grid响应式常用配置
export const GridResponsive = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 12,
  xl: 12,
  xxl: 8,
};

// 潜伏料箱任务类型
export const LatentToteTaskTypeOption = [
  { label: 'app.simulateTask.toteTaskType.STATION_TO_POD', value: 'STATION_TO_POD' },
  { label: 'app.simulateTask.toteTaskType.POD_TO_STATION', value: 'POD_TO_STATION' },
];

// 页面垂直方向content以外的尺寸
export const PageContentPadding = 134;
