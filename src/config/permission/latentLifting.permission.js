const PermissionInfo = [
  {
    page: '/latentLifting/task/executionQueue', //执行队列
    children: [
      {
        key: '/latentLifting/task/executionQueue/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/latentLifting/task/taskQueue', //等待队列
    children: [
      {
        key: '/latentLifting/task/taskQueue/delete',
        label: '删除',
      },
      {
        key: '/latentLifting/task/taskQueue/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/latentLifting/task/taskManger', //任务查询
    children: [
      {
        key: '/latentLifting/task/taskManger/cancel',
        label: '取消任务',
      },
    ],
  },
  {
    page: '/latentLifting/agv/agvList', //AGV列表
    children: [
      {
        key: '/latentLifting/agv/agvList/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/latentLifting/agv/agvRealTime', //小车监控
    children: [
      {
        key: '/latentLifting/agv/agvRealTime/realTime',
        label: '小车实时信息',
      },
      {
        key: '/latentLifting/agv/agvRealTime/taskData',
        label: '小车硬件信息',
        children: [
          {
            key: '/latentLifting/agv/agvRealTime/taskData/realStatus',
            label: '实时状态信息',
          },
          {
            key: '/latentLifting/agv/agvRealTime/taskData/attributesAndStatistics',
            label: '属性和统计信息',
          },
          {
            key: '/latentLifting/agv/agvRealTime/taskData/batteryStatusAndChargeManagement',
            label: '电池状态和充电管理信息',
          },
        ],
      },
      {
        key: '/latentLifting/agv/agvRealTime/taskRecord',
        label: '小车任务记录',
      },
      {
        key: '/latentLifting/agv/agvRealTime/errorRecord',
        label: '小车错误记录',
      },
    ],
  },
  {
    page: '/latentLifting/agv/batchFirmwareUpgrade', //批量升级
    children: [
      {
        key: '/latentLifting/agv/batchFirmwareUpgrade/Maintain',
        label: '维护/取消维护',
      },
      {
        key: '/latentLifting/agv/batchFirmwareUpgrade/uploadFirmware',
        label: '上传固件',
      },
      {
        key: '/latentLifting/agv/batchFirmwareUpgrade/upgrade',
        label: '升级',
      },
    ],
  },
  {
    page: '/latentLifting/agv/logDownLoad', //日志下载
    children: [
      {
        key: '/latentLifting/agv/logDownLoad/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/latentLifting/faultManger/faultDefinition', //故障定义
    children: [
      {
        key: '/latentLifting/faultManger/faultDefinition/add',
        label: '新增',
      },
      {
        key: '/latentLifting/faultManger/faultDefinition/update',
        label: '修改',
      },
      {
        key: '/latentLifting/faultManger/faultDefinition/delete',
        label: '删除',
      },
      {
        key: '/latentLifting/faultManger/faultDefinition/initialization',
        label: '一键初始化',
      },
    ],
  },
  {
    page: '/latentLifting/formManger/reportCenter', //报表中心
    children: [
      {
        key: '/latentLifting/formManger/reportCenter/add',
        label: '添加',
      },
      {
        key: '/latentLifting/formManger/reportCenter/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/latentLifting/system/chargingStrategy', //充电策略
    children: [
      {
        key: '/latentLifting/system/chargingStrategy/idle',
        label: '闲时',
        children: [
          {
            key: '/latentLifting/system/chargingStrategy/idle/strategy',
            label: '配置闲时策略',
          },
        ],
      },
      {
        key: '/latentLifting/system/chargingStrategy/save',
        label: '保存',
      },
    ],
  },
];
export default PermissionInfo;
