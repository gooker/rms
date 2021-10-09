export default [
  {
    path: '/tote/center',
    name: 'controlCenter',
    icon: 'icon-task',
    routes: [
      {
        path: '/tote/center/executionQueue',
        name: 'executionQueue',
        component: '/Tote/ExecutionQueue',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/center/taskQueue',
        name: 'taskQueue',
        component: '/Tote/WaitingQueue',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/center/taskManger',
        name: 'taskManger',
        component: '/Tote/TaskLibrary',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/center/totePoolTask',
        name: 'totePoolTask',
        component: '/Tote/TotePoolTask',
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
        component: '/Tote/AgvList',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/agv/agvRealTime',
        name: 'agvRealTime',
        component: '/Tote/AgvRealTime',
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
        component: '/Tote/FirmwarUpdate',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/agv/logDownLoad',
        name: 'logDownLoad',
        component: '/Tote/LogDownLoad',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: '/tote/pod',
    name: 'pod',
    icon: 'icon-cangkucangchu',
    routes: [
      {
        path: '/tote/pod/podRowModelBaseData',
        name: 'podRowModelBaseData',
        component: '/Tote/Pod/PodRowModelBaseData',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/pod/podRowModelManager',
        name: 'podRowModelManager',
        component: '/Tote/Pod/PodRowModelManager',
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
    name: 'faultManger',
    routes: [
      {
        path: '/tote/faultManger/faultInfo',
        name: 'faultInfo',
        component: '/Tote/Fault/FaultInfo',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/faultManger/faultDefinition',
        name: 'faultDefinition',
        component: '/Tote/Fault/FaultDefinition',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: '/tote/questionCenter',
    icon: 'line-chart',
    name: 'QuestionCenter',
    component: '/Tote/Question/QuestionCenter',
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
        component: '/Tote/Form/Forms',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/formManger/detailFroms',
        name: 'detailFroms',
        hideInMenu: true,
        component: '/Tote/Form/DetailFroms',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/formManger/metadata',
        name: 'metadata',
        component: '/Tote/Form/Metadata',
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
        name: 'systemParamsManager',
        component: '/Tote/System/SystemParamsManager',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/tote/system/chargingStrategy',
        name: 'chargingStrategy',
        component: '/Tote/System/ChargingStrategy',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
];
