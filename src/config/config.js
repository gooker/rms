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
