export default [
  {
    name: 'map',
    icon: 'environment',
    routes: [
      {
        path: '/mixrobot/map/mapEdit',
        name: 'mapEdit',
        component: '/Mixrobot/MapTool/MapEdit/Index',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/map/monitor',
        name: 'monitor',
        component: '/Mixrobot/MapTool/MapMonitor/MapMonitor',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/map/mapFactory',
        name: 'mapFactory',
        component: '/Mixrobot/MapTool/MapFactory/MapFactory',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/map/mapRecorder',
        name: 'mapRecorder',
        component: '/Mixrobot/MapTool/MapRecorder/MapRecorder',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/map/mapRouteAssign',
        name: 'mapRouteAssign',
        component: '/Mixrobot/MapTool/MapRouteAssign/MapRouteAssign',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/map/mapAreaManage',
        name: 'mapAreaManage',
        component: '/Mixrobot/MapTool/AreaManagement/AreaManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    name: 'lockManager',
    icon: 'lock',
    routes: [
      // 目标点锁
      {
        path: '/mixrobot/lockManager/targetLock',
        name: 'targetLock',
        component: '/Mixrobot/LockManage/TargetLock',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      // 潜伏类
      {
        path: '/mixrobot/lockManager/latent-lifting',
        name: 'latent-lifting',
        moduleKey: 'latent-lifting',
        routes: [
          {
            path: '/mixrobot/lockManager/latent-lifting/RobotLock',
            name: 'robotLock',
            component: '/Mixrobot/LockManage/LatentLifting/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/storageLock',
            name: 'storageLock',
            component: '/Mixrobot/LockManage/LatentLifting/StorageLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/PodLock',
            name: 'podLock',
            component: '/Mixrobot/LockManage/LatentLifting/PodLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/heavyRobotAvoidLock',
            name: 'heavyRobotAvoidLock',
            component: '/Mixrobot/LockManage/LatentLifting/HeavyRobotAvoidLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },
      // 料箱类
      {
        path: '/mixrobot/lockManager/tote',
        name: 'tote',
        moduleKey: 'tote-wcs-gui',
        routes: [
          {
            path: '/mixrobot/lockManager/tote/RobotLock',
            name: 'robotLock',
            component: '/Mixrobot/LockManage/Tote/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/tote/TotePodLock',
            name: 'totePodLock',
            component: '/Mixrobot/LockManage/Tote/TotePodLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/tote/ToteBinLock',
            name: 'toteBinLock',
            component: '/Mixrobot/LockManage/Tote/ToteBinLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },
      // 叉车类
      {
        path: '/mixrobot/lockManager/forklift',
        name: 'forklift',
        moduleKey: 'forklift',
        routes: [
          {
            path: '/mixrobot/lockManager/forklift/RobotLock',
            name: 'robotLock',
            component: '/Mixrobot/LockManage/Forklift/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },
    ],
  },
  {
    name: 'sourceManage',
    icon: 'iconziyuan',
    routes: [
      {
        path: '/mixrobot/sourceManage/latentPod',
        name: 'latentPod',
        moduleKey: 'latent-lifting',
        routes: [
          {
            path: '/mixrobot/sourceManage/latentPod/management',
            name: 'latentPodMange',
            component: '/Mixrobot/SourceManage/LatentLiftingPod/PodManager',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/sourceManage/latentPod/assignment',
            name: 'latentPodAssign',
            component: '/Mixrobot/SourceManage/LatentLiftingPod/PodAssign',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },
      {
        path: '/mixrobot/sourceManage/tote',
        name: 'tote',
        moduleKey: 'tote-wcs-gui',
        routes: [
          {
            path: '/mixrobot/sourceManage/tote/toteManagement',
            name: 'toteManagement',
            component: '/Mixrobot/SourceManage/Tote/ToteManagement',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/sourceManage/tote/toteTool',
            name: 'toteTool',
            component: '/Mixrobot/SourceManage/Tote/ToteTool',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },
    ],
  },
  {
    name: 'chargeCenter',
    icon: 'iconjiayouzhan',
    routes: [
      {
        path: '/mixrobot/charge/chargeManger',
        name: 'chargeManger',
        component: '/Mixrobot/ChargeCenter/ChargeManger',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    name: 'reportCenter',
    icon: 'iconreportform',
    routes: [
      {
        path: '/mixrobot/report/healthReport',
        name: 'healthReport',
        component: '/Mixrobot/ReportCenter/HealthReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    path: '/mixrobot/operationLog',
    name: 'operationLog',
    icon: 'iconLOG',
    component: '/Mixrobot/OperationLog/OperationLogView',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
  },
  {
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/mixrobot/system/systemParamsManager',
        name: 'systemParamsManager',
        component: '/Mixrobot/System/SystemParamsManager',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/system/timezone',
        name: 'Timezone',
        component: '/Mixrobot/System/Timezone',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    path: '/mixrobot/questionCenter',
    icon: 'line-chart',
    name: 'questionCenter',
    component: '/Mixrobot/Question/QuestionCenter',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
    hideInMenu: true,
  },
];
