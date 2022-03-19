import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Tool}/operationLog`,
    name: 'operationLog',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    component: '/Tool/OperationLog/index',
  },
  {
    path: `/${AppCode.Tool}/requestor`,
    name: 'requestor',
    icon: 'api',
    component: '/Tool/Requestor/Requestor/index',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: `/${AppCode.Tool}/richEditor`,
    name: 'richEditor',
    icon: 'richEditor',
    component: '/Tool/RichEditor/index',
    hooks: ['dev'],
  },
  {
    path: `/${AppCode.Tool}/alertCenter`,
    icon: 'line-chart',
    name: 'alertCenter',
    component: '/Tool/AlertCenter/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
    hideInMenu: true,
  },
  {
    path: `/${AppCode.Tool}/notificationCenter`,
    name: 'notificationCenter',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Tool}/notificationCenter/broadcast`,
        name: 'broadcast',
        component: '/Tool/NotificationCenter/BroadcastChannel',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Tool}/notificationCenter/subscription`,
        name: 'subscription',
        component: '/Tool/NotificationCenter/ChannelSubscription',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
];
