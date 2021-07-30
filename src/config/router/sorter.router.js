export default [
  {
    name: 'controlCenter',
    icon: 'icon-task',
    routes: [
      {
        path: '/center/executionQueue',
        name: 'executionQueue',
        component: '/Sorter/ExecutionQueue',
      },
      {
        path: '/center/taskQueue',
        name: 'taskQueue',
        component: '/Sorter/TaskQueue',
      },
      {
        path: '/center/taskManger',
        name: 'taskManger',
        component: '/Sorter/TaskLibrary',
      },
    ],
  },
  {
    name: 'agv',
    icon: 'car',
    routes: [
      {
        path: '/agv/agvList',
        name: 'agvList',
        component: '/Sorter/AgvList',
      },
      {
        path: '/agv/agvRealTime',
        name: 'agvRealTime',
        component: '/Sorter/AgvRealTime',
      },
      // {
      //   path: '/agv/firmwareUpgrade',
      //   name: 'firmwareUpgrade',
      //   component: /Sorter/FirmwareUpgrade,
      // },
      // {
      //   path: '/agv/logDownLoad',
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
  //       path: '/faultManger/faultList',
  //       name: 'faultList',
  //       component: /Sorter/FaultList,
  //     },
  //     {
  //       path: '/faultManger/faultDefinition',
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
  //       path: '/formManger/reportCenter',
  //       name: 'reportCenter',
  //       component: /Sorter/ReportCenter,
  //     },
  //     {
  //       path: '/formManger/taskKpi',
  //       name: 'taskKpi',
  //       component: /Sorter/TaskKpi,
  //     },
  //     {
  //       path: '/formManger/waitingKpi',
  //       name: 'waitingKpi',
  //       component: /Sorter/WaitingKpi,
  //     },
  //     {
  //       path: '/formManger/metadata',
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
        path: '/system/systemParamsManager',
        name: 'systemParamsManager',
        component: '/Sorter/SystemParamsManager',
      },
      {
        path: '/system/chargingStrategy',
        name: 'chargingStrategy',
        component: '/Sorter/ChargingStrategy',
      },
    ],
  },
];
