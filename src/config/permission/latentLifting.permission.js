const PermissionInfo = [
  {
    page: '/LatentLifting/task/executionQueue', //执行队列
    children: [
      {
        key: '/LatentLifting/task/executionQueue/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/LatentLifting/task/taskQueue', //等待队列
    children: [
      {
        key: '/LatentLifting/task/taskQueue/delete',
        label: '删除',
      },
      {
        key: '/LatentLifting/task/taskQueue/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/LatentLifting/task/taskManger', //任务查询
    children: [
      {
        key: '/LatentLifting/task/taskManger/cancel',
        label: '取消任务',
      },
    ],
  },
  {
    page: '/LatentLifting/agv/agvList', //AGV列表
    children: [
      {
        key: '/LatentLifting/agv/agvList/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/LatentLifting/agv/agvRealTime', //小车监控
    children: [
      {
        key: '/LatentLifting/agv/agvRealTime/realTime',
        label: '小车实时信息',
      },
      {
        key: '/LatentLifting/agv/agvRealTime/taskData',
        label: '小车硬件信息',
        children: [
          {
            key: '/LatentLifting/agv/agvRealTime/taskData/realStatus',
            label: '实时状态信息',
          },
          {
            key: '/LatentLifting/agv/agvRealTime/taskData/attributesAndStatistics',
            label: '属性和统计信息',
          },
          {
            key: '/LatentLifting/agv/agvRealTime/taskData/batteryStatusAndChargeManagement',
            label: '电池状态和充电管理信息',
          },
        ],
      },
      {
        key: '/LatentLifting/agv/agvRealTime/taskRecord',
        label: '小车任务记录',
      },
      {
        key: '/LatentLifting/agv/agvRealTime/errorRecord',
        label: '小车错误记录',
      },
    ],
  },
  {
    page: '/LatentLifting/agv/batchFirmwareUpgrade', //批量升级
    children: [
      {
        key: '/LatentLifting/agv/batchFirmwareUpgrade/Maintain',
        label: '维护/取消维护',
      },
      {
        key: '/LatentLifting/agv/batchFirmwareUpgrade/uploadFirmware',
        label: '上传固件',
      },
      {
        key: '/LatentLifting/agv/batchFirmwareUpgrade/upgrade',
        label: '升级',
      },
    ],
  },
  {
    page: '/LatentLifting/agv/logDownLoad', //日志下载
    children: [
      {
        key: '/LatentLifting/agv/logDownLoad/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/LatentLifting/faultManger/faultDefinition', //故障定义
    children: [
      {
        key: '/LatentLifting/faultManger/faultDefinition/add',
        label: '新增',
      },
      {
        key: '/LatentLifting/faultManger/faultDefinition/update',
        label: '修改',
      },
      {
        key: '/LatentLifting/faultManger/faultDefinition/delete',
        label: '删除',
      },
      {
        key: '/LatentLifting/faultManger/faultDefinition/initialization',
        label: '一键初始化',
      },
    ],
  },
  {
    page: '/LatentLifting/formManger/reportCenter', //报表中心
    children: [
      {
        key: '/LatentLifting/formManger/reportCenter/add',
        label: '添加',
      },
      {
        key: '/LatentLifting/formManger/reportCenter/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/LatentLifting/system/chargingStrategy', //充电策略
    children: [
      {
        key: '/LatentLifting/system/chargingStrategy/idle',
        label: '闲时',
        children: [
          {
            key: '/LatentLifting/system/chargingStrategy/idle/strategy',
            label: '配置闲时策略',
          },
        ],
      },
      {
        key: '/LatentLifting/system/chargingStrategy/save',
        label: '保存',
      },
    ],
  },
];
export default PermissionInfo;
