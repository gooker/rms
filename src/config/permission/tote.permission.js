const PermissionInfo = [
  {
    page: '/tote/center/executionQueue', //执行队列
    children: [
      {
        key: '/center/executionQueue/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/center/taskQueue', //等待队列
    children: [
      {
        key: '/center/taskQueue/tote/delete',
        label: '删除',
      },
      {
        key: '/center/taskQueue/tote/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/tote/center/taskManger', //任务查询
    children: [
      {
        key: '/center/taskManger/tote/cancel',
        label: '取消任务',
      },
    ],
  },
  {
    page: '/tote/agv/agvList', //AGV列表
    children: [
      {
        key: '/agv/agvList/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/agv/agvRealTime', //小车监控
    children: [
      {
        key: '/agv/agvRealTime/tote/realTime',
        label: '小车实时信息',
      },
      {
        key: '/agv/agvRealTime/tote/taskData',
        label: '小车硬件信息',
        children: [
          {
            key: '/agv/agvRealTime/tote/taskData/realStatus',
            label: '实时状态信息',
          },
          {
            key: '/agv/agvRealTime/tote/taskData/attributesAndStatistics',
            label: '属性和统计信息',
          },
          {
            key: '/agv/agvRealTime/tote/taskData/batteryStatusAndChargeManagement',
            label: '电池状态和充电管理信息',
          },
        ],
      },
      {
        key: '/agv/agvRealTime/tote/taskRecord',
        label: '小车任务记录',
      },
      {
        key: '/agv/agvRealTime/tote/errorRecord',
        label: '小车错误记录',
      },
    ],
  },
  {
    page: '/tote/agv/batchFirmwareUpgrade', //批量升级
    children: [
      {
        key: '/agv/batchFirmwareUpgrade/tote/Maintain',
        label: '维护/取消维护',
      },
      {
        key: '/agv/batchFirmwareUpgrade/tote/uploadFirmware',
        label: '上传固件',
      },
      {
        key: '/agv/batchFirmwareUpgrade/tote/upgrade',
        label: '升级',
      },
    ],
  },
  {
    page: '/tote/agv/logDownLoad', //日志下载
    children: [
      {
        key: '/agv/logDownLoad/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/pod/podRowModelBaseData', //货架尺寸
    children: [
      {
        key: '/pod/podRowModelBaseData/tote/import',
        label: '导入',
      },
      {
        key: '/pod/podRowModelBaseData/tote/add',
        label: '添加',
      },
    ],
  },
  {
    page: '/tote/pod/podRowModelManager', //货架列模板
    children: [
      {
        key: '/pod/podRowModelManager/tote/add',
        label: '新增',
      },
      {
        key: '/pod/podRowModelManager/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/faultManger/faultDefinition', //故障定义
    children: [
      {
        key: '/faultManger/faultDefinition/tote/add',
        label: '新增',
      },
      {
        key: '/faultManger/faultDefinition/tote/update',
        label: '修改',
      },
      {
        key: '/faultManger/faultDefinition/tote/delete',
        label: '删除',
      },
      {
        key: '/faultManger/faultDefinition/tote/initialization',
        label: '一键初始化',
      },
    ],
  },
  {
    page: '/tote/formManger/reportCenter', //报表中心
    children: [
      {
        key: '/formManger/reportCenter/tote/add',
        label: '添加',
      },
      {
        key: '/formManger/reportCenter/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/system/chargingStrategy', //充电策略
    children: [
      {
        key: '/system/chargingStrategy/tote/idle',
        label: '闲时',
        children: [
          {
            key: '/system/chargingStrategy/tote/idle/strategy',
            label: '配置闲时策略',
          },
        ],
      },
      {
        key: '/system/chargingStrategy/tote/save',
        label: '保存',
      },
    ],
  },
];
export default PermissionInfo;
