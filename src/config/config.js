// PIXI 渲染参数
export const WorldScreenRatio = 1.2;
export const CellWidth = 100;
export const CellHeight = 100;

// 小车类型
export const AGVType = {
  LatentLifting: 'LatentLifting',
  Tote: 'Tote',
  ForkLifting: 'ForkLifting',
  Sorter: 'Sorter',
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

// 前端模块编码
export const AppCode = {
  Mixrobot: 'Mixrobot',
  SSO: 'SSO',
  I18N: 'I18N',
  [AGVType.LatentLifting]: 'LatentLifting',
  [AGVType.Tote]: 'Tote',
  [AGVType.ForkLifting]: 'ForkLifting',
  [AGVType.Sorter]: 'Sorter',
};

// 各类车型的API namespace
export const NameSpace = {
  [AppCode.Mixrobot]: 'coordinator',
  [AppCode.SSO]: 'sso',
  [AppCode.I18N]: 'translation',
  [AGVType.LatentLifting]: 'latent-lifting',
  [AGVType.Tote]: 'tote',
  [AGVType.ForkLifting]: 'forklift',
  [AGVType.Sorter]: 'sorter',
};

// 每个App的 BaseConText(微服务的前缀), 同时也是 AppBar 中各个WCS的代号
export const BaseContext = {
  Coordinator: 'mixrobot',
  LatentLifting: 'latent-lifting',
  ForkLifting: 'forklift',
  Tote: 'tote-wcs-gui',
  Slam: 'slam',
  Sorter: 'sorter',
  SSO: 'sso',
  I18N: 'i18n',
};
