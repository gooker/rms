export function getTaskLoadData() {
  // 日期一定要排序
  return {
    '2022-02-18 13:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        // 任务动作负载
        actionLoad: {
          waitingForAMR: 2, // 等分车时间
          waitCommand: 8, // 等待命令时间
          actionAMR: 4, // 车辆动作时间
          abnormalTime: 4, // 异常时间
          dullTime: 4, // 车辆呆滞时间
        },
        // 任务作业负载
        workLoad: {
          waitingForAMR: 2, // 等分车时间
          fetchTimeAMR: 5, //车辆取料时间
          carryTimeAMR: 10, // 车辆搬料时间
          putTimeAMR: 10, // 车辆放料时间
          dealTimeAMR: 5, // 车辆处理料时间
        },

        // 拣选工作站任务作业负载
        pickingWorkstationWorkload: {
          waitingForAMR: 2, // 等分车时间
          waitingRelease: 2, // 等释放时间
          waitingAtStation: 5, //进站等待时间
          fetchTime: 10, //取料时间
          carryTime: 8, //搬料时间
          backtoTime: 9, //送回时间
        },
      },
    ],
  };
}
