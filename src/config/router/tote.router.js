export default [

      {
        path: '/tote/center',
        name: 'controlCenter',
        icon: 'icon-task',
        routes: [
          {
            path: '/tote/center/executionQueue',
            name: 'executionQueue',
            component: './ControlCenter/ExecutionQueue',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/center/taskQueue',
            name: 'taskQueue',
            component: './ControlCenter/TaskQueue',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/center/taskManger',
            name: 'taskManger',
            component: './ControlCenter/CenterOs',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/center/totePoolTask',
            name: 'totePoolTask',
            component: './ControlCenter/TotePoolTask',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
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
            component: './agvManger/agvList',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/agv/agvRealTime',
            name: 'agvRealTime',
            component: './ControlCenter/agvRealTime',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/agv/batchFirmwareUpgrade',
            name: 'batchFirmwareUpgrade',
            component: './agvManger/BatchFirmware',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/agv/firmwareUpgrade',
            name: 'firmwareUpgrade',
            hideInMenu: true,
            component: './agvManger/FirmwarUpdate',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/agv/logDownLoad',
            name: 'logDownLoad',
            component: './agvManger/logDownLoad',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
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
            component: './Pod/PodRowModelBaseData',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/pod/podRowModelManager',
            name: 'podRowModelManager',
            component: './Pod/PodRowModelManager',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/pod/newrakeLayout',
            name: 'rackLayout',
            component: './Pod/RakeLayout/Index',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
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
            component: './Fault/FaultInfo',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/faultManger/faultDefinition',
            name: 'faultDefinition',
            component: './Fault/FaultDefinition',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },

      {
        path: '/tote/questionCenter',
        icon: 'line-chart',
        name: 'QuestionCenter',
        component: './Question/QuestionCenter',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
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
            component: './Form/Forms',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/formManger/detailFroms',
            name: 'detailFroms',
            hideInMenu: true,
            component: './Form/DetailFroms',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/formManger/metadata',
            name: 'metadata',
            component: './Form/Metadata',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
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
            component: './System/SystemParamsManager',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/tote/system/chargingStrategy',
            name: 'chargingStrategy',
            component: './System/ChargingStrategy',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },
];
