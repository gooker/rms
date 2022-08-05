import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.DevOps}/systemLogWarehouse`, // 系统日志
    name: 'systemLogWarehouse',
    icon: 'systemLog',
    component: '/DevOps/IntegrationLogManagement',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: `/${AppCode.DevOps}/operationLog`, // 操作日志
    name: 'operationLog',
    icon: 'log',
    component: '/DevOps/OperationLog/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.DevOps}/alertCenter`, // 告警中心
    name: 'alertCenter',
    icon: 'alert',
    component: '/DevOps/AlertCenter/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
  },
  {
    path: `/${AppCode.DevOps}/PDA`, // 虚拟PDA
    name: 'pda',
    icon: 'pda',
    component: '/DevOps/PDA',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  // {
  //   path: `/${AppCode.DevOps}/upgradeOnline`, // 在线升级
  //   name: 'upgradeOnline',
  //   icon: 'upgrade',
  //   component: '/DevOps/UpgradeOnline/index',
  //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  // },
  // {
  //   path: `/${AppCode.DevOps}/performanceMonitoring`, // 性能监控
  //   name: 'performanceMonitoring',
  //   icon: 'performanceMonitoring',
  //   component: '/DevOps/performanceMonitoring',
  //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  // },
  // {
  //   path: `/${AppCode.DevOps}/feedback`, // 问题反馈
  //   name: 'feedback',
  //   icon: 'feedback',
  //   component: '/DevOps/FeedBack',
  //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  // },
  // {
  //   path: `/${AppCode.DevOps}/utilBox`, // 实用工具
  //   name: 'utilBox',
  //   icon: 'utilBox',
  //   component: '/DevOps/FeedBack',
  //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  // },
  {
    path: `/${AppCode.DevOps}/system/requestor`, // 接口请求库
    name: 'requestor',
    icon: 'api',
    authority: ['ADMIN', 'SUPERMANAGER'],
    component: '/Configuration/Requestor/index',
  },
  // {
  //   path: `/${AppCode.DevOps}/db`, // 数据库操作
  //   name: 'db',
  //   icon: 'db',
  //   component: '/DevOps/DataBase',
  //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  // },
];
