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
  // {
  //   path: `/${AppCode.Configuration}/integration`,
  //   name: 'integration',
  //   icon: 'layout',
  //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  //   routes: [
  //     {
  //       path: `/${AppCode.Configuration}/integration/webHook`, // WebHook
  //       name: 'webHook',
  //       component: '/Configuration/Integration/WebHook/index',
  //       authority: ['ADMIN', 'SUPERMANAGER'],
  //     },
  //   ],
  // },
  {
    path: `/${AppCode.Configuration}/system`,
    name: 'systemConfig',
    icon: 'setting',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Configuration}/system/global`, // 全域级配置
        name: 'globalConfig',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          // {
          //   path: `/${AppCode.Configuration}/system/global/oem`, // OEM
          //   name: 'oem',
          //   component: '/Configuration/OEM',
          //   authority: ['ADMIN', 'SUPERMANAGER'],
          // },
          // {
          //   path: `/${AppCode.Configuration}/system/global/customMenuManager`, // 自定义菜单
          //   name: 'customMenuManager',
          //   component: '/Configuration/CustomMenuManager',
          //   authority: ['ADMIN', 'SUPERMANAGER'],
          // },
          {
            path: `/${AppCode.Configuration}/system/global/richEditor`, // 富文本编辑
            name: 'richEditor',
            component: '/Configuration/RichEditor/index',
            hooks: ['dev'],
          },
          {
            path: `/${AppCode.Configuration}/system/global/timeZone`, // 时区设置
            name: 'timeZone',
            component: '/Configuration/SystemTimezone/index',
            authority: ['ADMIN', 'SUPERMANAGER'],
          },
          {
            path: `/${AppCode.Configuration}/system/global/i18n`, // 国际化
            name: 'i18n',
            component: '/Configuration/LanguageManage/index',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      {
        path: `/${AppCode.Configuration}/system/section`, // 区域级配置
        name: 'sectionConfig',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          // {
          //   path: `/${AppCode.Configuration}/system/section/parameters`, // 参数配置
          //   name: 'parameters',
          //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          //   component: '/Configuration/SystemParameters',
          // },
          {
            path: `/${AppCode.Configuration}/system/section/parameterList`, // 参数列表(原系统参数配置)
            name: 'parameterList',
            component: '/Configuration/SystemParameterList/index',
            hooks: ['dev'],
          },
        ],
      },
    ],
  },
];
