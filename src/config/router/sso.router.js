import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.SSO}/userManager`, // 用户管理
    name: 'userManager',
    icon: 'user',
    component: '/SSO/UserManager',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SSO}/sectionManager`, // 区域管理
    name: 'sectionManger',
    icon: 'section',
    component: '/SSO/SectionManager',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: `/${AppCode.SSO}/roleManager`, // 角色管理
    name: 'roleManager',
    icon: 'userRole',
    component: '/SSO/RoleManager',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: `/${AppCode.SSO}/userLoginHistory`, // 用户登录历史
    name: 'userLoginHistory',
    icon: 'history',
    component: '/SSO/UserLoginHistory',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SSO}/accountCenter`, // 个人中心
    name: 'accountCenter',
    icon: 'home',
    component: '/SSO/AccountCenter',
    authority: ['SUPERMANAGER', 'MANAGER', 'USER'],
  },
  {
    path: `/${AppCode.SSO}/authorizationCenter`, // 授权中心
    name: 'authorizationCenter',
    icon: 'authorize',
    component: '/SSO/AuthorizationCenter',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: `/${AppCode.SSO}/customConfiguration`, // 定制化配置
    name: 'customConfiguration',
    icon: 'customConfig',
    component: '/SSO/CustomConfiguration',
    authority: ['ADMIN'],
  },
  {
    path: `/${AppCode.SSO}/environmentManager`, // 自定义环境
    name: 'environmentManger',
    icon: 'ie',
    component: '/SSO/EnvironmentManger',
    hooks: ['dev'],
  },
];
