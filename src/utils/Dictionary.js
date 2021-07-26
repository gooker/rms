import { isNull } from './utils';

const DictionaryDataSource = {
  // 小车状态
  agvStatus: {
    Error: 'app.activity.Error',
    Offline: 'app.activity.Offline',
    StandBy: 'app.activity.StandBy',
    Working: 'app.activity.Working',
    Charging: 'app.activity.Charging',
    Connecting: 'app.activity.Connecting',
  },

  // 充电桩状态
  chargerStatus: {
    ERROR: 'app.chargeManger.ERROR',
    OFFLINE: 'app.chargeManger.OFFLINE',
    ASSIGNED: 'app.chargeManger.ASSIGNED',
    CHARGING: 'app.chargeManger.CHARGING',
    AVAILABLE: 'app.chargeManger.AVAILABLE',
    CONNECTED: 'app.chargeManger.CONNECTED',
    CONNECTING: 'app.chargeManger.CONNECTING',
  },

  // 任务状态
  taskStatus: {
    New: 'app.taskStatus.New',
    Executing: 'app.taskStatus.Executing',
    Finished: 'app.taskStatus.Finished',
    Error: 'app.taskStatus.Error',
    Cancel: 'app.taskStatus.Cancel',
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

  // 电池类型
  batteryType: {
    1: 'app.batteryType.enumeration1', //Lithium iron phosphate
    2: 'app.batteryType.enumeration2', //Latent vehicle (lithium ternary)
    3: 'app.batteryType.enumeration3',
    4: 'app.batteryType.enumeration4', //Sorting car (lithium iron phosphate)
    5: 'app.batteryType.enumeration5', //Latent vehicle 1.2t and bin robot (lithium iron phosphate)
  },

  // 任务类型
  agvTaskType: {
    // 潜伏车
    EMPTY_RUN: 'app.taskType.EMPTY_RUN',
    CHARGE_RUN: 'app.taskType.CHARGE_RUN',
    REST_UNDER_POD: 'app.taskType.REST_UNDER_POD',
    CARRY_POD_TO_CELL: 'app.taskType.CARRY_POD_TO_CELL',
    RUN_TO_SAFETY_AREA: 'app.taskType.RUN_TO_SAFETY_AREA',
    CARRY_POD_TO_STATION: 'app.taskType.CARRY_POD_TO_STATION',
    SUPER_CARRY_POD_TO_CELL: 'app.taskType.SUPER_CARRY_POD_TO_CELL',
    HEARVY_CARRY_POD_TO_STORE: 'app.taskType.HEARVY_CARRY_POD_TO_STORE',
    FROCK_CARRY_TO_CELL: 'app.taskType.FROCK_CARRY_TO_CELL',
    ROLLER_CARRY_TO_CELL: 'app.taskType.ROLLER_CARRY_TO_CELL',

    // 料箱
    TOTE_PUT: 'app.taskType.TOTE_PUT',
    TOTE_CARRY: 'app.taskType.TOTE_CARRY',
    TOTE_EMPTY_RUN: 'app.taskType.EMPTY_RUN',
    TOTE_CHARGE_RUN: 'app.taskType.CHARGE_RUN',
    TOTE_ROLLER_PUT: 'app.taskType.TOTE_ROLLER_PUT',
    TOTE_NONE_CARRY: 'app.taskType.TOTE_NONE_CARRY',
    TOTE_STATION_CARRY: 'app.taskType.TOTE_STATION_CARRY',
    TOTE_TO_WORK_STATION: 'app.taskType.CARRY_POD_TO_STATION',
    TOTE_REST_ON_REST_CELL: 'app.taskType.TOTE_REST_ON_REST_CELL',
    TOTE_RUN_TO_SAFETY_AREA: 'app.taskType.TOTE_RUN_TO_SAFETY_AREA',
    TOTE_TO_ROLLER_WORK_STATION: 'app.taskType.TOTE_TO_ROLLER_WORK_STATION',
    TOTE_TO_NONE_ROLLER_WORK_STATION: 'app.taskType.TOTE_TO_NONE_ROLLER_WORK_STATION',
    TOTE_TO_FACTORY_ROLLER_WORK_STATION: 'app.taskType.TOTE_TO_FACTORY_ROLLER_WORK_STATION',
    TOTE_ULTRARED_EMPTY_RUN: 'app.taskType.EMPTY_RUN',
    TOTE_ULTRARED_CHARGE_RUN: 'app.taskType.CHARGE_RUN',
    TOTE_ULTRARED_REST_ON_REST_CELL: 'app.taskType.TOTE_REST_ON_REST_CELL',
    TOTE_ULTRARED_POOL_CARRY: 'app.taskType.TOTE_ULTRARED_POOL_CARRY',

    // 叉车
    FORK_EMPTY_RUN: 'app.taskType.EMPTY_RUN',
    FORK_CHARGE_RUN: 'app.taskType.CHARGE_RUN',
    FORK_REST_ON_REST_CELL: 'app.taskType.REST_UNDER_POD',
    FORK_POD_TO_TARGET: 'app.taskType.FORK_POD_TO_TARGET',
  },

  // 业务颜色
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
