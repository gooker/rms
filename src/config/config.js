// 前端模块编码
export const AppCode = {
  ResourceManage: 'ResourceManage',
  SmartTask: 'SmartTask',
  Scene: 'Scene',
  LatentPod: 'LatentPod',
  LatentTote: 'LatentTote',
  ForkLift: 'ForkLift',
  Tote: 'Tote',
  FlexibleSorting: 'FlexibleSorting',
  Cleaning: 'Cleaning',
  AgvManned: 'AgvManned',
  Tool: 'Tool',
  Strategy: 'Strategy',
  Report: 'Report',
  SSO: 'SSO',
  Customized: 'Customized',
  Carry: 'Carry',
};

// 小车类型
export const AGVType = {
  LatentLifting: 'LatentLifting',
  Tote: 'Tote',
  ForkLifting: 'ForkLifting',
  Sorter: 'Sorter',
  LatentTote: 'LatentTote',
};

// 各类车型的API namespace
export const NameSpace = {
  Platform: 'platform',
  Coordinator: 'platform',
  SSO: 'sso',
  I18N: 'translation',
  LatentLifting: 'latent-lifting',
  Tote: 'tote',
  ForkLifting: 'forklift',
  Sorter: 'sorter',
  LatentTote: 'latentTote',
};

// 后端接口的 Server 的集合
export const ApiNameSpace = [
  'latent-lifting',
  'tote',
  'forklift',
  'coordinator',
  'ws',
  'sorter',
  'translation',
];

// 线条类型
export const LineType = {
  StraightPath: 'StraightPath',
  BezierPath: 'BezierPath',
  ArcPath: 'ArcPath',
};

// 车型
export const RobotBrand = {
  MUSHINY: 'MUSHINY',
  SEER: 'SEER',
};

// 平台支持的导航点类型，每次新增支持需要手动加，且必须要配置坐标类型
export const NavigationCellType = [
  {
    code: RobotBrand.MUSHINY,
    name: 'MUSHINY',
    color: '#037ef3',
    coordinationType: 'L',
  },
  {
    code: RobotBrand.SEER,
    name: 'SEER',
    color: '#00aeff',
    coordinationType: 'R',
  },
];

// 坐标类型
export const CoordinateType = {
  LAND: 'land',
  NAVI: 'navi',
};
