const PermissionInfo = [
  {
    page: '/tote/center/executionQueue', //执行队列
    children: [
      {
        key: '/tote/center/executionQueue/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/center/taskQueue', //等待队列
    children: [
      {
        key: '/tote/center/taskQueue/tote/delete',
        label: '删除',
      },
      {
        key: '/tote/center/taskQueue/tote/updatePipLine',
        label: '调整优先级',
      },
    ],
  },
  {
    page: '/tote/center/taskManger', //任务查询
    children: [
      {
        key: '/tote/center/taskManger/tote/cancel',
        label: '取消任务',
      },
    ],
  },
  {
    page: '/tote/agv/agvList', //AGV列表
    children: [
      {
        key: '/tote/agv/agvList/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/agv/agvRealTime', //小车监控
    children: [
      {
        key: '/tote/agv/agvRealTime/tote/realTime',
        label: '小车实时信息',
      },
      {
        key: '/tote/agv/agvRealTime/tote/taskData',
        label: '小车硬件信息',
        children: [
          {
            key: '/tote/agv/agvRealTime/tote/taskData/realStatus',
            label: '实时状态信息',
          },
          {
            key: '/tote/agv/agvRealTime/tote/taskData/attributesAndStatistics',
            label: '属性和统计信息',
          },
          {
            key: '/tote/agv/agvRealTime/tote/taskData/batteryStatusAndChargeManagement',
            label: '电池状态和充电管理信息',
          },
        ],
      },
      {
        key: '/tote/agv/agvRealTime/tote/taskRecord',
        label: '小车任务记录',
      },
      {
        key: '/tote/agv/agvRealTime/tote/errorRecord',
        label: '小车错误记录',
      },
    ],
  },
  {
    page: '/tote/agv/batchFirmwareUpgrade', //批量升级
    children: [
      {
        key: '/tote/agv/batchFirmwareUpgrade/tote/Maintain',
        label: '维护/取消维护',
      },
      {
        key: '/tote/agv/batchFirmwareUpgrade/tote/uploadFirmware',
        label: '上传固件',
      },
      {
        key: '/tote/agv/batchFirmwareUpgrade/tote/upgrade',
        label: '升级',
      },
    ],
  },
  {
    page: '/tote/agv/logDownLoad', //日志下载
    children: [
      {
        key: '/tote/agv/logDownLoad/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/pod/podRowModelBaseData', //货架尺寸
    children: [
      {
        key: '/tote/pod/podRowModelBaseData/tote/import',
        label: '导入',
      },
      {
        key: '/tote/pod/podRowModelBaseData/tote/add',
        label: '添加',
      },
    ],
  },
  {
    page: '/tote/pod/podRowModelManager', //货架列模板
    children: [
      {
        key: '/tote/pod/podRowModelManager/tote/add',
        label: '新增',
      },
      {
        key: '/tote/pod/podRowModelManager/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/faultManger/faultDefinition', //故障定义
    children: [
      {
        key: '/tote/faultManger/faultDefinition/tote/add',
        label: '新增',
      },
      {
        key: '/tote/faultManger/faultDefinition/tote/update',
        label: '修改',
      },
      {
        key: '/tote/faultManger/faultDefinition/tote/delete',
        label: '删除',
      },
      {
        key: '/tote/faultManger/faultDefinition/tote/initialization',
        label: '一键初始化',
      },
    ],
  },
  {
    page: '/tote/formManger/reportCenter', //报表中心
    children: [
      {
        key: '/tote/formManger/reportCenter/tote/add',
        label: '添加',
      },
      {
        key: '/tote/formManger/reportCenter/tote/delete',
        label: '删除',
      },
    ],
  },
  {
    page: '/tote/system/chargingStrategy', //充电策略
    children: [
      {
        key: '/tote/system/chargingStrategy/tote/idle',
        label: '闲时',
        children: [
          {
            key: '/tote/system/chargingStrategy/tote/idle/strategy',
            label: '配置闲时策略',
          },
        ],
      },
      {
        key: '/tote/system/chargingStrategy/tote/save',
        label: '保存',
      },
    ],
  },
];
export default PermissionInfo;
