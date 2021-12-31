export default [
  {
    path: '/tote/center',
    name: 'task',
    icon: 'icon-task',
    routes: [
      {
        path: '/tote/task/executionQueue',
        name: 'executionQueue',
        component: '/Tote/ExecutionQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/task/taskQueue',
        name: 'waitingQueue',
        component: '/Tote/WaitingQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/task/taskLibrary',
        name: 'taskLibrary',
        component: '/Tote/TaskLibrary.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/task/totePoolTask',
        name: 'totePoolTask',
        component: '/Tote/TotePoolTask.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: '/tote/agv',
    name: 'agv',
    icon: 'agv',
    routes: [
      {
        path: '/tote/agv/agvList',
        name: 'agvList',
        component: '/Tote/AgvList.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/agv/agvRealTime',
        name: 'agvRealTime',
        component: '/Tote/AgvRealTime.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/agv/batchFirmwareUpgrade',
        name: 'batchFirmwareUpgrade',
        component: '/Tote/BatchUpgrading',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/agv/firmwareUpgrade',
        name: 'firmwareUpgrade',
        hideInMenu: true,
        component: '/Tote/FirmwarUpdate.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/agv/logDownLoad',
        name: 'logDownLoad',
        component: '/Tote/LogDownLoad.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: '/tote/pod',
    name: 'pod',
    icon: 'icon-shelf',
    routes: [
      {
        path: '/tote/pod/podRowModelBaseData',
        name: 'podRowModelBaseData',
        component: '/Tote/Pod/PodRowModelBaseData.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/pod/podRowModelManager',
        name: 'podRowModelManager',
        component: '/Tote/Pod/PodRowModelManager.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/pod/newrakeLayout',
        name: 'rackLayout',
        component: '/Tote/Pod/RakeLayout/Index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: '/tote/faultManger',
    icon: 'warning',
    name: 'faultManagement',
    routes: [
      {
        path: '/tote/faultManger/faultInfo',
        name: 'faultList',
        component: '/Tote/Fault/FaultInfo.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/faultManger/faultDefinition',
        name: 'faultDefinition',
        component: '/Tote/Fault/FaultDefinition.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: '/tote/questionCenter',
    icon: 'line-chart',
    name: 'QuestionCenter',
    component: '/Tote/Question/QuestionCenter.js',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
    hideInMenu: true,
  },
  {
    path: '/tote/formManger',
    icon: 'line-chart',
    name: 'formManger',
    routes: [
      {
        path: '/tote/formManger/reportCenter',
        name: 'reportCenter',
        component: '/Tote/Form/Forms.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/formManger/detailFroms',
        name: 'detailFroms',
        hideInMenu: true,
        component: '/Tote/Form/DetailFroms.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/formManger/metadata',
        name: 'metadata',
        component: '/Tote/Form/Metadata.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: '/tote/system',
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/tote/system/systemParamsManager',
        name: 'systemParams',
        component: '/Tote/System/SystemParams.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/system/chargingStrategy',
        name: 'chargingStrategy',
        component: '/Tote/System/ChargingStrategy.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
];
