export default [
  {
    path: '/latentLifting/task',
    name: 'task',
    icon: 'icon-task',
    routes: [
      {
        path: '/latentLifting/task/executionQueue',
        name: 'executionQueue',
        component: '/LatentLifting/ExecutionQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/latentLifting/task/taskQueue',
        name: 'waitingQueue',
        component: '/LatentLifting/WaitingQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/latentLifting/task/taskLibrary',
        name: 'taskLibrary',
        component: '/LatentLifting/TaskLibrary.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: '/latentLifting/agv',
    name: 'agv',
    icon: 'agv',
    routes: [
      {
        path: '/latentLifting/agv/agvList',
        name: 'agvList',
        component: '/LatentLifting/AgvList.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/latentLifting/agv/agvRealTime',
        name: 'agvRealTime',
        component: '/LatentLifting/AgvRealTime.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/latentLifting/agv/batchFirmwareUpgrade',
        name: 'batchFirmwareUpgrade',
        component: '/LatentLifting/BatchUpgrading.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/latentLifting/agv/logDownLoad',
        name: 'logDownLoad',
        component: '/LatentLifting/LogDownload.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
  },
  {
    path: '/latentLifting/storageManagement',
    name: 'storageManagement',
    hooks: ['dev'],
    icon: 'icon-warehouse',
    component: '/LatentLifting/StorageManagement',
  },
  {
    path: '/latentLifting/taskDispatch',
    name: 'taskDispatch',
    hooks: ['dev'],
    icon: 'icon-dispatch',
    component: '/LatentLifting/TaskDispatch',
  },
  {
    path: '/latentLifting/faultManagement',
    icon: 'warning',
    name: 'faultManagement',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: '/latentLifting/faultManagement/faultList',
        name: 'faultList',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/FaultList',
      },
      {
        path: '/faultManger/faultDefinition',
        name: 'faultDefinition',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/FaultDefinition',
      },
    ],
  },
  {
    path: '/latentLifting/formManger',
    icon: 'line-chart',
    name: 'formManger',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: '/latentLifting/formManger/reportCenter',
        name: 'reportCenter',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/ReportCenter.js',
      },
      {
        path: '/latentLifting/formManger/taskKpi',
        name: 'taskKpi',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/TaskKpi',
      },
      {
        path: '/latentLifting/formManger/waitingKpi',
        name: 'waitingKpi',
        hooks: ['dev'],
        component: '/LatentLifting/WaitingKpi',
      },
      {
        path: '/latentLifting/formManger/stationKpi',
        name: 'stationKpi',
        hooks: ['dev'],
        component: '/LatentLifting/StationKpi',
      },
      {
        path: '/latentLifting/formManger/metadata',
        name: 'metadata',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/LatentLifting/MetaData',
      },
    ],
  },
  {
    path: '/system',
    name: 'system',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    icon: 'setting',
    routes: [
      {
        path: '/system/systemParams',
        name: 'systemParams',
        authority: ['ADMIN', 'SUPERMANAGER'],
        component: '/LatentLifting/SystemParams.js',
      },
      {
        path: '/system/chargingStrategy',
        name: 'chargingStrategy',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        component: '/LatentLifting/ChargingStrategy.js',
      },
    ],
  },
];
