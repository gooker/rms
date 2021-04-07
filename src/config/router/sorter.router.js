import Loadable from '@/utils/Loadable';

// 异步加载组件
const ExecutionQueue = Loadable(() => import('@/modules/Sorter/pages/ExecutionQueue'));
const TaskQueue = Loadable(() => import('@/modules/Sorter/pages/TaskQueue'));
const TaskLibrary = Loadable(() => import('@/modules/Sorter/pages/TaskLibrary'));

export default [
  {
    name: 'controlCenter',
    icon: 'icon-task',
    routes: [
      {
        path: '/sorter/center/executionQueue',
        name: 'executionQueue',
        component: ExecutionQueue,
      },
      {
        path: '/sorter/center/taskQueue',
        name: 'taskQueue',
        component: TaskQueue,
      },
      {
        path: '/sorter/center/taskManger',
        name: 'taskManger',
        component: TaskLibrary,
      },
    ],
  },
  {
    name: 'car',
    icon: 'car',
    routes: [
      {
        path: '/sorter/car/carManger',
        name: 'carManger',
        component: '/CarManger/CarList',
      },
      {
        path: '/sorter/car/activityLogging',
        name: 'activityLogging',
        component: '/ControlCenter/ActivityLogging',
      },
      {
        path: '/sorter/car/batchFirmwareUpgrade',
        name: 'batchFirmwareUpgrade',
        component: '/CarManger/BatchFirmware',
      },
      {
        path: '/sorter/car/firmwareUpgrade',
        name: 'firmwareUpgrade',
        component: '/CarManger/FirmwarUpdate',
        hideInMenu: true,
      },
      {
        path: '/sorter/car/loggerDownLoad',
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
