export default [
  {
    path: '/sso/userManager', // 用户管理
    name: 'userManager',
    icon: 'user',
    component: '/SSO_/UserManager',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: '/sso/sectionManager', // 区域管理
    name: 'sectionManger',
    icon: 'file',
    component: '/SSO/SectionManger',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: '/sso/roleManager', // 角色管理
    name: 'roleManager',
    icon: 'user',
    component: '/SSO/RoleManager',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: '/sso/userLoginHistory', // 用户登录历史
    name: 'userLoginHistory',
    icon: 'clock-circle',
    component: '/SSO/UserLoginHistory',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: '/sso/accountCenter', // 个人中心
    name: 'accountCenter',
    icon: 'home',
    component: '/SSO/AccountCenter',
    authority: ['USER', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: '/sso/authorizationCenter', // 授权中心
    name: 'authorizationCenter',
    icon: 'authority',
    component: '/SSO/AuthorizationCenter',
    authority: ['ADMIN'],
  },
  {
    path: '/sso/environmentManager', // 自定义环境
    name: 'environmentManger',
    icon: 'ie',
    component: '/SSO/EnvironmentManger',
  },
];
