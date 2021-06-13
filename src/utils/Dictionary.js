import { isNull } from './Utils';

const DictionaryDataSource = {
  // 小车状态
  agvState: {
    Offline: 'app.agvState.Offline',
    StandBy: 'app.agvState.StandBy',
    Working: 'app.agvState.Working',
    Charging: 'app.agvState.Charging',
    Error: 'app.agvState.Error',
    Connecting: 'app.agvState.Connecting',
  },

  // 小车方向
  agvDirection: {
    0: 'app.agv.direction.top',
    90: 'app.agv.direction.right',
    180: 'app.agv.direction.bottom',
    270: 'app.agv.direction.left',
  },


  // 货架方向
  podDirection: {
    0: 'app.pod.side.A',
    90: 'app.pod.side.B',
    180: 'app.pod.side.C',
    270: 'app.pod.side.D',
  },

  // 小车升级
  agvUpgradeStatus: {
    0: 'app.firmware.upgradeSuccess',
    1: 'app.firmware.upgrading',
    2: 'app.firmware.upgradeFailure',
  },

  // 小车固件长传
  agvUploadStatus: {
    0: 'app.firmware.uploadSuccess',
    1: 'app.firmware.uploading',
    2: 'app.firmware.uploadFailure',
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

  // 固件状态
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

  // 电池类型
  batteryType: {
    1: 'app.batteryType.enumeration1', //Lithium iron phosphate
    2: 'app.batteryType.enumeration2', //Latent vehicle (lithium ternary)
    3: 'app.batteryType.enumeration3',
    4: 'app.batteryType.enumeration4', //Sorting car (lithium iron phosphate)
    5: 'app.batteryType.enumeration5', //Latent vehicle 1.2t and bin robot (lithium iron phosphate)
  },
};

function Dictionary(namespace, key) {
  if (namespace) {
    const namespaceData = DictionaryDataSource[namespace];
    if (isNull(key)) {
      return namespaceData;
    } else {
      return namespaceData[key];
    }
  } else {
    return DictionaryDataSource;
  }
}

export default Dictionary;
