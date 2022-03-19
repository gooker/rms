export function getTaskLoadData() {
  // 日期一定要排序
  return {
    '2022-02-22 10:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        // 任务动作负载
        actionLoad: {
          waitingForAMR: 2, // 等分车时间
          waitCommand: 8, // 等命令时间
          actionAMR: 4, // 车辆动作时间
          abnormalTime: 4, // 异常时间
          dullTime: 4, // 车辆呆滞时间
        },
        // 任务作业负载
        workLoad: {
          waitingForAMR: 4, // 等分车时间
          fetchTime: 5, //取料时间
          carryTime: 10, // 搬料时间
          putTime: 10, // 放料时间
          dealTime: 5, // 处理料时间
        },

        // 拣选工作站任务作业负载
        pickingWorkstationWorkload: {
          waitingForAMR: 2, // 等分车时间
          waitingRelease: 2, // 等释放时间
          waitingAtStation: 5, //进站等待时间
          fetchTime: 10,
          carryTime: 8,
          backtoTime: 9, //送回时间
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 5,
          waitCommand: 5,
          actionAMR: 9,
          abnormalTime: 8,
          dullTime: 1,
        },
        workLoad: {
          waitingForAMR: 3,
          fetchTime: 3,
          carryTime: 6,
          putTime: 8,
          dealTime: 10,
        },
        pickingWorkstationWorkload: {
          waitingForAMR: 2,
          waitingRelease: 2,
          waitingAtStation: 5,
          fetchTime: 10,
          carryTime: 8,
          backtoTime: 9,
        },
      },
    ],
    '2022-02-22 11:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 15,
          waitCommand: 17,
          actionAMR: 20,
          abnormalTime: 22,
          dullTime: 9,
        },
        workLoad: {
          waitingForAMR: 9,
          fetchTime: 10,
          carryTime: 10,
          putTime: 8,
          dealTime: 15,
        },

        pickingWorkstationWorkload: {
          waitingForAMR: 8,
          waitingRelease: 8,
          waitingAtStation: 7,
          fetchTime: 8,
          carryTime: 18,
          backtoTime: 6,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 5,
          waitCommand: 5,
          actionAMR: 5,
          abnormalTime: 5,
          dullTime: 1,
        },
        workLoad: {
          waitingForAMR: 7,
          fetchTime: 7,
          carryTime: 6,
          putTime: 8,
          dealTime: 7,
        },
        pickingWorkstationWorkload: {
          waitingForAMR: 5,
          waitingRelease: 5,
          waitingAtStation: 5,
          fetchTime: 10,
          carryTime: 5,
          backtoTime: 5,
        },
      },
    ],
    '2022-02-22 12:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 10,
          waitCommand: 11,
          actionAMR: 20,
          abnormalTime: 1,
          dullTime: 5,
        },
        workLoad: {
          waitingForAMR: 4,
          fetchTime: 6,
          carryTime: 8,
          putTime: 5,
          dealTime: 1,
        },

        pickingWorkstationWorkload: {
          waitingForAMR: 8,
          waitingRelease: 8,
          waitingAtStation: 5,
          fetchTime: 4,
          carryTime: 8,
          backtoTime: 6,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 10,
          waitCommand: 10,
          actionAMR: 10,
          abnormalTime: 9,
          dullTime: 1,
        },
        workLoad: {
          waitingForAMR: 7,
          fetchTime: 7,
          carryTime: 6,
          putTime: 6,
          dealTime: 7,
        },
        pickingWorkstationWorkload: {
          waitingForAMR: 5,
          waitingRelease: 5,
          waitingAtStation: 5,
          fetchTime: 4,
          carryTime: 5,
          backtoTime: 5,
        },
      },
    ],
    '2022-02-22 13:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 5,
          waitCommand: 7,
          actionAMR: 10,
          abnormalTime: 12,
          dullTime: 9,
        },
        workLoad: {
          waitingForAMR: 19,
          fetchTime: 6,
          carryTime: 8,
          putTime: 10,
          dealTime: 5,
        },

        pickingWorkstationWorkload: {
          waitingForAMR: 8,
          waitingRelease: 8,
          waitingAtStation: 5,
          fetchTime: 8,
          carryTime: 8,
          backtoTime: 6,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 5,
          waitCommand: 5,
          actionAMR: 5,
          abnormalTime: 5,
          dullTime: 1,
        },
        workLoad: {
          waitingForAMR: 7,
          fetchTime: 7,
          carryTime: 6,
          putTime: 8,
          dealTime: 7,
        },
        pickingWorkstationWorkload: {
          waitingForAMR: 5,
          waitingRelease: 5,
          waitingAtStation: 5,
          fetchTime: 10,
          carryTime: 5,
          backtoTime: 5,
        },
      },
    ],
    '2022-02-22 14:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 5,
          waitCommand: 7,
          actionAMR: 10,
          abnormalTime: 12,
          dullTime: 9,
        },
        workLoad: {
          waitingForAMR: 5,
          fetchTime: 5,
          carryTime: 8,
          putTime: 4,
          dealTime: 3,
        },

        pickingWorkstationWorkload: {
          waitingForAMR: 8,
          waitingRelease: 8,
          waitingAtStation: 5,
          fetchTime: 8,
          carryTime: 16,
          backtoTime: 12,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 10,
          waitCommand: 5,
          actionAMR: 5,
          abnormalTime: 5,
          dullTime: 5,
        },
        workLoad: {
          waitingForAMR: 7,
          fetchTime: 7,
          carryTime: 6,
          putTime: 8,
          dealTime: 7,
        },
        pickingWorkstationWorkload: {
          waitingForAMR: 5,
          waitingRelease: 5,
          waitingAtStation: 5,
          fetchTime: 10,
          carryTime: 5,
          backtoTime: 5,
        },
      },
    ],
    '2022-02-22 15:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 5,
          waitCommand: 7,
          actionAMR: 10,
          abnormalTime: 12,
          dullTime: 9,
        },
        workLoad: {
          waitingForAMR: 8,
          fetchTime: 6,
          carryTime: 20,
          putTime: 8,
          dealTime: 5,
        },

        pickingWorkstationWorkload: {
          waitingForAMR: 8,
          waitingRelease: 8,
          waitingAtStation: 5,
          fetchTime: 8,
          carryTime: 8,
          backtoTime: 6,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 5,
          waitCommand: 5,
          actionAMR: 5,
          abnormalTime: 5,
          dullTime: 1,
        },
        workLoad: {
          waitingForAMR: 7,
          fetchTime: 7,
          carryTime: 6,
          putTime: 8,
          dealTime: 7,
        },
        pickingWorkstationWorkload: {
          waitingForAMR: 5,
          waitingRelease: 5,
          waitingAtStation: 5,
          fetchTime: 10,
          carryTime: 5,
          backtoTime: 5,
        },
      },
    ],
    '2022-02-22 16:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 5,
          waitCommand: 7,
          actionAMR: 10,
          abnormalTime: 12,
          dullTime: 9,
        },
        workLoad: {
          waitingForAMR: 9,
          fetchTime: 6,
          carryTime: 8,
          putTime: 10,
          dealTime: 5,
        },

        pickingWorkstationWorkload: {
          waitingForAMR: 8,
          waitingRelease: 8,
          waitingAtStation: 5,
          fetchTime: 8,
          carryTime: 8,
          backtoTime: 6,
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        actionLoad: {
          waitingForAMR: 10,
          waitCommand: 10,
          actionAMR: 9,
          abnormalTime: 9,
          dullTime: 2,
        },
        workLoad: {
          waitingForAMR: 7,
          fetchTime: 7,
          carryTime: 6,
          putTime: 8,
          dealTime: 7,
        },
        pickingWorkstationWorkload: {
          waitingForAMR: 5,
          waitingRelease: 5,
          waitingAtStation: 5,
          fetchTime: 10,
          carryTime: 5,
          backtoTime: 5,
        },
      },
    ],
  };
}

