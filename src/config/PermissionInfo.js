const PermissionInfo = [
  {
    page: '/center/executionQueue',
    children: [
      {
        key: '/center/executionQueue/delete',
        label: '删除执行队列任务',
      },
    ],
  },
  {
    page: '/center/taskQueue',
    children: [
      {
        key: '/center/taskQueue/delete',
        label: '删除等待队列任务',
      },
      {
        key: '/center/taskQueue/reorder',
        label: '调整等待队列任务优先级',
      },
    ],
  },
  {
    page: '/center/taskManger',
    children: [
      {
        key: '/center/taskManger/cancel',
        label: '取消任务',
      },
    ],
  },
  {
    page: '/car/carManger',
    children: [
      {
        key: '/car/carManger/delete',
        label: '删除小车',
      },
      {
        key: '/car/carManger/moveout',
        label: '移出地图',
      },
    ],
  },
  {
    page: '/car/activityLogging',
    children: [
      {
        key: '/car/activityLogging/taskData',
        label: '任务数据',
        children: [
          {
            key: '/car/activityLogging/taskData/action',
            label: '操作小车',
          },
          {
            key: '/car/activityLogging/taskData/maintain',
            label: '维护小车',
          },
          {
            key: '/car/activityLogging/taskData/switchManualMode',
            label: '切换小车手动模式',
          },
          {
            key: '/car/activityLogging/taskData/unbindAbovePod',
            label: '解绑上方货架',
          },
        ],
      },
      {
        key: '/car/activityLogging/agvRealTime',
        label: '小车实时',
        children: [
          {
            key: '/car/activityLogging/agvRealTime/agvStatus',
            label: '小车状态',
          },
          {
            key: '/car/activityLogging/agvRealTime/batteryStatus',
            label: '电池状态',
          },
        ],
      },
      {
        key: '/car/activityLogging/errorRecord',
        label: '小车错误记录',
      },
      {
        key: '/car/activityLogging/taskRecord',
        label: '小车任务记录',
      },
    ],
  },
  {
    page: '/car/batchFirmwareUpgrade',
    children: [
      {
        key: '/car/batchFirmwareUpgrade/maintain',
        label: '维护小车',
      },
      {
        key: '/car/batchFirmwareUpgrade/upload',
        label: '上传固件',
      },
      {
        key: '/car/batchFirmwareUpgrade/upgrade',
        label: '升级小车',
      },
    ],
  },
  {
    page: '/car/loggerDownLoad',
    children: [
      {
        key: '/car/loggerDownLoad/deleteLog',
        label: '删除日志',
      },
    ],
  },
  {
    page: '/faultManger/faultDefinition',
    children: [
      {
        key: '/faultManger/faultDefinition/add',
        label: '自定义故障',
      },
      {
        key: '/faultManger/faultDefinition/update',
        label: '编辑故障',
      },
      {
        key: '/faultManger/faultDefinition/delete',
        label: '删除故障',
      },
      {
        key: '/faultManger/faultDefinition/init',
        label: '初始化故障列表',
      },
    ],
  },
  {
    page: '/formManger/robotErrorInfo',
    children: [
      {
        key: '/formManger/robotErrorInfo/add',
        label: '新增报表组',
      },
      {
        key: '/formManger/robotErrorInfo/delete',
        label: '删除报表组',
      },
    ],
  },
  {
    page: '/system/chargerManageMents',
    children: [
      {
        key: '/system/chargerManageMents/submit',
        label: '保存配置',
      },
      {
        key: '/system/chargerManageMents/idle',
        label: '闲时策略',
        children: [
          {
            key: '/system/chargerManageMents/idle/configIdle',
            label: '配置闲时策略',
          },
        ],
      },
    ],
  },
];

export default PermissionInfo;
