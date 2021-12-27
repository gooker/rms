export default [
  {
    path: '/mixrobot/map',
    name: 'map',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: '/mixrobot/map/mapEdit',
        name: 'mapEdit',
        component: '/Mixrobot/MapEditor',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: '/mixrobot/map/monitor',
        name: 'monitor',
        component: '/Mixrobot/MapMonitor',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/mixrobot/map/mapFactory',
        name: 'mapFactory',
        component: '/Mixrobot/MapPrograming',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
    ],
  },
  {
    path: '/mixrobot/lockManager',
    name: 'lockManager',
    icon: 'lock',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      // 目标点锁
      {
        path: '/mixrobot/lockManager/targetLock',
        name: 'targetLock',
        component: '/Mixrobot/LockManage/TargetLock',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      // 潜伏类
      {
        path: '/mixrobot/lockManager/latent-lifting',
        name: 'latent-lifting',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: '/mixrobot/lockManager/latent-lifting/RobotLock',
            name: 'robotLock',
            component: '/Mixrobot/LockManage/LatentLifting/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/storageLock',
            name: 'storageLock',
            component: '/Mixrobot/LockManage/LatentLifting/StorageLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/PodLock',
            name: 'podLock',
            component: '/Mixrobot/LockManage/LatentLifting/PodLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      // 料箱类
      {
        path: '/mixrobot/lockManager/tote',
        name: 'tote',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: '/mixrobot/lockManager/tote/RobotLock',
            name: 'robotLock',
            component: '/Mixrobot/LockManage/Tote/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/lockManager/tote/TotePodLock',
            name: 'totePodLock',
            component: '/Mixrobot/LockManage/Tote/TotePodLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/lockManager/tote/ToteBinLock',
            name: 'toteBinLock',
            component: '/Mixrobot/LockManage/Tote/ToteBinLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      // 叉车类
      {
        path: '/mixrobot/lockManager/forklift',
        name: 'forklift',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: '/mixrobot/lockManager/forklift/RobotLock',
            name: 'robotLock',
            component: '/Mixrobot/LockManage/Forklift/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      // 分拣类
      {
        path: '/mixrobot/lockManager/sorter',
        name: 'sorter',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: '/mixrobot/lockManager/sorter/RobotLock',
            name: 'robotLock',
            component: '/Mixrobot/LockManage/Sorter/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
    ],
  },
  {
    path: '/mixrobot/sourceManage',
    name: 'sourceManage',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    icon: 'iconziyuan',
    routes: [
      {
        path: '/mixrobot/sourceManage/latentPod',
        name: 'latentPod',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: '/mixrobot/sourceManage/latentPod/management',
            name: 'latentPodMange',
            component: '/Mixrobot/SourceManage/LatentLiftingPod/PodManager',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/sourceManage/latentPod/assignment',
            name: 'latentPodAssign',
            component: '/Mixrobot/SourceManage/LatentLiftingPod/PodAssign',
            authority: ['ADMIN', 'SUPERMANAGER'],
          },
        ],
      },
      {
        path: '/mixrobot/sourceManage/tote',
        name: 'tote',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: '/mixrobot/sourceManage/tote/toteManagement',
            name: 'toteManagement',
            component: '/Mixrobot/SourceManage/Tote/ToteManagement',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/sourceManage/tote/toteTool',
            name: 'toteTool',
            component: '/Mixrobot/SourceManage/Tote/ToteTool',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      {
        path: '/mixrobot/sourceManage/mapRouteAssign',
        name: 'mapRouteAssign',
        component: '/Mixrobot/MapTool/MapRouteAssign/MapRouteAssign',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: '/mixrobot/sourceManage/mapAreaManage',
        name: 'mapAreaManage',
        component: '/Mixrobot/MapTool/AreaManagement/AreaManagement',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceManage/agvGroup',
        name: 'agvGroup',
        component: '/Mixrobot/SourceManage/AgvGroup/AgvGroup',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/sourceGroupManage',
    name: 'sourceGroupManage',
    icon: 'icon-cangkucangchu',
    hooks: ['dev'],
    routes: [
      {
        path: '/mixrobot/sourceGroupManage/TaskTrigger',
        name: 'taskTrigger',
        component: '/Mixrobot/SourceGroupManage/TaskTrigger/TaskTrigger',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceGroupManage/TaskLimiting',
        name: 'TaskLimiting',
        component: '/Mixrobot/SourceGroupManage/TaskLimiting/TaskLimiting',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceGroupManage/GroupManage',
        name: 'groupManage',
        component: '/Mixrobot/SourceGroupManage/GroupManage/GroupManage',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceGroupManage/GroupBinding',
        name: 'groupBinding',
        component: '/Mixrobot/SourceGroupManage/GroupBinding/GroupBinding',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceGroupManage/CustomTask',
        name: 'customTask',
        component: '/Mixrobot/SourceGroupManage/CustomTask/CustomTask',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/charge',
    name: 'chargeCenter',
    icon: 'iconcharger',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    hooks: ['dev'],
    routes: [
      {
        path: '/mixrobot/charge/chargeManagerment',
        name: 'chargeManagerment',
        component: '/Mixrobot/ChargeManage/ChargeManagerment.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/charge/chargeFaultManagement',
        name: 'chargeFaultManagement',
        component: '/Mixrobot/ChargeManage/ChargeFaultManagement.js',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/report',
    name: 'reportCenter',
    icon: 'iconreportform',
    hooks: ['dev'],
    routes: [
      {
        path: '/mixrobot/report/healthReport',
        name: 'healthReport',
        component: '/Mixrobot/ReportCenter/HealthReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/operationLog',
    name: 'operationLog',
    icon: 'iconLOG',
    component: '/Mixrobot/OperationLog/OperationLog',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: '/mixrobot/requestor',
    name: 'requestor',
    icon: 'api',
    component: '/Mixrobot/Requestor/Requestor',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: '/mixrobot/richEditor',
    name: 'richEditor',
    icon: 'richEditor',
    component: '/Mixrobot/RichEditor/RichEditor',
    hooks: ['dev'],
  },
  {
    path: '/mixrobot/system',
    name: 'system',
    icon: 'setting',
    authority: ['ADMIN', 'SUPERMANAGER'],
    routes: [
      {
        path: '/mixrobot/system/systemParamsManager',
        name: 'systemParamsManager',
        component: '/Mixrobot/System/SystemParams',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: '/mixrobot/system/timezone',
        name: 'Timezone',
        component: '/Mixrobot/System/Timezone',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/system/webHook',
        name: 'webHook',
        component: '/Mixrobot/WebHook/WebHook',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/questionCenter',
    icon: 'line-chart',
    name: 'questionCenter',
    component: '/Mixrobot/Question/QuestionCenter',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    hideInMenu: true,
  },
];
