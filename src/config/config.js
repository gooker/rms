// 前端模块编码
export const AppCode = {
  ResourceManage: 'ResourceManage',
  SmartTask: 'SmartTask',
  LatentPod: 'LatentPod',
  LatentTote: 'LatentTote',
  Tote: 'Tote',
  FlexibleSorting: 'FlexibleSorting',
  Scene: 'Scene',
  Report: 'Report',
  Strategy: 'Strategy',
  SSO: 'SSO',

  // 暂时用不到
  ForkLift: 'ForkLift',
  Cleaning: 'Cleaning',
  VehicleManned: 'VehicleManned',
  Tool: 'Tool',
  Customized: 'Customized',
  Carry: 'Carry',
};

// 小车类型
export const VehicleType = {
  LatentLifting: 'LatentLifting',
  Tote: 'Tote',
  ForkLifting: 'ForkLifting',
  Sorter: 'Sorter',
  LatentTote: 'LatentTote',
};

// namespace
export const NameSpace = {
  Platform: 'platform',
  WS: 'ws',
};

// 线条类型
export const LineType = {
  StraightPath: 'StraightPath',
  BezierPath: 'BezierPath',
  ArcPath: 'ArcPath',
};

// 地图编程的对象
export const ProgramingItemType = {
  cell: 'cell',
  relation: 'relation',
  zone: 'zone',
};

// 地图编程-线条的timing枚举
export const RelationTiming = {
  begin: 'BEGIN',
  onRoad: 'ONROAD',
  end: 'END',
};

/***************************** 地图转换相关 *****************************/
// 坐标类型: land 表示物理坐标、navi表示导航坐标
export const CoordinateType = {
  LAND: 'land',
  NAVI: 'navi',
};

// 导航类型枚举
export const NavigationType = {
  M_QRCODE: 'mqrcode',
  SEER_SLAM: 'seerslam',
};

// 导航类型枚举所对应的具体信息，比如：点位颜色、坐标系类型
export const NavigationTypeView = [
  {
    code: NavigationType.M_QRCODE,
    name: NavigationType.M_QRCODE,
    color: '#037ef3',
    coordinationType: 'L',
  },
  {
    code: NavigationType.SEER_SLAM,
    name: NavigationType.SEER_SLAM,
    color: '#8e43e7',
    coordinationType: 'R',
  },
];
