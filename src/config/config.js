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

// @即将废弃(使用AppCode): 每个App的 BaseConText(微服务的前缀), 同时也是 AppBar 中各个WCS的代号
export const BaseContext = {
  Mixrobot: 'mixrobot',
  LatentLifting: 'latent-lifting',
  ForkLifting: 'forklift',
  Tote: 'tote-wcs-gui',
  Sorter: 'sorter',
  SSO: 'sso',
  I18N: 'i18n',
};