// test 数据-后端返回颜色
export function getTaskLoadData1() {
  // 日期一定要排序
  return {
    '2022-02-18 13:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        // 任务动作负载
        actionLoad: {
          waitingForAMR: {
            color: '#0c3eb2',
            value: 2,
            label: '等分车时间',
          },
          waitCommand: {
            color: '#1890ff',
            value: 8,
            label: '等命令时间',
          }, // 等命令时间
          actionAMR: {
            color: '#33cf8f',
            value: 4,
            label: '车辆动作时间',
          }, // 车辆动作时间
          abnormalTime: {
            value: 4,
            color: '#e54c10',
            label: '异常时间',
          }, // 异常时间
          dullTime: {
            value: 7,
            color: '#8629bf',
            label: '车辆呆滞时间',
          }, // 车辆呆滞时间
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        // 任务动作负载
        actionLoad: {
          waitingForAMR: {
            color: '#0c3eb2',
            value: 2,
            label: '等分车时间',
          },
          waitCommand: {
            color: '#1890ff',
            value: 8,
            label: '等命令时间',
          }, // 等命令时间
          actionAMR: {
            color: '#33cf8f',
            value: 4,
            label: '车辆动作时间',
          }, // 车辆动作时间
          abnormalTime: {
            value: 4,
            color: '#e54c10',
            label: '异常时间',
          }, // 异常时间
          dullTime: {
            value: 7,
            color: '#8629bf',
            label: '车辆呆滞时间',
          }, // 车辆呆滞时间
        },
      },
    ],
    '2022-02-18 14:00': [
      {
        robotId: 1,
        robotType: 'Latenglifting',
        // 任务动作负载
        actionLoad: {
          waitingForAMR: {
            color: '#0c3eb2',
            value: 8,
            label: '等分车时间',
          },
          waitCommand: {
            color: '#123456',
            value: 7,
            label: '等命令时间',
          }, // 等命令时间
          actionAMR: {
            color: '#e34561a',
            value: 3,
            label: '车辆动作时间',
          }, // 车辆动作时间
          abnormalTime: {
            value: 3,
            color: '#e54c10',
            label: '异常时间',
          }, // 异常时间
          dullTime: {
            value: 7,
            color: '#8629bf',
            label: '车辆呆滞时间',
          }, // 车辆呆滞时间
        },
      },
      {
        robotId: 2,
        robotType: 'Latenglifting',
        // 任务动作负载
        actionLoad: {
          waitingForAMR: {
            color: '#0c3eb2',
            value: 5,
            label: '等分车时间',
          },
          waitCommand: {
            color: '#123456',
            value: 7,
            label: '等命令时间',
          }, // 等命令时间
          actionAMR: {
            color: '#e34561a',
            value: 3,
            label: '车辆动作时间',
          }, // 车辆动作时间
          abnormalTime: {
            value: 3,
            color: '#e54c10',
            label: '异常时间',
          }, // 异常时间
          dullTime: {
            value: 5,
            color: '#8629bf',
            label: '车辆呆滞时间',
          }, // 车辆呆滞时间
        },
      },
    ],
  };
}
