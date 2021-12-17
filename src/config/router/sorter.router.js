export default [
  {
    path: '/sorter/center',
    name: 'controlCenter',
    icon: 'icon-task',
    routes: [
      {
        path: '/sorter/task/executionQueue',
        name: 'executionQueue',
        component: '/Sorter/ExecutionQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/sorter/task/taskQueue',
        name: 'taskQueue',
        component: '/Sorter/TaskQueue.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/sorter/task/taskLibrary',
        name: 'taskManger',
        component: '/Sorter/TaskLibrary.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
  {
    path: '/sorter/agv',
    name: 'agv',
    icon: 'agv',
    routes: [
      {
        path: '/sorter/agv/agvList',
        name: 'agvList',
        component: '/Sorter/AgvList.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/sorter/agv/agvRealTime',
        name: 'agvRealTime',
        component: '/Sorter/AgvRealTime.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      // {
      //   path: '/sorter/agv/firmwareUpgrade',
      //   name: 'firmwareUpgrade',
      //   component: /Sorter/FirmwareUpgrade.js,
      // },
      // {
      //   path: '/sorter/agv/logDownLoad',
      //   name: 'logDownLoad',
      //   component: /Sorter/LogDownLoad.js,
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
  //       component: /Sorter/FaultList.js,
  //     },
  //     {
  //       path: '/sorter/faultManger/faultDefinition',
  //       name: 'faultDefinition',
  //       component: /Sorter/FaultDefinition.js,
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
  //       component: /Sorter/ReportCenter.js,
  //     },
  //     {
  //       path: '/sorter/formManger/taskKpi',
  //       name: 'taskKpi',
  //       component: /Sorter/TaskKpi.js,
  //     },
  //     {
  //       path: '/sorter/formManger/waitingKpi',
  //       name: 'waitingKpi',
  //       component: /Sorter/index.js,
  //     },
  //     {
  //       path: '/sorter/formManger/metadata',
  //       name: 'metadata',
  //       component:/Sorter/Metadata.js,
  //     },
  //   ],
  // },
  {
    path: '/sorter/system',
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/sorter/system/systemParamsManager',
        name: 'systemParamsManager',
        component: '/Sorter/SystemParams.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
      {
        path: '/sorter/system/chargingStrategy',
        name: 'chargingStrategy',
        component: '/Sorter/ChargingStrategy.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
      },
    ],
  },
];
