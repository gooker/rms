export const GlobalAlpha = 0.6;
export const MapScaleRatio = 1.3;

export const SelectionType = {
  SINGLE: 'SINGLE',
  CTRL: 'CTRL',
  SHIFT: 'SHIFT',
};

export const Colors = {
  red: '#ff0000',
  blue: '#1890ff',
  green: '#3cb371',
  yellow: '#ffc107',
  grey: '#9E9E9E',
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

// 小车状态
export const VehicleState = {
  error: 'Error', // error
  standBy: 'StandBy', // stand_by
  charging: 'Charging', // charging
  working: 'Working', // on_task
  offline: 'Offline', // offline
  connecting: 'Connecting', // offline
  waiting: 'Waiting', // offline
};

// 小车状态颜色
export const VehicleStateColor = {
  available: '#7ac143',
  Idle: '#7ac143',
  StandBy: '#0092FF',
  Working: '#2F8949',
  Charging: '#eba954',
  Offline: '#9E9E9E',
  Connecting: '#9E9E9E',
  Error: '#fe5000',
  Waiting: '#a356f4',
};

// 任务状态(Bage组件)
export const TaskStateBageType = {
  New: 'warning',
  Executing: 'processing',
  Finished: 'success',
  Error: 'error',
  Cancel: 'default',
};

// 充电桩颜色
export const ChargerStateColor = {
  AVAILABLE: 0x009bda, // 可用
  ASSIGNED: 0x009f42, // 已分配
  CONNECTING: 0x5f208f, // 连接中
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

// Size
export const CellSize = {
  width: 100,
  height: 100,
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
  width: 200,
  height: 500,
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

export const CellTypeSize = {
  width: 80,
  height: 80,
};

export const TaskPathColor = {
  passed: '0x808080', // 灰色
  locked: '0x34bf49', // 暗绿色
  future: '0xfbb034', // 黄色
};

export const CellTypeColor = {
  storeType: '0x49a942', // 绿色
  blockType: '0x6d6e70', // 灰色
  normal: '0xffdd00', // 黄色
};

export const GeoLockColor = {
  PATH: '0x00FFFF', // 亮蓝色
  ROTATION: '0xFFFF00', // 黄色
  SPECIAL: '0xFF0000', // 红色
  WillLocked: '0xF6830F', // 橙色
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
};

// 日志下载文件类型
export const LogFileTypes = [
  'syslog.txt',
  'syslog1.old',
  'syslog2.old',
  'syslog3.old',
  'config.txt',
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
  // 车型数据与 config.VehicleType 保持一致
  LatentLifting: 'LatentLifting',
  Tote: 'Tote',
  ForkLifting: 'ForkLifting',
  Sorter: 'Sorter',

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

// 小车子类型
export const VehicleSubTypeMap = {
  LatentLifting: [
    {
      label: 'monitor.simulator.subType.normal',
      value: 'Normal',
    },
    {
      label: 'monitor.simulator.subType.infrared',
      value: 'Infrared',
    },
    {
      label: 'monitor.simulator.subType.frock',
      value: 'Frock',
    },
    {
      label: 'monitor.simulator.subType.tote',
      value: 'Tote',
    },
  ],
  Tote: [
    {
      label: 'monitor.simulator.subType.normal',
      value: 'Normal',
    },
    {
      label: 'monitor.simulator.subType.infrared',
      value: 'Infrared',
    },
  ],
};

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
  xl: 6,
  xxl: 4,
};

// 潜伏料箱任务类型
export const LatentToteTaskTypeOption = [
  { label: 'app.simulateTask.toteTaskType.STATION_TO_POD', value: 'STATION_TO_POD' },
  { label: 'app.simulateTask.toteTaskType.POD_TO_STATION', value: 'POD_TO_STATION' },
];

// 页面垂直方向content以外的尺寸
export const PageContentPadding = 134;
