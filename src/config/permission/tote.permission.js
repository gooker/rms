const PermissionInfo = [
  {
    page: '/Tote/task/executionQueue', //执行队列
    children: [
      {
        key: '/Tote/task/executionQueue/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/Tote/task/taskQueue', //等待队列
    children: [
      {
        key: '/Tote/task/taskQueue/delete',
        label: '删除',
      },
      {
        key: '/Tote/task/taskQueue/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/Tote/task/taskManger', //任务查询
    children: [
      {
        key: '/Tote/task/taskManger/cancel',
        label: '取消任务',
      },
    ],
  },
  {
    page: '/Tote/agv/agvList', //AGV列表
    children: [
      {
        key: '/Tote/agv/agvList/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/Tote/agv/agvRealTime', //小车监控
    children: [
      {
        key: '/Tote/agv/agvRealTime/realTime',
        label: '小车实时信息',
      },
      {
        key: '/Tote/agv/agvRealTime/taskData',
        label: '小车硬件信息',
        children: [
          {
            key: '/Tote/agv/agvRealTime/taskData/realStatus',
            label: '实时状态信息',
          },
          {
            key: '/Tote/agv/agvRealTime/taskData/attributesAndStatistics',
            label: '属性和统计信息',
          },
          {
            key: '/Tote/agv/agvRealTime/taskData/batteryStatusAndChargeManagement',
            label: '电池状态和充电管理信息',
          },
        ],
      },
      {
        key: '/Tote/agv/agvRealTime/taskRecord',
        label: '小车任务记录',
      },
      {
        key: '/Tote/agv/agvRealTime/errorRecord',
        label: '小车错误记录',
      },
    ],
  },
  {
    page: '/Tote/agv/batchFirmwareUpgrade', //批量升级
    children: [
      {
        key: '/Tote/agv/batchFirmwareUpgrade/Maintain',
        label: '维护/取消维护',
      },
      {
        key: '/Tote/agv/batchFirmwareUpgrade/uploadFirmware',
        label: '上传固件',
      },
      {
        key: '/Tote/agv/batchFirmwareUpgrade/upgrade',
        label: '升级',
      },
    ],
  },
  {
    page: '/Tote/agv/logDownLoad', //日志下载
    children: [
      {
        key: '/Tote/agv/logDownLoad/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/Tote/pod/podRowModelBaseData', //货架尺寸
    children: [
      {
        key: '/Tote/pod/podRowModelBaseData/import',
        label: '导入',
      },
      {
        key: '/Tote/pod/podRowModelBaseData/add',
        label: '添加',
      },
    ],
  },
  {
    page: '/Tote/pod/podRowModelManager', //货架列模板
    children: [
      {
        key: '/Tote/pod/podRowModelManager/add',
        label: '新增',
      },
      {
        key: '/Tote/pod/podRowModelManager/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/Tote/faultManger/faultDefinition', //故障定义
    children: [
      {
        key: '/Tote/faultManger/faultDefinition/add',
        label: '新增',
      },
      {
        key: '/Tote/faultManger/faultDefinition/update',
        label: '修改',
      },
      {
        key: '/Tote/faultManger/faultDefinition/delete',
        label: '删除',
      },
      {
        key: '/Tote/faultManger/faultDefinition/initialization',
        label: '一键初始化',
      },
    ],
  },
  {
    page: '/Tote/formManger/reportCenter', //报表中心
    children: [
      {
        key: '/Tote/formManger/reportCenter/add',
        label: '添加',
      },
      {
        key: '/Tote/formManger/reportCenter/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/Tote/system/chargingStrategy', //充电策略
    children: [
      {
        key: '/Tote/system/chargingStrategy/idle',
        label: '闲时',
        children: [
          {
            key: '/Tote/system/chargingStrategy/idle/strategy',
            label: '配置闲时策略',
          },
        ],
      },
      {
        key: '/Tote/system/chargingStrategy/save',
        label: '保存',
      },
    ],
  },
];
export default PermissionInfo;
