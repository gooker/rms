export const WorldScreenRatio = 1.2;
export const GlobalAlpha = 0.6;
export const GlobalDrawerWidth = 450;

export const Colors = {
  red: '#ff0000',
  blue: '#008eff',
  green: '#388e3c',
  yellow: '#ffc107',
  grey: '#9E9E9E',
};

// 小车状态
export const AGVState = {
  error: 'Error', // error
  standBy: 'StandBy', // stand_by
  charging: 'Charging', // charging
  working: 'Working', // on_task
  offline: 'Offline', // offline
  connecting: 'Connecting', // offline
  waiting: 'Waiting', // offline
};

// 小车状态颜色
export const AgvStateColor = {
  available: '#7ac143',
  StandBy: '#0092FF',
  Working: '#2F8949',
  Charging: '#eba954',
  Offline: '#9E9E9E',
  Connecting: '#9E9E9E',
  Error: '#fe5000',
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

export const CostColor = {
  10: '0x388e3c', // 绿色
  20: '0x1976d2', // 蓝色
  100: '0xffca28', // 黄色
  1000: '0xe64a19', // 红色
};

// Size
export const SpotSize = {
  width: 100,
  height: 100,
};

export const LatentAGVSize = {
  width: 690,
  height: 920,
};

export const ToteAGVSize = {
  width: 860,
  height: 1560,
};

export const ToteOffset = {
  left: 440,
  right: 440,
};

export const ForkLiftAGVSize = {
  width: 1050,
  height: 1743.5,
  radius: 1219, // 因为叉车的锚点不是车的中心点，所以这里记录叉车锚点与车头的距离(非插齿)
};

export const SorterAGVSize = {
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
  width: 2000,
  height: 1500,
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
  storeType: '0x0AA678', // 绿色
  blockType: '0x808080', // 灰色
};

export const GeoLockColor = {
  PATH: '0x00FFFF', // 亮蓝色
  ROTATION: '0xFFFF00', // 黄色
  SPECIAL: '0xFF0000', // 红色
  WillLocked: '0xF6830F', // 橙色
};

// 地图元素 zIndex
export const zIndex = {
  targetLine: 1,
  cell: 2,
  line: 3,
  groundStorage: 4,
  temporaryLock: 4,
  agv: 5,
  pod: 6,
  cellHeat: 7,
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
