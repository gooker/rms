import { isNull } from './utils';

const DictionaryDataSource = {
  // 小车状态
  agvState: {
    Offline: 'app.agvState.Offline',
    StandBy: 'app.agvState.StandBy',
    Working: 'app.agvState.Working',
    Charging: 'app.agvState.Charging',
    Error: 'app.agvState.Error',
    Connecting: 'app.agvState.Connecting',
    Waiting:'app.agvState.Waiting'
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
  agvTaskType: {
    // 潜伏车
    EMPTY_RUN: 'app.activity.EMPTY_RUN',
    CHARGE_RUN: 'app.activity.CHARGE_RUN',
    REST_UNDER_POD: 'app.activity.REST_UNDER_POD',
    CARRY_POD_TO_CELL: 'app.activity.CARRY_POD_TO_CELL',
    RUN_TO_SAFETY_AREA: 'app.activity.RUN_TO_SAFETY_AREA',
    CARRY_POD_TO_STATION: 'app.activity.CARRY_POD_TO_STATION',
    SUPER_CARRY_POD_TO_CELL: 'app.activity.SUPER_CARRY_POD_TO_CELL',
    HEARVY_CARRY_POD_TO_STORE: 'app.activity.HEARVY_CARRY_POD_TO_STORE',
    FROCK_CARRY_TO_CELL: 'app.activity.FROCK_CARRY_TO_CELL',
    ROLLER_CARRY_TO_CELL: 'app.activity.ROLLER_CARRY_TO_CELL',

    // 料箱
    TOTE_PUT: 'app.activity.TOTE_PUT',
    TOTE_CARRY: 'app.activity.TOTE_CARRY',
    TOTE_EMPTY_RUN: 'app.activity.EMPTY_RUN',
    TOTE_CHARGE_RUN: 'app.activity.CHARGE_RUN',
    TOTE_ROLLER_PUT: 'app.activity.TOTE_ROLLER_PUT',
    TOTE_NONE_CARRY: 'app.activity.TOTE_NONE_CARRY',
    TOTE_STATION_CARRY: 'app.activity.TOTE_STATION_CARRY',
    TOTE_TO_WORK_STATION: 'app.activity.CARRY_POD_TO_STATION',
    TOTE_REST_ON_REST_CELL: 'app.activity.TOTE_REST_ON_REST_CELL',
    TOTE_RUN_TO_SAFETY_AREA: 'app.activity.TOTE_RUN_TO_SAFETY_AREA',
    TOTE_TO_ROLLER_WORK_STATION: 'app.activity.TOTE_TO_ROLLER_WORK_STATION',
    TOTE_TO_NONE_ROLLER_WORK_STATION: 'app.activity.TOTE_TO_NONE_ROLLER_WORK_STATION',
    TOTE_TO_FACTORY_ROLLER_WORK_STATION: 'app.activity.TOTE_TO_FACTORY_ROLLER_WORK_STATION',
    TOTE_ULTRARED_EMPTY_RUN: 'app.activity.EMPTY_RUN',
    TOTE_ULTRARED_CHARGE_RUN: 'app.activity.CHARGE_RUN',
    TOTE_ULTRARED_REST_ON_REST_CELL: 'app.activity.TOTE_REST_ON_REST_CELL',
    TOTE_ULTRARED_POOL_CARRY: 'app.activity.TOTE_ULTRARED_POOL_CARRY',

    // 叉车
    FORK_EMPTY_RUN: 'app.activity.EMPTY_RUN',
    FORK_CHARGE_RUN: 'app.activity.CHARGE_RUN',
    FORK_REST_ON_REST_CELL: 'app.activity.REST_UNDER_POD',
    FORK_POD_TO_TARGET: 'app.activity.FORK_POD_TO_TARGET',
  },
  taskStatus: {
    New: 'app.taskStatus.New',
    Executing: 'app.taskStatus.Executing',
    Finished: 'app.taskStatus.Finished',
    Error: 'app.taskStatus.Error',
    Cancel: 'app.taskStatus.Cancel',
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
