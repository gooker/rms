import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.LatentLifting}/task`,
    name: 'task',
    icon: 'icon-task',
    routes: [
      {
        path: `/${AppCode.LatentLifting}/task/executionQueue`,
        name: 'executionQueue',
        component: '/LatentLifting/ExecutionQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.LatentLifting}/task/taskQueue`,
        name: 'waitingQueue',
        component: '/LatentLifting/WaitingQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.LatentLifting}/task/taskLibrary`,
        name: 'taskLibrary',
        component: '/LatentLifting/TaskLibrary.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.LatentLifting}/agv`,
    name: 'agv',
    icon: 'agv',
    routes: [
      {
        path: `/${AppCode.LatentLifting}/agv/agvList`,
        name: 'agvList',
        component: '/LatentLifting/AgvList.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.LatentLifting}/agv/agvRealTime`,
        name: 'agvRealTime',
        component: '/LatentLifting/AgvRealTime.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.LatentLifting}/agv/batchFirmwareUpgrade`,
        name: 'batchFirmwareUpgrade',
        component: '/LatentLifting/BatchUpgrading.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.LatentLifting}/agv/logDownLoad`,
        name: 'logDownLoad',
        component: '/LatentLifting/LogDownload.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: `/${AppCode.LatentLifting}/storageManagement`,
    name: 'storageManagement',
    hooks: ['dev'],
    icon: 'icon-warehouse',
    component: '/LatentLifting/StorageManagement',
  },
  {
    path: `/${AppCode.LatentLifting}/taskDispatch`,
    name: 'taskDispatch',
    hooks: ['dev'],
    icon: 'icon-dispatch',
    component: '/LatentLifting/TaskDispatch',
  },
  {
    path: `/${AppCode.LatentLifting}/faultManagement`,
    icon: 'warning',
    name: 'faultManagement',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.LatentLifting}/faultManagement/faultList`,
        name: 'faultList',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/FaultList',
      },
      {
        path: `/${AppCode.LatentLifting}/faultManagement/faultDefinition`,
        name: 'faultDefinition',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/FaultDefinition',
      },
    ],
  },
  {
    path: `/${AppCode.LatentLifting}/formManger`,
    icon: 'line-chart',
    name: 'formManger',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.LatentLifting}/formManger/reportCenter`,
        name: 'reportCenter',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/ReportCenter.js',
      },
      {
        path: `/${AppCode.LatentLifting}/formManger/taskKpi`,
        name: 'taskKpi',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/TaskKpi',
      },
      {
        path: `/${AppCode.LatentLifting}/formManger/waitingKpi`,
        name: 'waitingKpi',
        hooks: ['dev'],
        component: '/LatentLifting/WaitingKpi',
      },
      {
        path: `/${AppCode.LatentLifting}/formManger/stationKpi`,
        name: 'stationKpi',
        hooks: ['dev'],
        component: '/LatentLifting/StationKpi',
      },
      {
        path: `/${AppCode.LatentLifting}/formManger/metadata`,
        name: 'metadata',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/LatentLifting/MetaData',
      },
    ],
  },
  {
    path: `/${AppCode.LatentLifting}/system`,
    name: 'system',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    icon: 'setting',
    routes: [
      {
        path: `/${AppCode.LatentLifting}/system/systemParams`,
        name: 'systemParams',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/LatentLifting/SystemParams.js',
      },
      {
        path: `/${AppCode.LatentLifting}/system/chargingStrategy`,
        name: 'chargingStrategy',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/ChargingStrategy.js',
      },
    ],
  },
];
