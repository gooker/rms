export default [
  {
    path: '/mixrobot/map',
    name: 'map',
    icon: 'environment',
    routes: [
      {
        path: '/mixrobot/map/mapEdit',
        name: 'mapEdit',
        component: './MapTool/MapEdit/mapEditor',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/map/monitor',
        name: 'monitor',
        component: './MapTool/MapMonitor/MapMonitor',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/map/mapFactory',
        name: 'mapFactory',
        component: './MapTool/MapFactory/MapFactory',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/map/mapRecorder',
        name: 'mapRecorder',
        component: './MapTool/MapRecorder/MapRecorder',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    path: '/mixrobot/lockManager',
    name: 'lockManager',
    icon: 'lock',
    routes: [
      // 目标点锁
      {
        path: '/mixrobot/lockManager/targetLock',
        name: 'targetLock',
        component: './LockManage/TargetLock',
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
            component: './LockManage/LatentLifting/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/storageLock',
            name: 'storageLock',
            component: './LockManage/LatentLifting/StorageLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/PodLock',
            name: 'podLock',
            component: './LockManage/LatentLifting/PodLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/latent-lifting/heavyRobotAvoidLock',
            name: 'heavyRobotAvoidLock',
            component: './LockManage/LatentLifting/HeavyRobotAvoidLock',
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
            component: './LockManage/Tote/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/tote/TotePodLock',
            name: 'totePodLock',
            component: './LockManage/Tote/TotePodLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
          {
            path: '/mixrobot/lockManager/tote/ToteBinLock',
            name: 'toteBinLock',
            component: './LockManage/Tote/ToteBinLock',
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
            component: './LockManage/Forklift/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },
    ],
  },
  {
    path: '/mixrobot/sourceManage',
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
            component: './SourceManage/LatentLiftingPod/PodManager',
          },
          {
            path: '/mixrobot/sourceManage/latentPod/assignment',
            name: 'latentPodAssign',
            component: './SourceManage/LatentLiftingPod/PodAssign',
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
            component: './SourceManage/Tote/ToteManagement',
          },
          {
            path: '/mixrobot/sourceManage/tote/toteTool',
            name: 'toteTool',
            component: './SourceManage/Tote/ToteTool',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
          },
        ],
      },
      {
        path: '/mixrobot/sourceManage/mapRouteAssign',
        name: 'mapRouteAssign',
        component: './MapTool/MapRouteAssign/MapRouteAssign',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/sourceManage/mapAreaManage',
        name: 'mapAreaManage',
        component: './MapTool/AreaManagement/AreaManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/sourceManage/agvGroup',
        name: 'agvGroup',
        component: './SourceManage/AgvGroup/AgvGroup',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    path: '/mixrobot/sourceGroupManage',
    name: 'sourceGroupManage',
    icon: 'icon-cangkucangchu',
    routes: [
      {
        path: '/mixrobot/sourceGroupManage/TaskTrigger',
        name: 'taskTrigger',
        component: './SourceGroupManage/TaskTrigger/TaskTrigger',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/sourceGroupManage/GroupManage',
        name: 'groupManage',
        component: './SourceGroupManage/GroupManage/GroupManage',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/sourceGroupManage/GroupBinding',
        name: 'groupBinding',
        component: './SourceGroupManage/GroupBinding/GroupBinding',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/sourceGroupManage/CustomTask',
        name: 'customTask',
        component: './SourceGroupManage/CustomTask/CustomTask',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    path: '/mixrobot/charge',
    name: 'chargeCenter',
    icon: 'iconjiayouzhan',
    routes: [
      {
        path: '/mixrobot/charge/chargeManger',
        name: 'chargeManger',
        component: './ChargeCenter/ChargeManger',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/charge/chargeMangerBind',
        name: 'chargeMangerBind',
        component: './ChargeCenter/ChargerBinding',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    path: '/mixrobot/report',
    name: 'reportCenter',
    icon: 'iconreportform',
    routes: [
      {
        path: '/mixrobot/report/healthReport',
        name: 'healthReport',
        component: './ReportCenter/HealthReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    path: '/mixrobot/operationLog',
    name: 'operationLog',
    icon: 'iconLOG',
    component: './OperationLog/OperationLogView',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
  },
  {
    path: '/mixrobot/requestor',
    name: 'requestor',
    icon: 'api',
    component: './Requestor/Requestor',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
  },
  {
    path: '/mixrobot/system',
    name: 'system',
    icon: 'setting',
    routes: [
      {
        path: '/mixrobot/system/systemParamsManager',
        name: 'systemParamsManager',
        component: './System/SystemParamsManager',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
      {
        path: '/mixrobot/system/timezone',
        name: 'Timezone',
        component: './System/Timezone',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
      },
    ],
  },
  {
    path: '/mixrobot/questionCenter',
    icon: 'line-chart',
    name: 'questionCenter',
    component: './Question/QuestionCenter',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER','USER'],
    hideInMenu: true,
  },
];
