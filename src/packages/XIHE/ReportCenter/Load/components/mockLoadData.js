export function getloadRobotdata() {
  return {
    '2022-01-18 18:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          //状态时长
          Offline: 50, //离线
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          //任务时长
          EMPTY_RUN: 0, //空跑
          REST_UNDER_POD: 10, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 20, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 40, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
    ],
    '2022-01-18 19:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          //状态时长
          Offline: 5, //离线
          Free: 100, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          //任务时长
          EMPTY_RUN: 0, //空跑
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
    ],
    '2022-01-18 20:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          //状态时长
          Offline: 5, //离线
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 10, //异常  状态时长结束
        },
        taskallTime: {
          //任务时长
          EMPTY_RUN: 0, //空跑
          REST_UNDER_POD: 40, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 10, //充电
          CUSTOM_TASK: 10, //自定义任务
          CARRY_POD_TO_CELL: 10, //搬运货架
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 50, // 待命
          Charging: 20, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
    ],
    '2022-01-18 21:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          //状态时长
          Offline: 5, //离线
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          //任务时长
          EMPTY_RUN: 0, //空跑
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
    ],
    '2022-01-18 22:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          //状态时长
          Offline: 5, //离线
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 0, // 待命
          Charging: 40, // 充电
          Error: 20, //异常  状态时长结束
        },
        taskallTime: {
          //任务时长
          EMPTY_RUN: 4, //空跑
          REST_UNDER_POD: 30, //回休息区
          CARRY_POD_TO_STATION: 3, //工作站任务
          CHARGE_RUN: 20, //充电
          CUSTOM_TASK: 10, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 10, //回休息区
          CARRY_POD_TO_STATION: 4, //工作站任务
          CHARGE_RUN: 100, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 3, //搬运货架
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 30, // 执行
          StandBy: 20, // 待命
          Charging: 2, // 充电
          Error: 2, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 1, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 5, //工作站任务
          CHARGE_RUN: 10, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
    ],
    '2022-01-18 23:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          //状态时长
          Offline: 5, //离线
          Free: 5, // 空闲
          Working: 2, // 执行
          StandBy: 2, // 待命
          Charging: 2, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          //任务时长
          EMPTY_RUN: 10, //空跑
          REST_UNDER_POD: 5, //回休息区
          CARRY_POD_TO_STATION: 4, //工作站任务
          CHARGE_RUN: 3, //充电
          CUSTOM_TASK: 2, //自定义任务
          CARRY_POD_TO_CELL: 1, //搬运货架
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 1, // 执行
          StandBy: 1, // 待命
          Charging: 1, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 0, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 10, //充电
          CUSTOM_TASK: 40, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: 10, // 任务次数
        taskDistance: 3200, //任务距离 米
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 0, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 20, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 10, //空跑  任务时长
          REST_UNDER_POD: 0, //回休息区
          CARRY_POD_TO_STATION: 0, //工作站任务
          CHARGE_RUN: 0, //充电
          CUSTOM_TASK: 0, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
      },
    ],
  };
}
