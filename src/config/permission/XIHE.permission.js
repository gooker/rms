const PermissionInfo = [
  {
    page: '/XIHE/map/monitor', // 页面 router
    children: [
      {
        key: '/XIHE/map/monitor/operation',
        label: '操作',
        children: [
          {
            key: '/XIHE/map/monitor/operation/latent',
            label: '潜伏车',
            children: [
              {
                key: '/XIHE/map/monitor/action/latent/emptyRun',
                label: '空跑',
              },
              {
                key: '/XIHE/map/monitor/action/latent/setupPod',
                label: '设置货架',
              },
              {
                key: '/XIHE/map/monitor/action/latent/toRestArea',
                label: '回休息区',
              },
              {
                key: '/XIHE/map/monitor/action/latent/charger',
                label: '小车充电',
              },
              {
                key: '/XIHE/map/monitor/action/latent/command',
                label: '小车命令',
              },
              {
                key: '/XIHE/map/monitor/action/latent/handlingRack',
                label: '搬运货架',
              },
              {
                key: '/XIHE/map/monitor/action/latent/advancedHandlingRack',
                label: '高级搬运货架',
              },
              {
                key: '/XIHE/map/monitor/action/latent/callRackToWorkstation',
                label: '呼叫货架到工作站',
              },
              {
                key: '/XIHE/map/monitor/action/latent/autoLatentWorkstationTask',
                label: '工作站自动任务',
              },
              {
                key: '/XIHE/map/monitor/action/latent/messagePaused',
                label: '暂停消息',
              },
              {
                key: '/XIHE/map/monitor/action/latent/addPod',
                label: '添加',
              },
              {
                key: '/XIHE/map/monitor/action/latent/batchAddPod',
                label: '批量添加',
              },
            ],
          },
          {
            key: '/XIHE/map/monitor/operation/tote',
            label: '料箱车',
            children: [
              {
                key: '/XIHE/map/monitor/action/tote/emptyRun',
                label: '空跑',
              },
              {
                key: '/XIHE/map/monitor/action/tote/toRestArea',
                label: '回休息区',
              },
              {
                key: '/XIHE/map/monitor/action/tote/charger',
                label: '小车充电',
              },
              {
                key: '/XIHE/map/monitor/action/tote/command',
                label: '小车命令',
              },
              {
                key: '/XIHE/map/monitor/action/tote/toteWorkstationTask',
                label: '料箱工作站任务',
              },
              {
                key: '/XIHE/map/monitor/action/tote/autoToteWorkstationTask',
                label: '料箱工作站自动任务',
              },
            ],
          },
          {
            key: '/XIHE/map/monitor/operation/fork',
            label: '叉车',
            children: [
              {
                key: '/XIHE/map/monitor/action/forklift/emptyRun',
                label: '空跑',
              },
              {
                key: '/XIHE/map/monitor/action/forklift/toRestArea',
                label: '回休息区',
              },
              {
                key: '/XIHE/map/monitor/action/forklift/charger',
                label: '小车充电',
              },
              {
                key: '/XIHE/map/monitor/action/forklift/carryPod',
                label: '搬运',
              },
              {
                key: '/XIHE/map/monitor/action/forklift/command',
                label: '小车命令',
              },
              {
                key: '/XIHE/map/monitor/action/forklift/autoForkLiftWorkstationTask',
                label: '叉车自动呼叫',
              },
            ],
          },
          {
            key: '/XIHE/map/monitor/operation/sorter',
            label: '分拣车',
            children: [
              {
                key: '/XIHE/map/monitor/action/sorter/emptyRun',
                label: '空跑',
              },
              {
                key: '/XIHE/map/monitor/action/sorter/toRestArea',
                label: '回休息区',
              },
              {
                key: '/XIHE/map/monitor/action/sorter/charger',
                label: '小车充电',
              },
              {
                key: '/XIHE/map/monitor/action/sorter/pick',
                label: '取货',
              },
              {
                key: '/XIHE/map/monitor/action/sorter/throw',
                label: '抛货',
              },
            ],
          },
        ],
      },
      {
        key: '/XIHE/map/monitor/view',
        label: '显示',
        children: [
          {
            key: '/XIHE/map/monitor/view/showLock',
            label: '显示锁格',
          },
          {
            key: '/XIHE/map/monitor/view/showPath',
            label: '显示路径',
          },
          {
            key: '/XIHE/map/monitor/view/showPriority',
            label: '优先级显示',
          },
          {
            key: '/XIHE/map/monitor/view/temporarily',
            label: '临时不可走点',
          },
          {
            key: '/XIHE/map/monitor/view/mapCellView',
            label: '地图点位',
          },
          // 料箱
          {
            key: '/XIHE/map/monitor/view/binRack',
            label: '显示料箱货架',
          },
          {
            key: '/XIHE/map/monitor/view/toteTaskPath',
            label: '料箱任务路径',
          },
          {
            key: '/XIHE/map/monitor/view/toteBinState',
            label: '料箱实时状态',
          },
          {
            key: '/XIHE/map/monitor/view/tracking',
            label: '追踪小车',
          },
          {
            key: '/XIHE/map/monitor/view/position',
            label: '定位',
          },
          {
            key: '/XIHE/map/monitor/view/heatView',
            label: '热度显示',
          },
          {
            key: '/XIHE/map/monitor/view/mapCadShadow',
            label: 'CAD背景显示',
          },
        ],
      },
      {
        key: '/XIHE/map/monitor/simulator',
        label: '模拟器',
      },
      {
        key: '/XIHE/map/monitor/exhibition',
        label: 'DashBoard',
      },
      {
        key: '/XIHE/map/monitor/taskDetail',
        label: '任务详情弹窗',
        children: [
          {
            key: '/XIHE/map/monitor/taskDetail/taskDetail',
            label: '任务详情',
            children: [
              {
                key: '/XIHE/map/monitor/taskDetail/taskDetail/reset', // 操作 (重做)
                label: '重做',
              },
              {
                key: '/XIHE/map/monitor/taskDetail/taskDetail/restore', // 操作 (恢复)
                label: '恢复',
              },
              {
                key: '/XIHE/map/monitor/taskDetail/taskDetail/repeat', // 操作 (重发)
                label: '重发',
              },
              {
                key: '/XIHE/map/monitor/taskDetail/taskDetail/cancel', // 操作 (取消)
                label: '取消',
              },
              {
                key: '/XIHE/map/monitor/taskDetail/taskDetail/errorRecord',
                label: '小车错误记录',
              },
            ],
          },
          {
            key: '/XIHE/map/monitor/taskDetail/taskPath',
            label: '任务路径',
          },
          {
            key: '/XIHE/map/monitor/taskDetail/historyRecord',
            label: '历史记录',
          },
        ],
      },
      {
        key: '/XIHE/map/monitor/agvModal',
        label: '小车点击弹窗',
        children: [
          {
            key: '/XIHE/map/monitor/agvModal/operation', // 操作
            label: '操作',
            children: [
              {
                key: '/XIHE/map/monitor/agvModal/operation/rebootAMR', // 重启小车
                label: '重启小车',
              },
              {
                key: '/XIHE/map/monitor/agvModal/operation/resetAMR', // 重置小车
                label: '重置小车',
              },
              {
                key: '/XIHE/map/monitor/agvModal/operation/maintainAMR', // 维护小车
                label: '维护小车',
              },
              {
                key: '/XIHE/map/monitor/agvModal/operation/switchManualMode', // 维护小车
                label: '切换小车手动模式',
              },
              {
                key: '/XIHE/map/monitor/agvModal/operation/moveoutAMR', // 移出地图
                label: '移出地图',
              },
              {
                key: '/XIHE/map/monitor/agvModal/operation/exitError', // 退出错误状态
                label: '退出错误状态',
              },
            ],
          },
          {
            key: '/XIHE/map/monitor/agvModal/task', // 小车点击弹窗-任务
            label: '任务',
            children: [
              {
                key: '/XIHE/map/monitor/agvModal/task/cancel', // 操作(取消)
                label: '取消',
              },
              {
                key: '/XIHE/map/monitor/agvModal/task/restart', // 操作（重发）
                label: '重发',
              },
            ],
          },
          {
            key: '/XIHE/map/monitor/agvModal/controller', // 小车点击弹窗-遥控
            label: '遥控',
          },
          {
            key: '/XIHE/map/monitor/agvModal/error', // 小车点击弹窗-错误
            label: '错误',
          },
          {
            key: '/XIHE/map/monitor/agvModal/runningInfo', // 小车点击弹窗-错误
            label: '运行时信息',
          },
          {
            key: '/XIHE/map/monitor/agvModal/toteBin', // 小车点击弹窗-料箱搬运信息
            label: '料箱搬运信息',
          },
          {
            key: '/XIHE/map/monitor/agvModal/totePoolTask', // 小车点击弹窗-料箱池任务
            label: '料箱池任务',
          },
          {
            key: '/XIHE/map/monitor/agvModal/forkBin', // 小车点击弹窗-叉车叉取信息
            label: '叉车叉取信息',
          },
        ],
      },
      {
        key: '/XIHE/map/monitor/WorkStationModal',
        label: '工作站点击弹窗',
        children: [
          {
            key: '/XIHE/map/monitor/WorkStationModal/sign', // 标记在途小车
            label: '标记在途小车',
          },
        ],
      },
      {
        key: '/XIHE/map/monitor/tunnelModal',
        label: '通道点击弹窗',
        children: [
          {
            key: '/XIHE/map/monitor/tunnelModal/deleteLock',
            label: '删除通道小车锁',
          },
        ],
      },
      {
        key: '/XIHE/map/monitor/chargerMaintain',
        label: '充电桩点击弹窗',
      },
    ],
  },
  {
    page: '/XIHE/lockManager/targetLock', // 锁管理-目标点锁
    children: [
      {
        key: '/XIHE/lockManager/targetLock/delete',
        label: '删除',
      },
    ],
  },

  // 锁管理-潜伏类
  {
    page: '/XIHE/lockManager/latent-lifting/RobotLock',
    children: [
      {
        key: '/XIHE/lockManager/latent-lifting/RobotLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/XIHE/lockManager/latent-lifting/storageLock',
    children: [
      {
        key: '/XIHE/lockManager/latent-lifting/storageLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/XIHE/lockManager/latent-lifting/PodLock',
    children: [
      {
        key: '/XIHE/lockManager/latent-lifting/PodLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/XIHE/lockManager/latent-lifting/heavyRobotAvoidLock',
    children: [
      {
        key: '/XIHE/lockManager/latent-lifting/heavyRobotAvoidLock/delete',
        label: '删除',
      },
    ],
  },

  // 锁管理-料箱类
  {
    page: '/XIHE/lockManager/tote/RobotLock',
    children: [
      {
        key: '/XIHE/lockManager/tote/RobotLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/XIHE/lockManager/tote/TotePodLock',
    children: [
      {
        key: '/XIHE/lockManager/tote/TotePodLock/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/XIHE/lockManager/tote/ToteBinLock',
    children: [
      {
        key: '/XIHE/lockManager/tote/ToteBinLock/delete',
        label: '删除',
      },
    ],
  },

  // 锁管理-叉车类
  {
    page: '/XIHE/lockManager/forklift/RobotLock',
    children: [
      {
        key: '/XIHE/lockManager/forklift/RobotLock/delete', // 小车锁-删除
        label: '删除',
      },
    ],
  },

  // 资源管理-潜伏货架
  {
    page: '/XIHE/sourceManage/latentPod/management',
    children: [
      {
        key: '/XIHE/sourceManage/latentPod/management/add', // 货架管理-添加
        label: '添加',
      },
      {
        key: '/XIHE/sourceManage/latentPod/management/delete', // 货架管理-删除
        label: '删除',
      },
      {
        key: '/XIHE/sourceManage/latentPod/management/edit', // 货架管理-编辑
        label: '编辑',
      },
    ],
  },
  {
    page: '/XIHE/sourceManage/latentPod/assignment',
    children: [
      {
        key: '/XIHE/sourceManage/latentPod/assignment/add', // 货架分配-新增
        label: '新增',
      },
      {
        key: '/XIHE/sourceManage/latentPod/assignment/delete', // 货架分配-删除
        label: '删除',
      },
    ],
  },
  {
    page: '/XIHE/sourceManage/mapRouteAssign', // 线路分配
    children: [
      {
        key: '/XIHE/sourceManage/mapRouteAssign/add',
        label: '新增',
      },
      {
        key: '/XIHE/sourceManage/mapRouteAssign/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/XIHE/sourceManage/mapAreaManage', // 区域分配
    children: [
      {
        key: '/XIHE/sourceManage/mapAreaManage/add',
        label: '新增',
      },
      {
        key: '/XIHE/sourceManage/mapAreaManage/delete',
        label: '删除',
      },
    ],
  },

  {
    page: '/XIHE/sourceManage/agvGroup', // 小车分组
    children: [
      {
        key: '/XIHE/sourceManage/agvGroup/add',
        label: '新增',
      },
      {
        key: '/XIHE/sourceManage/agvGroup/delete',
        label: '删除',
      },
    ],
  },

  // 充电-充电桩绑定
  {
    page: '/XIHE/charge/chargeMangerBind', // 充电-充电桩管理
    children: [
      {
        key: '/XIHE/charge/chargeMangerBind/switchAvailable',
        label: '切换可用',
      },
    ],
  },
];
export default PermissionInfo;
