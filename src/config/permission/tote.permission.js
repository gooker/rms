const PermissionInfo = [
  {
    page: '/tote/center/executionQueue', //执行队列
    children: [
      {
        key: '/tote/center/executionQueue/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/center/taskQueue', //等待队列
    children: [
      {
        key: '/tote/center/taskQueue/delete',
        label: '删除',
      },
      {
        key: '/tote/center/taskQueue/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/tote/center/taskManger', //任务查询
    children: [
      {
        key: '/tote/center/taskManger/cancel',
        label: '取消任务',
      },
    ],
  },
  {
    page: '/tote/agv/agvList', //AGV列表
    children: [
      {
        key: '/tote/agv/agvList/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/agv/agvRealTime', //小车监控
    children: [
      {
        key: '/tote/agv/agvRealTime/realTime',
        label: '小车实时信息',
      },
      {
        key: '/tote/agv/agvRealTime/taskData',
        label: '小车硬件信息',
        children: [
          {
            key: '/tote/agv/agvRealTime/taskData/realStatus',
            label: '实时状态信息',
          },
          {
            key: '/tote/agv/agvRealTime/taskData/attributesAndStatistics',
            label: '属性和统计信息',
          },
          {
            key: '/tote/agv/agvRealTime/taskData/batteryStatusAndChargeManagement',
            label: '电池状态和充电管理信息',
          },
        ],
      },
      {
        key: '/tote/agv/agvRealTime/taskRecord',
        label: '小车任务记录',
      },
      {
        key: '/tote/agv/agvRealTime/errorRecord',
        label: '小车错误记录',
      },
    ],
  },
  {
    page: '/tote/agv/batchFirmwareUpgrade', //批量升级
    children: [
      {
        key: '/tote/agv/batchFirmwareUpgrade/Maintain',
        label: '维护/取消维护',
      },
      {
        key: '/tote/agv/batchFirmwareUpgrade/uploadFirmware',
        label: '上传固件',
      },
      {
        key: '/tote/agv/batchFirmwareUpgrade/upgrade',
        label: '升级',
      },
    ],
  },
  {
    page: '/tote/agv/logDownLoad', //日志下载
    children: [
      {
        key: '/tote/agv/logDownLoad/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/pod/podRowModelBaseData', //货架尺寸
    children: [
      {
        key: '/tote/pod/podRowModelBaseData/import',
        label: '导入',
      },
      {
        key: '/tote/pod/podRowModelBaseData/add',
        label: '添加',
      },
    ],
  },
  {
    page: '/tote/pod/podRowModelManager', //货架列模板
    children: [
      {
        key: '/tote/pod/podRowModelManager/add',
        label: '新增',
      },
      {
        key: '/tote/pod/podRowModelManager/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/faultManger/faultDefinition', //故障定义
    children: [
      {
        key: '/tote/faultManger/faultDefinition/add',
        label: '新增',
      },
      {
        key: '/tote/faultManger/faultDefinition/update',
        label: '修改',
      },
      {
        key: '/tote/faultManger/faultDefinition/delete',
        label: '删除',
      },
      {
        key: '/tote/faultManger/faultDefinition/initialization',
        label: '一键初始化',
      },
    ],
  },
  {
    page: '/tote/formManger/reportCenter', //报表中心
    children: [
      {
        key: '/tote/formManger/reportCenter/add',
        label: '添加',
      },
      {
        key: '/tote/formManger/reportCenter/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/system/chargingStrategy', //充电策略
    children: [
      {
        key: '/tote/system/chargingStrategy/idle',
        label: '闲时',
        children: [
          {
            key: '/tote/system/chargingStrategy/idle/strategy',
            label: '配置闲时策略',
          },
        ],
      },
      {
        key: '/tote/system/chargingStrategy/save',
        label: '保存',
      },
    ],
  },
];
export default PermissionInfo;
