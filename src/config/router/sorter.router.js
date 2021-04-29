import Loadable from '@/utils/Loadable';

export default [
  {
    name: 'controlCenter',
    icon: 'icon-task',
    routes: [
      {
        path: '/sorter/center/executionQueue',
        name: 'executionQueue',
        component: Loadable(() => import('@/modules/Sorter/pages/ExecutionQueue')),
      },
      {
        path: '/sorter/center/taskQueue',
        name: 'taskQueue',
        component: Loadable(() => import('@/modules/Sorter/pages/TaskQueue')),
      },
      {
        path: '/sorter/center/taskManger',
        name: 'taskManger',
        component: Loadable(() => import('@/modules/Sorter/pages/TaskLibrary')),
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
        component: Loadable(() => import('@/modules/Sorter/pages/AgvList')),
      },
      {
        path: '/sorter/agv/activityLogging',
        name: 'activityLogging',
        component: '/ControlCenter/ActivityLogging',
      },
      {
        path: '/sorter/agv/batchFirmwareUpgrade',
        name: 'batchFirmwareUpgrade',
        component: '/CarManger/BatchFirmware',
      },
      {
        path: '/sorter/agv/firmwareUpgrade',
        name: 'firmwareUpgrade',
        component: '/CarManger/FirmwarUpdate',
        hideInMenu: true,
      },
      {
        path: '/sorter/agv/loggerDownLoad',
        name: 'loggerDownLoad',
        component: '/CarManger/LoggerDownLoad',
      },
    ],
  },

  {
    icon: 'warning',
    name: 'faultManger',
    routes: [
      {
        path: '/sorter/faultManger/faultInfo',
        name: 'faultInfo',
        component: '/Fault/FaultInfo',
      },
      {
        path: '/sorter/faultManger/faultDefinition',
        name: 'faultDefinition',
        component: '/Fault/FaultDefinition',
      },
    ],
  },
  {
    icon: 'line-chart',
    name: 'formManger',
    routes: [
      {
        path: '/sorter/formManger/robotErrorInfo',
        name: 'robotErrorInfo',
        component: '/Form/Forms',
      },
      {
        path: '/sorter/formManger/taskKpi',
        name: 'taskKPIform',
        component: '/TaskKpi/TaskKpi',
      },
      {
        path: '/sorter/formManger/waitingKpi',
        name: 'waitingKpiForm',
        component: './WaitingKpi/WaitingKpi',
      },
      {
        path: '/sorter/formManger/detailFroms',
        name: 'detailFroms',
        component: '/Form/DetailFroms',
        hideInMenu: true,
      },
      {
        path: '/sorter/formManger/metadata',
        name: 'metadata',
        component: './Form/Metadata',
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
        component: '/System/SystemParamsManager',
      },
      {
        path: '/sorter/system/chargerManageMents',
        name: 'chargeManagement',
        component: '/ChargeCenter/ChargeManageMents',
      },
    ],
  },
];
