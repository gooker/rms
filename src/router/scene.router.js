import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.Scene}/map`,
    name: 'map',
    icon: 'map',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.Scene}/map/editor`,
        name: 'editor',
        component: '/Scene/MapEditor/index',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.Scene}/map/monitor`,
        name: 'monitor',
        component: '/Scene/MapMonitor/index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.Scene}/map/recorder`,
        name: 'recorder',
        component: '/Scene/MapRecorder/index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.Scene}/customDashboard`,
    name: 'customDashboard',
    icon: 'screenReport',
    component: '/Scene/CustomDashboard/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];
