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
    path: `/${AppCode.SSO}/channelSubscription`, // 频道订阅
    name: 'channelSubscription',
    icon: 'subscription',
    component: '/SSO/NotificationCenter/ChannelSubscription',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.SSO}/accountCenter`, // 个人中心
    name: 'accountCenter',
    icon: 'home',
    component: '/SSO/AccountCenter',
    authority: ['SUPERMANAGER', 'MANAGER', 'USER'],
  },
];
