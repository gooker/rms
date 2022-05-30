import { isNull } from './util';

const DictionaryDataSource = {
  // 小车状态
  agvStatus: {
    Error: 'app.agvState.Error',
    Offline: 'app.agvState.Offline',
    StandBy: 'app.agvState.StandBy',
    Working: 'app.agvState.Working',
    Charging: 'app.agvState.Charging',
    Connecting: 'app.agvState.Connecting',
    Waiting: 'app.agvState.Waiting',
    Idle: 'app.agvState.Idle',
  },

  // 充电桩方向
  chargerDirection: {
    0: 'app.direction.top',
    1: 'app.direction.right',
    2: 'app.direction.bottom',
    3: 'app.direction.left',
  },

  chargerStatus: {
    ERROR: 'app.chargeManger.ERROR',
    OFFLINE: 'app.chargeManger.OFFLINE',
    ASSIGNED: 'app.chargeManger.ASSIGNED',
    CHARGING: 'app.chargeManger.CHARGING',
    AVAILABLE: 'app.chargeManger.AVAILABLE',
    CONNECTED: 'app.chargeManger.CONNECTED',
    CONNECTING: 'app.chargeManger.CONNECTING',
  },
  chargerType: {
    0: 'app.chargeManger.version0',
    1: 'app.chargeManger.version1',
    2: 'app.chargeManger.version2',
    3: 'app.chargeManger.version3',
  },

  // 任务状态
  taskStatus: {
    New: 'app.task.state.New',
    Executing: 'app.task.state.Executing',
    Finished: 'app.task.state.Finished',
    Error: 'app.task.state.Error',
    Cancel: 'app.task.state.Cancel',
  },

  // 小车方向
  agvDirection: {
    0: 'app.direction.toTop',
    90: 'app.direction.toRight',
    180: 'app.direction.toBottom',
    270: 'app.direction.toLeft',
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
    5: 'app.batteryType.enumeration5', //Latent vehicle 1.2t and bin vehicle (lithium iron phosphate)
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

  //  报表中心
  reportCenterTable: {
    agvId: 'app.vehicle.id',
    currentRobotId: 'app.vehicle.id',
    count: 'app.reportCenter.reportCount',
    createTime: 'app.common.creationTime',
    errorDefinition_level: 'app.fault.level',
    errorCode: 'app.fault.code',
    taskStatus: 'app.task.state',
    type: 'app.task.type',
    agvTaskType: 'app.task.type',
  },

  // toteOrderStatus
  latentToteOrderStatus: {
    NEW: 'app.activity.TaskNew', // 新建
    SENT: 'latentTote.orderStatus.SENT', // 已发送
    GRABBING: 'latentTote.orderStatus.GRABBING', // 机械臂抓取中
    GRABBING_FINISH: 'latentTote.orderStatus.GRABBING_FINISH', // 机械臂抓取完成
    FINISH: 'app.activity.TaskFinished', //完成
    CANCEL: 'app.task.state.Cancel', //取消
    TALLY_TRANSPORTING: 'latentTote.orderStatus.TALLY_TRANSPORTING', // 理货运输中
    TALLYING: 'latentTote.orderStatus.TALLYING', // 理货中
    TALLIED: 'latentTote.orderStatus.TALLIED', // 理货完成
    PICK_STATION_TRANSPORTING: 'latentTote.orderStatus.PICK_STATION_TRANSPORTING', // 出库运输中
    PICK_STATION_WORKING: 'latentTote.orderStatus.PICK_STATION_WORKING', // 出库中
  },

  latentToteStatusColor: {
    NEW: 'blue',
    SENT: 'cyan',
    GRABBING: 'lime',
    GRABBING_FINISH: 'lime',
    FINISH: 'green',
    CANCEL: '#b3b2b2',
    TALLY_TRANSPORTING: 'orange',
    TALLYING: 'orange',
    TALLIED: 'cyan',
    PICK_STATION_TRANSPORTING: 'yellow',
    PICK_STATION_WORKING: 'yellow',
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
