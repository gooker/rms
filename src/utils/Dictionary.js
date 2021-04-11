const dictionaryDataSource = {
  chargerDirection: {
    0: 'app.direction.top',
    1: 'app.direction.right',
    2: 'app.direction.bottom',
    3: 'app.direction.left',
  },
  podDirection: {
    0: 'app.pod.side.A',
    1: 'app.pod.side.B',
    2: 'app.pod.side.C',
    3: 'app.pod.side.D',
  },
  agvUpgradeStatus: {
    0: 'app.firmware.upgradeSuccess',
    1: 'app.firmware.upgrading',
    2: 'app.firmware.upgradeFailure',
  },
  agvUploadStatus: {
    0: 'app.firmware.uploadSuccess',
    1: 'app.firmware.uploading',
    2: 'app.firmware.uploadFailure',
  },

  taskStatus: {
    New: 'app.activity.TaskNew',
    Executing: 'app.activity.TaskExecuting',
    Finished: 'app.activity.TaskFinished',
    Error: 'app.activity.TaskError',
    Cancel: 'app.activity.TaskCancel',
  },
  agvStatus: {
    Offline: 'app.activity.Offline',
    StandBy: 'app.activity.StandBy',
    Working: 'app.activity.Working',
    Charging: 'app.activity.Charging',
    Error: 'app.activity.Error',
    Connecting: 'app.activity.Connecting',
  },
  agvDirection: {
    0: 'app.agv.direction.top',
    1: 'app.agv.direction.right',
    2: 'app.agv.direction.bottom',
    3: 'app.agv.direction.left',
    4: 'app.common.noRecord',
  },
  agvTaskType: {
    EMPTY_RUN: 'app.activity.EMPTY_RUN',
    CARRY_POD_TO_STATION: 'app.activity.CARRY_POD_TO_STATION',
    CHARGE_RUN: 'app.activity.CHARGE_RUN',
    REST_UNDER_POD: 'app.activity.REST_UNDER_POD',
    CARRY_POD_TO_CELL: 'app.activity.CARRY_POD_TO_CELL',
    HEARVY_CARRY_POD_TO_STORE: 'app.activity.HEARVY_CARRY_POD_TO_STORE',
    RUN_TO_SAFETY_AREA: 'app.activity.RUN_TO_SAFETY_AREA',
    SUPER_CARRY_POD_TO_CELL: 'app.activity.SUPER_CARRY_POD_TO_CELL',
    FROCK_CARRY_TO_CELL: 'app.activity.FROCK_CARRY_TO_CELL',
    ROLLER_CARRY_TO_CELL: 'app.activity.ROLLER_CARRY_TO_CELL',
  },
  color: {
    red: '#f5222d',
    blue: '#1890FF',
    green: '#2FC25B',
    yellow: 'rgb(255, 205, 54)',
    purple: '#9e2ace',
    pink: '#ce2a7d',
    gray: '#b3b2b2',
    cyan: '#13c2c2',
  },

  detailWidth: {
    'screen-xs': 500,
    'screen-sm': 600,
    'screen-md': 700,
    'screen-lg': 900,
    'screen-xl': 1150,
    'screen-xxl': 1300,
  },
  handwareStatus: {
    0: 'app.handwareStatus.standBy',
    1: 'app.handwareStatus.straightLine',
    2: 'app.handwareStatus.scanShelf',
    3: 'app.handwareStatus.turn',
    4: 'app.handwareStatus.jacking',
    5: 'app.handwareStatus.decline',
    6: 'app.handwareStatus.rotatingRack',
    7: 'app.handwareStatus.Charge',
    8: 'app.handwareStatus.lowPowerConsumption',
    254: 'app.handwareStatus.SleepDueToFailure',
    255: 'app.handwareStatus.fault',
  },

  errorType: {
    0: 'app.MCUAndHardware',
    2: 'app.NavigationQRCode',
    3: 'app.ObstacleAvoidanceAndSafety',
    4: 'app.Sensor',
    5: 'app.InsModule',
    6: 'app.MotorModule',
    7: 'app.BatteryModule',
    8: 'app.WIFI',
    9: 'app.Charge',
  },
  batteryType: {
    1: 'app.batteryType.enumeration1', //Lithium iron phosphate
    2: 'app.batteryType.enumeration2', //Latent vehicle (lithium ternary)
    3: 'app.batteryType.enumeration3',
    4: 'app.batteryType.enumeration4', //Sorting car (lithium iron phosphate)
    5: 'app.batteryType.enumeration5', //Latent vehicle 1.2t and bin robot (lithium iron phosphate)
  },
  formTableElements: {
    agvId: 'form.robotId',
    currentRobotId: 'form.robotId',
    count: 'app.formTableElements.count',
    createTime: 'app.system.createDate',
    errorDefinition_level: 'app.faultDefinition.errorLevel',
    errorCode: 'app.faultInfo.errorCode',
    type: 'form.taskType',
    taskStatus: 'form.taskStatus',
  },

  // syslog.txt/syslog1.old/syslog2.old/syslog3.old
  uploadFilesName: [
    { name: 'syslog.txt' },
    { name: 'syslog1.old' },
    { name: 'syslog2.old' },
    { name: 'syslog3.old' },
    { name: 'config.txt' },
  ],
};

function dictionary(namespace, key) {
  if (namespace) {
    const obj = dictionaryDataSource[namespace];
    if (key) {
      if (key === 'all') {
        return obj;
      }
      return obj[key];
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export default dictionary;
