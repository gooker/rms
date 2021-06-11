import { isNull } from './Utils';

const DictionaryDataSource = {
  agvDirection: {
    0: 'app.agv.direction.top',
    90: 'app.agv.direction.right',
    180: 'app.agv.direction.bottom',
    270: 'app.agv.direction.left',
  },
  chargerDirection: {
    0: 'app.direction.top',
    1: 'app.direction.right',
    2: 'app.direction.bottom',
    3: 'app.direction.left',
  },
  podDirection: {
    0: 'app.pod.side.A',
    90: 'app.pod.side.B',
    180: 'app.pod.side.C',
    270: 'app.pod.side.D',
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
  hardWareStatus: {
    0: 'app.hardWareStatus.standBy',
    1: 'app.hardWareStatus.straightLine',
    2: 'app.hardWareStatus.scanShelf',
    3: 'app.hardWareStatus.turn',
    4: 'app.hardWareStatus.jacking',
    5: 'app.hardWareStatus.decline',
    6: 'app.hardWareStatus.rotatingRack',
    7: 'app.hardWareStatus.Charge',
    8: 'app.hardWareStatus.lowPowerConsumption',
    254: 'app.hardWareStatus.SleepDueToFailure',
    255: 'app.hardWareStatus.fault',
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
    const namespaceData = DictionaryDataSource[namespace];
    if (!isNull(key)) {
      if (key === 'all') {
        return namespaceData;
      }
      return namespaceData[key];
    } else {
      return '';
    }
  } else {
    return DictionaryDataSource;
  }
}

export default dictionary;
