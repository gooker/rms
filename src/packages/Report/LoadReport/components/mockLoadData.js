export function getloadRobotdata() {
  // 日期一定要排序
  return {
    '2022-01-19 12:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        //// 任务次数
        taskTimes: {
          taskNumber: 20,
        },
        //任务距离 米
        taskDistance: {
          taskDistance: 320,
        },
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
          EMPTY_RUN: 20, //空跑
          REST_UNDER_POD: 10, //回休息区
          CARRY_POD_TO_STATION: 60, //工作站任务
          CHARGE_RUN: 30, //充电
          CUSTOM_TASK: 20, //自定义任务
          CARRY_POD_TO_CELL: 0, //搬运货架
        },
        actionLoad: {
          Noaction: 2,
          Up: 8,
          Down: 4,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 9,
        },
        taskDistance: {
          taskDistance: 20,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 10, //空跑  任务时长
          REST_UNDER_POD: 60, //回休息区
          CARRY_POD_TO_STATION: 40, //工作站任务
          CHARGE_RUN: 40, //充电
          CUSTOM_TASK: 40, //自定义任务
          CARRY_POD_TO_CELL: 40, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 5,
          Down: 8,
        },
      },
      {
        robotId: 4,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 3,
          Up: 6,
          Down: 4,
        },
      },
      {
        robotId: 5,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 10,
          Up: 20,
          Down: 25,
        },
      },
    ],
    '2022-01-19 13:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 15,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 5,
          Down: 9,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 250,
        },
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
        actionLoad: {
          Noaction: 10,
          Up: 9,
          Down: 10,
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 150,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 4,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 150,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 5,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 200,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
    ],
    '2022-01-19 14:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: {
          // 任务次数
          taskNumber: 17,
        },
        taskDistance: {
          taskDistance: 140,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 150,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 150,
        },
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
        actionLoad: {
          Noaction: 7,
          Up: 5,
          Down: 4,
        },
      },
      {
        robotId: 4,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 5,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
    ],
    '2022-01-19 15:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 150,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 190,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 150,
        },
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
        actionLoad: {
          Noaction: 9,
          Up: 3,
          Down: 4,
        },
      },
      {
        robotId: 4,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 50,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 5,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 60, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
    ],
    '2022-01-19 16:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 150,
        },
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
          EMPTY_RUN: 40, //空跑
          REST_UNDER_POD: 30, //回休息区
          CARRY_POD_TO_STATION: 30, //工作站任务
          CHARGE_RUN: 20, //充电
          CUSTOM_TASK: 10, //自定义任务
          CARRY_POD_TO_CELL: 60, //搬运货架
        },
        actionLoad: {
          Noaction: 5,
          Up: 16,
          Down: 18,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 3,
        },
        taskDistance: {
          taskDistance: 150,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 2,
        },
        taskDistance: {
          taskDistance: 100,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 4,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 2,
          Up: 5,
          Down: 4,
        },
      },
      {
        robotId: 5,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
    ],
    '2022-01-19 17:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 2,
        },
        taskDistance: {
          taskDistance: 140,
        },
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
          EMPTY_RUN: 60, //空跑
          REST_UNDER_POD: 60, //回休息区
          CARRY_POD_TO_STATION: 60, //工作站任务
          CHARGE_RUN: 60, //充电
          CUSTOM_TASK: 60, //自定义任务
          CARRY_POD_TO_CELL: 60, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 1,
        },
        taskDistance: {
          taskDistance: 100,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 350,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 4,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 6,
          Up: 10,
          Down: 9,
        },
      },
      {
        robotId: 5,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 60,
        },
        taskDistance: {
          taskDistance: 250,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 52, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 60, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 10,
          Up: 10,
          Down: 4,
        },
      },
    ],
    '2022-01-19 18:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 2,
        },
        taskDistance: {
          taskDistance: 60,
        },
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
          EMPTY_RUN: 60, //空跑
          REST_UNDER_POD: 60, //回休息区
          CARRY_POD_TO_STATION: 60, //工作站任务
          CHARGE_RUN: 60, //充电
          CUSTOM_TASK: 60, //自定义任务
          CARRY_POD_TO_CELL: 60, //搬运货架
        },
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 1,
        },
        taskDistance: {
          taskDistance: 100,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 3,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 350,
        },
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
        actionLoad: {
          Noaction: 1,
          Up: 10,
          Down: 4,
        },
      },
      {
        robotId: 4,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 100,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 50, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 2, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 4,
          Up: 10,
          Down: 12,
        },
      },
      {
        robotId: 5,
        robotType: 'Latenglifting',
        taskTimes: {
          taskNumber: 30,
        },
        taskDistance: {
          taskDistance: 150,
        },
        statusallTime: {
          Offline: 5, //离线   状态时长
          Free: 10, // 空闲
          Working: 10, // 执行
          StandBy: 10, // 待命
          Charging: 10, // 充电
          Error: 0, //异常  状态时长结束
        },
        taskallTime: {
          EMPTY_RUN: 52, //空跑  任务时长
          REST_UNDER_POD: 50, //回休息区
          CARRY_POD_TO_STATION: 50, //工作站任务
          CHARGE_RUN: 60, //充电
          CUSTOM_TASK: 50, //自定义任务
          CARRY_POD_TO_CELL: 50, //搬运货架
        },
        actionLoad: {
          Noaction: 5,
          Up: 9,
          Down: 10,
        },
      },
    ],
  };
}
