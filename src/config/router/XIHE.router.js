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
        component: '/XIHE/MapEditor',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: '/mixrobot/map/monitor',
        name: 'monitor',
        component: '/XIHE/MapMonitor',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/mixrobot/map/mapFactory',
        name: 'mapFactory',
        component: '/XIHE/MapPrograming',
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
        component: '/XIHE/LockManage/TargetLock',
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
            component: '/XIHE/LockManage/LatentLifting/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/storageLock',
            name: 'storageLock',
            component: '/XIHE/LockManage/LatentLifting/StorageLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/PodLock',
            name: 'podLock',
            component: '/XIHE/LockManage/LatentLifting/PodLock',
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
            component: '/XIHE/LockManage/Tote/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/lockManager/tote/TotePodLock',
            name: 'totePodLock',
            component: '/XIHE/LockManage/Tote/TotePodLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/lockManager/tote/ToteBinLock',
            name: 'toteBinLock',
            component: '/XIHE/LockManage/Tote/ToteBinLock',
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
            component: '/XIHE/LockManage/Forklift/RobotLock',
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
            component: '/XIHE/LockManage/Sorter/RobotLock',
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
    icon: 'icon-sourceManage',
    routes: [
      {
        path: '/mixrobot/sourceManage/latentPod',
        name: 'latentPod',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: '/mixrobot/sourceManage/latentPod/management',
            name: 'latentPodMange',
            component: '/XIHE/SourceManage/LatentLiftingPod/PodManager',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/sourceManage/latentPod/assignment',
            name: 'latentPodAssign',
            component: '/XIHE/SourceManage/LatentLiftingPod/PodAssign',
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
            component: '/XIHE/SourceManage/Tote/ToteManagement',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: '/mixrobot/sourceManage/tote/toteTool',
            name: 'toteTool',
            component: '/XIHE/SourceManage/Tote/ToteTool',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      {
        path: '/mixrobot/sourceManage/mapRouteAssign',
        name: 'mapRouteAssign',
        component: '/XIHE/MapTool/MapRouteAssign/MapRouteAssign',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: '/mixrobot/sourceManage/mapAreaManage',
        name: 'mapAreaManage',
        component: '/XIHE/MapTool/AreaManagement/AreaManagement',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceManage/agvGroup',
        name: 'agvGroup',
        component: '/XIHE/SourceManage/AgvGroup/AgvGroup',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/sourceGroupManage',
    name: 'sourceGroupManage',
    icon: 'icon-sourceGroup',
    hooks: ['dev'],
    routes: [
      {
        path: '/mixrobot/sourceGroupManage/TaskTrigger',
        name: 'taskTrigger',
        component: '/XIHE/SourceGroupManage/TaskTrigger',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceGroupManage/TaskLimiting',
        name: 'TaskLimiting',
        component: '/XIHE/SourceGroupManage/TaskLimiting',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceGroupManage/GroupManage',
        name: 'groupManage',
        component: '/XIHE/SourceGroupManage/GroupManage',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceGroupManage/GroupBinding',
        name: 'groupBinding',
        component: '/XIHE/SourceGroupManage/GroupBinding',
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/sourceGroupManage/CustomTask',
        name: 'customTask',
        component: '/XIHE/SourceGroupManage/CustomTask',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/charge',
    name: 'chargeCenter',
    icon: 'icon-charger',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    hooks: ['dev'],
    routes: [
      {
        path: '/mixrobot/charge/chargeManagerment',
        name: 'chargeManagerment',
        component: '/XIHE/ChargeManage/ChargeManagerment',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        hooks: ['dev'],
      },
      {
        path: '/mixrobot/charge/chargeFaultManagement',
        name: 'chargeFaultManagement',
        component: '/XIHE/ChargeManage/ChargeFaultManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/report',
    name: 'reportCenter',
    icon: 'icon-reportForm',
    hooks: ['dev'],
    routes: [
      {
        path: '/mixrobot/report/healthReport',
        name: 'healthReport',
        component: '/XIHE/ReportCenter/HealthReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/operationLog',
    name: 'operationLog',
    icon: 'icon-log',
    component: '/XIHE/OperationLog',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: '/mixrobot/requestor',
    name: 'requestor',
    icon: 'api',
    component: '/XIHE/Requestor/Requestor',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: '/mixrobot/richEditor',
    name: 'richEditor',
    icon: 'richEditor',
    component: '/XIHE/RichEditor',
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
        name: 'systemParams',
        component: '/XIHE/SystemParams',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: '/mixrobot/system/timezone',
        name: 'Timezone',
        component: '/XIHE/SystemTimeZone',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: '/mixrobot/system/webHook',
        name: 'webHook',
        component: '/XIHE/WebHook',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: '/mixrobot/questionCenter',
    icon: 'line-chart',
    name: 'questionCenter',
    component: '/XIHE/Question/QuestionCenter',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    hideInMenu: true,
  },
];
