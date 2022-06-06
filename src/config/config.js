// 前端模块编码
export const AppCode = {
  Scene: 'Scene',
  ResourceManage: 'ResourceManage',
  LatentPod: 'LatentPod',
  LatentTote: 'LatentTote',
  Tote: 'Tote',
  FlexibleSorting: 'FlexibleSorting',
  SmartTask: 'SmartTask',
  Strategy: 'Strategy',
  Report: 'Report',
  SSO: 'SSO',

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
  SSO: 'sso',
  I18N: 'translation',
  WS: 'ws',
};

// 线条类型
export const LineType = {
  StraightPath: 'StraightPath',
  BezierPath: 'BezierPath',
  ArcPath: 'ArcPath',
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

// 坐标类型
export const CoordinateType = {
  LAND: 'land',
  NAVI: 'navi',
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
