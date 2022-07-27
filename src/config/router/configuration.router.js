import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.Configuration}/authorizationCenter`, // 授权中心
    name: 'authorizationCenter',
    icon: 'authorization',
    component: '/Configuration/AuthorizationCenter',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
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
    ],
  },
  {
    path: `/${AppCode.Configuration}/system`,
    name: 'systemConfig',
    icon: 'setting',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Configuration}/oem`, // OEM
        name: 'oem',
        component: '/Configuration/OEM',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Configuration}/customMenuManager`, // 自定义菜单
        name: 'customMenuManager',
        component: '/Configuration/CustomMenuManager',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
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
];
