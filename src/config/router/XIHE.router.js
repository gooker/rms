import { AppCode } from '@/config/config';

export default [
  {
    path: `/${AppCode.XIHE}/map`,
    name: 'map',
    icon: 'environment',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      {
        path: `/${AppCode.XIHE}/map/mapEdit`,
        name: 'mapEdit',
        component: '/XIHE/MapEditor',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.XIHE}/map/monitor`,
        name: 'monitor',
        component: '/XIHE/MapMonitor',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.XIHE}/lockManager`,
    name: 'lockManager',
    icon: 'lock',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    routes: [
      // 目标点锁
      {
        path: `/${AppCode.XIHE}/lockManager/targetLock`,
        name: 'targetLock',
        component: '/XIHE/LockManage/TargetLock',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      // 潜伏类
      {
        path: `/${AppCode.XIHE}/lockManager/${AppCode.LatentLifting}`,
        name: 'latent-lifting',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: `/${AppCode.XIHE}/lockManager/${AppCode.LatentLifting}/robotLock`,
            name: 'robotLock',
            component: '/XIHE/LockManage/LatentLifting/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: `/${AppCode.XIHE}/lockManager/${AppCode.LatentLifting}/storageLock`,
            name: 'storageLock',
            component: '/XIHE/LockManage/LatentLifting/StorageLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: `/${AppCode.XIHE}/lockManager/${AppCode.LatentLifting}/podLock`,
            name: 'podLock',
            component: '/XIHE/LockManage/LatentLifting/PodLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      // 料箱类
      // {
      //   path: `/${AppCode.XIHE}/lockManager/${AppCode.Tote}`,
      //   name: 'tote',
      //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //   routes: [
      //     {
      //       path: `/${AppCode.XIHE}/lockManager/${AppCode.Tote}/robotLock`,
      //       name: 'robotLock',
      //       component: '/XIHE/LockManage/Tote/RobotLock',
      //       authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //     },
      //     {
      //       path: `/${AppCode.XIHE}/lockManager/${AppCode.Tote}/totePodLock`,
      //       name: 'totePodLock',
      //       component: '/XIHE/LockManage/Tote/TotePodLock',
      //       authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //     },
      //     {
      //       path: `/${AppCode.XIHE}/lockManager/${AppCode.Tote}/toteBinLock`,
      //       name: 'toteBinLock',
      //       component: '/XIHE/LockManage/Tote/ToteBinLock',
      //       authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //     },
      //   ],
      // },
      // 分拣类
      {
        path: `/${AppCode.XIHE}/lockManager/${AppCode.Sorter}`,
        name: 'sorter',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: `/${AppCode.XIHE}/lockManager/${AppCode.Sorter}/robotLock`,
            name: 'robotLock',
            component: '/XIHE/LockManage/Sorter/RobotLock',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
    ],
  },
  {
    path: `/${AppCode.XIHE}/sourceManage`,
    name: 'sourceManage',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    icon: 'icon-sourceManage',
    routes: [
      {
        path: `/${AppCode.XIHE}/sourceManage/latentPod`,
        name: 'latentPod',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        routes: [
          {
            path: `/${AppCode.XIHE}/sourceManage/latentPod/management`,
            name: 'latentPodMange',
            component: '/XIHE/SourceManage/LatentLiftingPod/PodManager',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: `/${AppCode.XIHE}/sourceManage/latentPod/assignment`,
            name: 'latentPodAssign',
            component: '/XIHE/SourceManage/LatentLiftingPod/PodAssign',
            authority: ['ADMIN', 'SUPERMANAGER'],
          },
        ],
      },
      // {
      //   path: `/${AppCode.XIHE}/sourceManage/${AppCode.Tote}`,
      //   name: 'tote',
      //   authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //   routes: [
      //     {
      //       path: `/${AppCode.XIHE}/sourceManage/${AppCode.Tote}/toteManagement`,
      //       name: 'toteManagement',
      //       component: '/XIHE/SourceManage/Tote/ToteManagement',
      //       authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //     },
      //     {
      //       path: `/${AppCode.XIHE}/sourceManage/${AppCode.Tote}/toteTool`,
      //       name: 'toteTool',
      //       component: '/XIHE/SourceManage/Tote/ToteTool',
      //       authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      //     },
      //   ],
      // },
      {
        path: `/${AppCode.XIHE}/sourceManage/mapRouteAssign`,
        name: 'mapRouteAssign',
        component: '/XIHE/MapTool/MapRouteAssign/MapRouteAssign',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.XIHE}/sourceManage/mapAreaManage`,
        name: 'mapAreaManage',
        component: '/XIHE/MapTool/AreaManagement/AreaManagement',
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.XIHE}/sourceManage/agvGroup`,
        name: 'agvGroup',
        component: '/XIHE/SourceManage/AgvGroup',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: `/${AppCode.XIHE}/sourceGroupManage`,
    name: 'sourceGroupManage',
    icon: 'icon-sourceGroup',
    hooks: ['dev'],
    routes: [
      {
        path: `/${AppCode.XIHE}/sourceGroupManage/TaskTrigger`,
        name: 'taskTrigger',
        component: '/XIHE/SourceGroupManage/TaskTrigger',
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.XIHE}/sourceGroupManage/TaskLimiting`,
        name: 'TaskLimiting',
        component: '/XIHE/SourceGroupManage/TaskLimiting',
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.XIHE}/sourceGroupManage/GroupManage`,
        name: 'groupManage',
        component: '/XIHE/SourceGroupManage/GroupManage',
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.XIHE}/sourceGroupManage/GroupBinding`,
        name: 'groupBinding',
        component: '/XIHE/SourceGroupManage/GroupBinding',
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.XIHE}/sourceGroupManage/CustomTask`,
        name: 'customTask',
        component: '/XIHE/SourceGroupManage/CustomTask',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: `/${AppCode.XIHE}/charge`,
    name: 'chargeCenter',
    icon: 'icon-charger',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    hooks: ['dev'],
    routes: [
      {
        path: `/${AppCode.XIHE}/charge/chargeManagerment`,
        name: 'chargeManagerment',
        component: '/XIHE/ChargeManage/ChargeManagerment',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.XIHE}/charge/chargeFaultManagement`,
        name: 'chargeFaultManagement',
        component: '/XIHE/ChargeManage/ChargeFaultManagement',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
        hooks: ['dev'],
      },
    ],
  },
  {
    path: `/${AppCode.XIHE}/report`,
    name: 'reportCenter',
    icon: 'icon-reportForm',
    hooks: ['dev'],
    routes: [
      {
        path: `/${AppCode.XIHE}/report/healthReport`,
        name: 'healthReport',
        component: '/XIHE/ReportCenter/HealthReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.XIHE}/report/healthQrcode`,
        name: 'healthQrcode',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
        hooks: ['dev'],
        routes: [
          {
            path: `/${AppCode.XIHE}/report/healthQrcode/groundQrcode`,
            name: 'groundQrcode',
            component: '/XIHE/ReportCenter/HealthQrcode/GroundQrcode',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: `/${AppCode.XIHE}/report/healthQrcode/latentPodQrcode`,
            name: 'latentPodQrcode',
            component: '/XIHE/ReportCenter/HealthQrcode/LatentPodQrcode',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: `/${AppCode.XIHE}/report/healthQrcode/toteQrcode`,
            name: 'toteQrcode',
            component: '/XIHE/ReportCenter/HealthQrcode/ToteQrcode',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
      {
        path: `/${AppCode.XIHE}/report/healthRobot`,
        name: 'healthRobot',
        component: '/XIHE/ReportCenter/HealthRobot',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
        hooks: ['dev'],
      },
      {
        path: `/${AppCode.XIHE}/report/loadReport`,
        name: 'loadReport',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER', 'USER'],
        hooks: ['dev'],
        routes: [
          {
            path: `/${AppCode.XIHE}/report/loadReport/robotLoad`,
            name: 'robotLoad',
            component: '/XIHE/ReportCenter/Load/RobotLoad',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
          {
            path: `/${AppCode.XIHE}/report/loadReport/taskLoad`,
            name: 'taskLoad',
            component: '/XIHE/ReportCenter/Load/TaskLoad',
            authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
          },
        ],
      },
    ],
  },
  {
    path: `/${AppCode.XIHE}/operationLog`,
    name: 'operationLog',
    icon: 'icon-log',
    component: '/XIHE/OperationLog',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: `/${AppCode.XIHE}/requestor`,
    name: 'requestor',
    icon: 'api',
    component: '/XIHE/Requestor/Requestor',
    authority: ['ADMIN', 'SUPERMANAGER'],
  },
  {
    path: `/${AppCode.XIHE}/richEditor`,
    name: 'richEditor',
    icon: 'richEditor',
    component: '/XIHE/RichEditor',
    hooks: ['dev'],
  },
  {
    path: `/${AppCode.XIHE}/notificationCenter`,
    name: 'notificationCenter',
    icon: 'notification',
    authority: ['ADMIN', 'SUPERMANAGER'],
    routes: [
      {
        path: `/${AppCode.XIHE}/notificationCenter/broadcast`,
        name: 'broadcast',
        component: '/XIHE/NotificationCenter/BroadcastChannel',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.XIHE}/notificationCenter/subscription`,
        name: 'subscription',
        component: '/XIHE/NotificationCenter/ChannelSubscription',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
    ],
  },
  {
    path: `/${AppCode.XIHE}/system`,
    name: 'system',
    icon: 'setting',
    authority: ['ADMIN', 'SUPERMANAGER'],
    routes: [
      {
        path: `/${AppCode.XIHE}/system/systemParamsManager`,
        name: 'systemParams',
        component: '/XIHE/SystemParams',
        authority: ['ADMIN', 'SUPERMANAGER'],
      },
      {
        path: `/${AppCode.XIHE}/system/timezone`,
        name: 'Timezone',
        component: '/XIHE/SystemTimeZone',
        authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
      },
      {
        path: `/${AppCode.XIHE}/system/webHook`,
        name: 'webHook',
        component: '/XIHE/WebHook',
        hooks: ['dev'],
      },
    ],
  },
  {
    path: `/${AppCode.XIHE}/questionCenter`,
    icon: 'line-chart',
    name: 'questionCenter',
    component: '/XIHE/Question/QuestionCenter',
    authority: ['ADMIN', 'SUPERMANAGER', 'MANAGER'],
    // hideInMenu: true,
  },
];
