import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.Sorter}/center`,
    name: 'task',
    icon: 'icon-task',
    routes: [
      {
        path: `/${AppCode.Sorter}/task/executionQueue`,
        name: 'executionQueue',
        component: '/Sorter/ExecutionQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Sorter}/task/taskQueue`,
        name: 'waitingQueue',
        component: '/Sorter/WaitingQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Sorter}/task/taskLibrary`,
        name: 'taskLibrary',
        component: '/Sorter/TaskLibrary.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
  {
    path: `/${AppCode.Sorter}/agv`,
    name: 'agv',
    icon: 'agv',
    routes: [
      {
        path: `/${AppCode.Sorter}/agv/agvList`,
        name: 'agvList',
        component: '/Sorter/AgvList.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Sorter}/agv/agvRealTime`,
        name: 'agvRealTime',
        component: '/Sorter/AgvRealTime.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
  {
    path: `/${AppCode.Sorter}/system`,
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: `/${AppCode.Sorter}/system/systemParamsManager`,
        name: 'systemParams',
        component: '/Sorter/SystemParams.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Sorter}/system/chargingStrategy`,
        name: 'chargingStrategy',
        component: '/Sorter/ChargingStrategy.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
];
