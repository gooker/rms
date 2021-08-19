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

// 模块编码
export const AppCode = {
  Mixrobot: 'Mixrobot',
  LatentLifting: 'LatentLifting',
  Tote: 'Tote',
  ForkLifting: 'ForkLifting',
  Sorter: 'Sorter',
  SSO: 'SSO',
  I18N: 'I18N',
};

// 各类车型的API namespace
export const NameSpace = {
  Coordinator: 'coordinator',
  SSO: 'sso',
  [AGVType.LatentLifting]: 'latent-lifting',
  [AGVType.Tote]: 'tote',
  [AGVType.ForkLifting]: 'forklift',
  [AGVType.Sorter]: 'sorter',
  [AGVType.Sorter]: 'sorter',
};
