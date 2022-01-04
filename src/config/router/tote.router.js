import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.Tote}/center`,
    name: 'task',
    icon: 'icon-task',
    routes: [
      {
        path: `/${AppCode.Tote}/task/executionQueue`,
        name: 'executionQueue',
        component: '/Tote/ExecutionQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/task/taskQueue`,
        name: 'waitingQueue',
        component: '/Tote/WaitingQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/task/taskLibrary`,
        name: 'taskLibrary',
        component: '/Tote/TaskLibrary.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/task/totePoolTask`,
        name: 'totePoolTask',
        component: '/Tote/TotePoolTask.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: `/${AppCode.Tote}/agv`,
    name: 'agv',
    icon: 'agv',
    routes: [
      {
        path: `/${AppCode.Tote}/agv/agvList`,
        name: 'agvList',
        component: '/Tote/AgvList.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/agv/agvRealTime`,
        name: 'agvRealTime',
        component: '/Tote/AgvRealTime.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/agv/batchFirmwareUpgrade`,
        name: 'batchFirmwareUpgrade',
        component: '/Tote/BatchUpgrading',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/agv/firmwareUpgrade`,
        name: 'firmwareUpgrade',
        hideInMenu: true,
        component: '/Tote/FirmwarUpdate.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/agv/logDownLoad`,
        name: 'logDownLoad',
        component: '/Tote/LogDownLoad.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: `/${AppCode.Tote}/pod`,
    name: 'pod',
    icon: 'icon-shelf',
    routes: [
      {
        path: `/${AppCode.Tote}/pod/podRowModelBaseData`,
        name: 'podRowModelBaseData',
        component: '/Tote/Pod/PodRowModelBaseData.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/pod/podRowModelManager`,
        name: 'podRowModelManager',
        component: '/Tote/Pod/PodRowModelManager.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/pod/newrakeLayout`,
        name: 'rackLayout',
        component: '/Tote/Pod/RakeLayout/Index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: `/${AppCode.Tote}/faultManger`,
    icon: 'warning',
    name: 'faultManagement',
    routes: [
      {
        path: `/${AppCode.Tote}/faultManger/faultInfo`,
        name: 'faultList',
        component: '/Tote/Fault/FaultInfo.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/faultManger/faultDefinition`,
        name: 'faultDefinition',
        component: '/Tote/Fault/FaultDefinition.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
  {
    path: `/${AppCode.Tote}/formManger`,
    icon: 'line-chart',
    name: 'formManger',
    routes: [
      {
        path: `/${AppCode.Tote}/formManger/reportCenter`,
        name: 'reportCenter',
        component: '/Tote/Form/Forms.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/formManger/metadata`,
        name: 'metadata',
        component: '/Tote/Form/Metadata.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },

  {
    path: `/${AppCode.Tote}/system`,
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: `/${AppCode.Tote}/system/systemParamsManager`,
        name: 'systemParams',
        component: '/Tote/System/SystemParams.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: `/${AppCode.Tote}/system/chargingStrategy`,
        name: 'chargingStrategy',
        component: '/Tote/System/ChargingStrategy.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
];
