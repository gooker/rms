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
  Charger: 'Charger',
  LatentLifting: 'LatentLifting',
  Tote: 'Tote',
  ForkLifting: 'ForkLifting',
  Sorter: 'Sorter',
};

// 各类车型的API namespace
export const NameSpace = {
  Mixrobot: 'coordinator',
  SSO: 'sso',
  I18N: 'translation',
  LatentLifting: 'latent-lifting',
  Tote: 'tote',
  ForkLifting: 'forklift',
  Sorter: 'sorter',
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

// 后端接口的 Server Context_Path
export const ApiNameSpace = ['latent-lifting', 'tote', 'forklift', 'coordinator', 'WS', 'sorter'];
