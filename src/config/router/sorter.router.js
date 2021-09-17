export default [
  {
    name: 'controlCenter',
    icon: 'icon-task',
    routes: [
      {
        path: '/sorter/center/executionQueue',
        name: 'executionQueue',
        component: '/Sorter/ExecutionQueue',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/sorter/center/taskQueue',
        name: 'taskQueue',
        component: '/Sorter/TaskQueue',
        // authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/sorter/center/taskManger',
        name: 'taskManger',
        component: '/Sorter/TaskLibrary',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
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
        component: '/Sorter/AgvList',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/sorter/agv/agvRealTime',
        name: 'agvRealTime',
        component: '/Sorter/AgvRealTime',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      // {
      //   path: '/sorter/agv/firmwareUpgrade',
      //   name: 'firmwareUpgrade',
      //   component: /Sorter/FirmwareUpgrade,
      // },
      // {
      //   path: '/sorter/agv/logDownLoad',
      //   name: 'logDownLoad',
      //   component: /Sorter/LogDownLoad,
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
  //       component: /Sorter/FaultList,
  //     },
  //     {
  //       path: '/sorter/faultManger/faultDefinition',
  //       name: 'faultDefinition',
  //       component: /Sorter/FaultDefinition,
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
  //       component: /Sorter/ReportCenter,
  //     },
  //     {
  //       path: '/sorter/formManger/taskKpi',
  //       name: 'taskKpi',
  //       component: /Sorter/TaskKpi,
  //     },
  //     {
  //       path: '/sorter/formManger/waitingKpi',
  //       name: 'waitingKpi',
  //       component: /Sorter/WaitingKpi,
  //     },
  //     {
  //       path: '/sorter/formManger/metadata',
  //       name: 'metadata',
  //       component:/Sorter/Metadata,
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
        component: '/Sorter/SystemParamsManager',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/sorter/system/chargingStrategy',
        name: 'chargingStrategy',
        component: '/Sorter/ChargingStrategy',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
];
