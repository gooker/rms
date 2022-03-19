import { AppCode } from '../config';

export default [
  {
    path: `/${AppCode.Scene}/map`,
    name: 'map',
    icon: 'environment',
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
    icon: 'environment',
    component: '/Scene/CustomDashboard/index',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
];
