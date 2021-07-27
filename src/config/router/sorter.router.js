import Loadable from '@/utils/Loadable';

export default [
  {
    name: 'controlCenter',
    icon: 'icon-task',
    routes: [
      {
        path: '/sorter/center/executionQueue',
        name: 'executionQueue',
        component: Loadable(() => import('@/packages/Sorter/ExecutionQueue')),
      },
      {
        path: '/sorter/center/taskQueue',
        name: 'taskQueue',
        component: Loadable(() => import('@/packages/Sorter/TaskQueue')),
      },
      {
        path: '/sorter/center/taskManger',
        name: 'taskManger',
        component: Loadable(() => import('@/packages/Sorter/TaskLibrary')),
      },
    ],
  },
  {
    name: 'agv',
    icon: 'car',
    routes: [
      {
        path: '/sorter/agv/agvList',
        name: 'agvList',
        component: Loadable(() => import('@/packages/Sorter/AgvList')),
      },
      {
        path: '/sorter/agv/agvRealTime',
        name: 'agvRealTime',
        component: Loadable(() => import('@/packages/Sorter/AgvRealTime')),
      },
      // {
      //   path: '/sorter/agv/firmwareUpgrade',
      //   name: 'firmwareUpgrade',
      //   component: Loadable(() => import('@/packages/Sorter/FirmwareUpgrade')),
      // },
      // {
      //   path: '/sorter/agv/logDownLoad',
      //   name: 'logDownLoad',
      //   component: Loadable(() => import('@/packages/Sorter/LogDownLoad')),
      // },
    ],
  },

  // {
  //   icon: 'warning',
  //   name: 'faultManger',
  //   routes: [
  //     {
  //       path: '/sorter/faultManger/faultList',
  //       name: 'faultList',
  //       component: Loadable(() => import('@/packages/Sorter/FaultList')),
  //     },
  //     {
  //       path: '/sorter/faultManger/faultDefinition',
  //       name: 'faultDefinition',
  //       component: Loadable(() => import('@/packages/Sorter/FaultDefinition')),
  //     },
  //   ],
  // },
  // {
  //   icon: 'line-chart',
  //   name: 'formManger',
  //   routes: [
  //     {
  //       path: '/sorter/formManger/reportCenter',
  //       name: 'reportCenter',
  //       component: Loadable(() => import('@/packages/Sorter/ReportCenter')),
  //     },
  //     {
  //       path: '/sorter/formManger/taskKpi',
  //       name: 'taskKpi',
  //       component: Loadable(() => import('@/packages/Sorter/TaskKpi')),
  //     },
  //     {
  //       path: '/sorter/formManger/waitingKpi',
  //       name: 'waitingKpi',
  //       component: Loadable(() => import('@/packages/Sorter/WaitingKpi')),
  //     },
  //     {
  //       path: '/sorter/formManger/metadata',
  //       name: 'metadata',
  //       component: Loadable(() => import('@/packages/Sorter/Metadata')),
  //     },
  //   ],
  // },
  {
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/sorter/system/systemParamsManager',
        name: 'systemParamsManager',
        component: Loadable(() => import('@/packages/Sorter/SystemParamsManager')),
      },
      {
        path: '/sorter/system/chargingStrategy',
        name: 'chargingStrategy',
        component: Loadable(() => import('@/packages/Sorter/ChargingStrategy')),
      },
    ],
  },
];
