const PermissionInfo = [
  {
    page: '/mixrobot/map/monitor', // 页面 router
    children: [
      {
        key: '/mixrobot/map/monitor/operation',
        label: '操作',
        children: [
          {
            key: '/mixrobot/map/monitor/operation/latent',
            label: '潜伏车',
            children: [
              {
                key: '/mixrobot/map/monitor/action/latent/emptyRun',
                label: '空跑',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/setupPod',
                label: '设置货架',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/toRestArea',
                label: '回休息区',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/charger',
                label: '小车充电',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/command',
                label: '小车命令',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/handlingRack',
                label: '搬运货架',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/advancedHandlingRack',
                label: '高级搬运货架',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/callRackToWorkstation',
                label: '呼叫货架到工作站',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/autoLatentWorkstationTask',
                label: '工作站自动任务',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/addPod',
                label: '添加',
              },
              {
                key: '/mixrobot/map/monitor/action/latent/batchAddPod',
                label: '批量添加',
              },
            ],
          },
          {
            key: '/mixrobot/map/monitor/operation/tote',
            label: '料箱车',
            children: [
              {
                key: '/mixrobot/map/monitor/action/tote/emptyRun',
                label: '空跑',
              },
              {
                key: '/mixrobot/map/monitor/action/tote/toRestArea',
                label: '回休息区',
              },
              {
                key: '/mixrobot/map/monitor/action/tote/charger',
                label: '小车充电',
              },
              {
                key: '/mixrobot/map/monitor/action/tote/command',
                label: '小车命令',
              },
              {
                key: '/mixrobot/map/monitor/action/tote/toteWorkstationTask',
                label: '料箱工作站任务',
              },
              {
                key: '/mixrobot/map/monitor/action/tote/autoToteWorkstationTask',
                label: '料箱工作站自动任务',
              },
            ],
          },
          {
            key: '/mixrobot/map/monitor/operation/fork',
            label: '叉车',
            children: [
              {
                key: '/mixrobot/map/monitor/action/forklift/emptyRun',
                label: '空跑',
              },
              {
                key: '/mixrobot/map/monitor/action/forklift/toRestArea',
                label: '回休息区',
              },
              {
                key: '/mixrobot/map/monitor/action/forklift/charger',
                label: '小车充电',
              },
              {
                key: '/mixrobot/map/monitor/action/forklift/carryPod',
                label: '搬运',
              },
              {
                key: '/mixrobot/map/monitor/action/forklift/command',
                label: '小车命令',
              },
              {
                key: '/mixrobot/map/monitor/action/forklift/autoForkLiftWorkstationTask',
                label: '叉车自动呼叫',
              },
            ],
          },
        ],
      },
      {
        key: '/mixrobot/map/monitor/view',
        label: '显示',
        children: [
          {
            key: '/mixrobot/map/monitor/view/showLock',
            label: '显示锁格',
          },
          {
            key: '/mixrobot/map/monitor/view/showPath',
            label: '显示路径',
          },
          {
            key: '/mixrobot/map/monitor/view/showPriority',
            label: '优先级显示',
          },
          {
            key: '/mixrobot/map/monitor/view/temporarily',
            label: '临时不可走点',
          },
          {
            key: '/mixrobot/map/monitor/view/mapCellView',
            label: '地图点位',
          },
          {
            key: '/mixrobot/map/monitor/view/binRack',
            label: '料箱货架',
          },
          {
            key: '/mixrobot/map/monitor/view/tracking',
            label: '追踪小车',
          },
          {
            key: '/mixrobot/map/monitor/view/position',
            label: '定位',
          },
          {
            key: '/mixrobot/map/monitor/view/heatView',
            label: '热度显示',
          },
        ],
      },
      {
        key: '/mixrobot/map/monitor/simulator',
        label: '模拟器',
      },
      {
        key: '/mixrobot/map/monitor/exhibition',
        label: 'DashBoard',
      },
      {
        key: '/mixrobot/map/monitor/taskDetail',
        label: '任务详情弹窗',
        children: [
          {
            key: '/mixrobot/map/monitor/taskDetail/taskDetail',
            label: '任务详情',
            children: [
              {
                key: '/mixrobot/map/monitor/taskDetail/taskDetail/reset', // 操作 (重做)
                label: '重做',
              },
              {
                key: '/mixrobot/map/monitor/taskDetail/taskDetail/restore', // 操作 (恢复)
                label: '恢复',
              },
              {
                key: '/mixrobot/map/monitor/taskDetail/taskDetail/repeat', // 操作 (重发)
                label: '重发',
              },
              {
                key: '/mixrobot/map/monitor/taskDetail/taskDetail/cancel', // 操作 (取消)
                label: '取消',
              },
              {
                key: '/mixrobot/map/monitor/taskDetail/taskDetail/errorRecord',
                label: '小车错误记录',
              },
            ],
          },
          {
            key: '/mixrobot/map/monitor/taskDetail/taskPath',
            label: '任务路径',
          },
          {
            key: '/mixrobot/map/monitor/taskDetail/historyRecord',
            label: '历史记录',
          },
        ],
      },
      {
        key: '/mixrobot/map/monitor/agvModal',
        label: '小车点击弹窗',
        children: [
          {
            key: '/mixrobot/map/monitor/agvModal/operation', // 操作
            label: '操作',
            children: [
              {
                key: '/mixrobot/map/monitor/agvModal/operation/rebootAMR', // 重启小车
                label: '重启小车',
              },
              {
                key: '/mixrobot/map/monitor/agvModal/operation/resetAMR', // 重置小车
                label: '重置小车',
              },
              {
                key: '/mixrobot/map/monitor/agvModal/operation/maintainAMR', // 维护小车
                label: '维护小车',
              },
              {
                key: '/mixrobot/map/monitor/agvModal/operation/switchManualMode', // 维护小车
                label: '切换小车手动模式',
              },
              {
                key: '/mixrobot/map/monitor/agvModal/operation/moveoutAMR', // 移出地图
                label: '移出地图',
              },
              {
                key: '/mixrobot/map/monitor/agvModal/operation/exitError', // 退出错误状态
                label: '退出错误状态',
              },
            ],
          },
          {
            key: '/mixrobot/map/monitor/agvModal/task', // 小车点击弹窗-任务
            label: '任务',
            children: [
              {
                key: '/mixrobot/map/monitor/agvModal/task/cancel', // 操作(取消)
                label: '取消',
              },
              {
                key: '/mixrobot/map/monitor/agvModal/task/restart', // 操作（重发）
                label: '重发',
              },
            ],
          },
          {
            key: '/mixrobot/map/monitor/agvModal/error', // 小车点击弹窗-错误
            label: '错误',
          },
          {
            key: '/mixrobot/map/monitor/agvModal/toteBin', // 小车点击弹窗-料箱搬运信息
            label: '料箱搬运信息',
          },
          {
            key: '/mixrobot/map/monitor/agvModal/forkBin', // 小车点击弹窗-叉车叉取信息
            label: '叉车叉取信息',
          },
        ],
      },
      {
        key: '/mixrobot/map/monitor/WorkStationModal',
        label: '工作站点击弹窗',
        children: [
          {
            key: '/mixrobot/map/monitor/WorkStationModal/sign', // 标记在途小车
            label: '标记在途小车',
          },
        ],
      },
      {
        key: '/mixrobot/map/monitor/tunnelModal',
        label: '通道详情弹窗',
        children: [
          {
            key: '/mixrobot/map/monitor/tunnelModal/deleteLock',
            label: '删除通道小车锁',
          },
        ],
      },
    ],
  },
  {
    page: '/mixrobot/map/mapRouteAssign', // 线路分配
    children: [
      {
        key: '/mixrobot/map/mapRouteAssign/add',
        label: '新增',
      },
      {
        key: '/mixrobot/map/mapRouteAssign/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/mixrobot/map/mapAreaManage', // 区域分配
    children: [
      {
        key: '/mixrobot/map/mapAreaManage/add',
        label: '新增',
      },
      {
        key: '/mixrobot/map/mapAreaManage/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/mixrobot/lockManager/targetLock', // 锁管理-目标点锁
    children: [
      {
        key: '/mixrobot/lockManager/targetLock/delete',
        label: '删除',
      },
    ],
  },

  // 锁管理-潜伏类
  {
    page: '/mixrobot/lockManager/latent-lifting/RobotLock',
    children: [
      {
        key: '/mixrobot/lockManager/latent-lifting/RobotLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/mixrobot/lockManager/latent-lifting/storageLock',
    children: [
      {
        key: '/mixrobot/lockManager/latent-lifting/storageLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/mixrobot/lockManager/latent-lifting/PodLock',
    children: [
      {
        key: '/mixrobot/lockManager/latent-lifting/PodLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/mixrobot/lockManager/latent-lifting/heavyRobotAvoidLock',
    children: [
      {
        key: '/mixrobot/lockManager/latent-lifting/heavyRobotAvoidLock/delete',
        label: '删除',
      },
    ],
  },

  // 锁管理-料箱类
  {
    page: '/mixrobot/lockManager/tote/RobotLock',
    children: [
      {
        key: '/mixrobot/lockManager/tote/RobotLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/mixrobot/lockManager/tote/TotePodLock',
    children: [
      {
        key: '/mixrobot/lockManager/tote/TotePodLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/mixrobot/lockManager/tote/ToteBinLock',
    children: [
      {
        key: '/mixrobot/lockManager/tote/ToteBinLock/delete',
        label: '删除',
      },
    ],
  },

  // 锁管理-叉车类
  {
    page: '/mixrobot/lockManager/forklift/RobotLock',
    children: [
      {
        key: '/mixrobot/lockManager/forklift/RobotLock/delete', // 小车锁-删除
        label: '删除',
      },
    ],
  },

  // 资源管理-潜伏货架
  {
    page: '/mixrobot/sourceManage/latentPod/management',
    children: [
      {
        key: '/mixrobot/sourceManage/latentPod/management/add', // 货架管理-添加
        label: '添加',
      },
      {
        key: '/mixrobot/sourceManage/latentPod/management/delete', // 货架管理-删除
        label: '删除',
      },
      {
        key: '/mixrobot/sourceManage/latentPod/management/edit', // 货架管理-编辑
        label: '编辑',
      },
    ],
  },
  {
    page: '/mixrobot/sourceManage/latentPod/assignment',
    children: [
      {
        key: '/mixrobot/sourceManage/latentPod/assignment/add', // 货架分配-新增
        label: '新增',
      },
      {
        key: '/mixrobot/sourceManage/latentPod/assignment/delete', // 货架分配-删除
        label: '删除',
      },
    ],
  },

  // 充电-充电桩管理
  {
    page: '/mixrobot/charge/chargeManger', // 充电-充电桩管理
    children: [
      {
        key: '/mixrobot/charge/chargeManger/switchAvailable',
        label: '切换可用',
      },
      {
        key: '/mixrobot/charge/chargeManger/bindOther',
        label: '更新',
      },
      {
        key: '/mixrobot/charge/chargeManger/untying',
        label: '解绑',
      },
      {
        key: '/mixrobot/charge/chargeManger/reset',
        label: '重置',
      },
    ],
  },
];

export default PermissionInfo;
