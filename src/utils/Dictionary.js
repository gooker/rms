import { isNull } from './util';

const DictionaryDataSource = {
  // 充电桩方向
  chargerDirection: {
    0: 'app.direction.top',
    1: 'app.direction.right',
    2: 'app.direction.bottom',
    3: 'app.direction.left',
  },

  // 充电桩类型
  chargerType: {
    0: 'app.chargerType.version0',
    1: 'app.chargerType.version1',
    2: 'app.chargerType.version2',
    3: 'app.chargerType.version3',
  },

  // 小车方向
  vehicleDirection: {
    0: 'app.direction.toRight',
    90: 'app.direction.toTop',
    180: 'app.direction.toLeft',
    270: 'app.direction.toBottom',
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
    1: 'batteryType.enumeration1', //Lithium iron phosphate
    2: 'batteryType.enumeration2', //Latent vehicle (lithium ternary)
    3: 'batteryType.enumeration3',
    4: 'batteryType.enumeration4', //Sorting car (lithium iron phosphate)
    5: 'batteryType.enumeration5', //Latent vehicle 1.2t and bin vehicle (lithium iron phosphate)
  },

  // 业务颜色
  color: {
    red: '#f5222d',
    error: '#f5222d',

    yellow: '#FFCA30',
    warning: '#FFCA30',

    orange: '#FF7409',

    blue: '#1890FF',
    green: '#2FC25B',
    purple: '#a356f4',
    pink: '#ce2a7d',
    gray: '#b3b2b2',
    cyan: '#13c2c2',
  },

  // 潜伏料箱状态颜色
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

  // 料箱订单状态
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

  // 报表中心
  reportCenterTable: {
    vehicleId: 'vehicle.id',
    currentVehicleId: 'vehicle.id',
    count: 'app.reportCenter.reportCount',
    createTime: 'app.common.creationTime',
    errorDefinition_level: 'app.fault.level',
    errorCode: 'app.fault.code',
    taskStatus: 'app.task.state',
    type: 'app.task.name',
    vehicleTaskType: 'app.task.name',
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
