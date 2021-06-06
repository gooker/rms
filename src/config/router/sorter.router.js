import Loadable from '@/utils/Loadable';

export default [
  {
    name: 'controlCenter',
    icon: 'icon-task',
    routes: [
      {
        path: '/sorter/center/executionQueue',
        name: 'executionQueue',
        component: Loadable(() => import('@/packages/Sorter/pages/ExecutionQueue')),
      },
      {
        path: '/sorter/center/taskQueue',
        name: 'taskQueue',
        component: Loadable(() => import('@/packages/Sorter/pages/TaskQueue')),
      },
      {
        path: '/sorter/center/taskManger',
        name: 'taskManger',
        component: Loadable(() => import('@/packages/Sorter/pages/TaskLibrary')),
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
        component: Loadable(() => import('@/packages/Sorter/pages/AgvRealTime')),
      },
      {
        path: '/sorter/agv/firmwareUpgrade',
        name: 'firmwareUpgrade',
        component: Loadable(() => import('@/packages/Sorter/pages/FirmwareUpgrade')),
      },
      {
        path: '/sorter/agv/logDownLoad',
        name: 'logDownLoad',
        component: Loadable(() => import('@/packages/Sorter/pages/LogDownLoad')),
      },
    ],
  },

  {
    icon: 'warning',
    name: 'faultManger',
    routes: [
      {
        path: '/sorter/faultManger/faultList',
        name: 'faultList',
        component: Loadable(() => import('@/packages/Sorter/pages/FaultList')),
      },
      {
        path: '/sorter/faultManger/faultDefinition',
        name: 'faultDefinition',
        component: Loadable(() => import('@/packages/Sorter/pages/FaultDefinition')),
      },
    ],
  },
  {
    icon: 'line-chart',
    name: 'formManger',
    routes: [
      {
        path: '/sorter/formManger/reportCenter',
        name: 'reportCenter',
        component: Loadable(() => import('@/packages/Sorter/pages/ReportCenter')),
      },
      {
        path: '/sorter/formManger/taskKpi',
        name: 'taskKpi',
        component: Loadable(() => import('@/packages/Sorter/pages/TaskKpi')),
      },
      {
        path: '/sorter/formManger/waitingKpi',
        name: 'waitingKpi',
        component: Loadable(() => import('@/packages/Sorter/pages/WaitingKpi')),
      },
      {
        path: '/sorter/formManger/metadata',
        name: 'metadata',
        component: Loadable(() => import('@/packages/Sorter/pages/Metadata')),
      },
    ],
  },
  {
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/sorter/system/systemParamsManager',
        name: 'systemParamsManager',
        component: Loadable(() => import('@/packages/Sorter/pages/SystemParamsManager')),
      },
      {
        path: '/sorter/system/chargerManageMents',
        name: 'chargeManagement',
        component: Loadable(() => import('@/packages/Sorter/pages/ChargeManagement')),
      },
    ],
  },
];
