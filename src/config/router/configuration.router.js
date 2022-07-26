import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.Configuration}/strategy`,
    name: 'strategy',
    icon: 'strategy',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Configuration}/strategy/charging`,
        name: 'chargingStrategy',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/Configuration/ChargingStrategy',
      },
    ],
  },
  {
    path: `/${AppCode.Configuration}/system`,
    name: 'systemConfig',
    icon: 'list',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Configuration}/system/parameters`,
        name: 'parameters',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/Configuration/SystemParameters',
      },
      {
        path: `/${AppCode.Configuration}/system/requestor`,
        name: 'requestor',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/Configuration/Requestor/index',
      },
      {
        path: `/${AppCode.Configuration}/system/richEditor`,
        name: 'richEditor',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/Configuration/RichEditor/index',
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.Configuration}/system/timeZone`,
        name: 'timeZone',
        component: '/Configuration/SystemTimezone/index',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Configuration}/system/i18n`,
        name: 'i18n',
        component: '/Configuration/LanguageManage/index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.Configuration}/integration`,
    name: 'integration',
    icon: 'layout',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Configuration}/integration/webHook`, // WebHook
        name: 'webHook',
        component: '/Configuration/Integration/WebHook/index',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Configuration}/customConfiguration`, // 自定义LOGO
        name: 'customLogo',
        component: '/Configuration/CustomLogo',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Configuration}/authorizationCenter`, // 授权中心
        name: 'authorizationCenter',
        component: '/Configuration/AuthorizationCenter',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Configuration}/customMenuManager`, // 自定义菜单
        name: 'customMenuManager',
        component: '/Configuration/CustomMenuManager',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Configuration}/broadcastChannel`,
        name: 'broadcastChannel',
        component: '/SSO/NotificationCenter/BroadcastChannel',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
    ],
  },
];
