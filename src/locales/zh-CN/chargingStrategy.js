// 充电策略
export default {
  'app.chargeStrategy.currentStatus': '当前状态',
  'app.chargeStrategy.normal': '标准',
  'app.chargeStrategy.idleHours': '闲时',
  'app.chargeStrategy.idleHoursRules': '闲时策略',
  'app.chargeStrategy.normalCharge': '普通充电',

  'app.chargeStrategy.initialPower': '起始电量',
  'app.chargeStrategy.initialPowerTip': '小车电量低于这个电量值时需要充电',
  'app.chargeStrategy.startingVoltage': '起始电压',
  'app.chargeStrategy.startingVoltageTip': '小车电压低于这个电压值时需要充电',

  'app.chargeStrategy.terminationOfPower': '终止电量',
  'app.chargeStrategy.terminationOfPowerTip': '小车充电时可充到的最高电量',
  'app.chargeStrategy.terminationVoltage': '终止电压',
  'app.chargeStrategy.terminationVoltageTip': '小车充电时可充到的最高电压',

  'app.chargeStrategy.replaceablePower': '可换充电量',
  'app.chargeStrategy.replaceablePowerTip':
    '小车电量达到这个电量值时，可换其他需要充电的小车到充电桩充电',
  'app.chargeStrategy.lowPowerWarning': '低电量报警',
  'app.chargeStrategy.lowPowerWarningTip': '小车电量低于这个电量值时，发报警消息',

  'app.chargeStrategy.fullChargePower': '满充电量',
  'app.chargeStrategy.fullChargePowerTip': '小车执行满充任务时需要达到的电量',
  'app.chargeStrategy.fullChargeVoltage': '满充电压',
  'app.chargeStrategy.fullChargeVoltageTip': '小车执行满充任务时需要达到的电压',

  'app.chargeStrategy.fullCharge': '满充',
  'app.chargeStrategy.receiveTaskEnabled': '可接受任务',
  'app.chargeStrategy.intervalBetween2FullCharges': '两次满充时间间隔',
  'app.chargeStrategy.intervalBetween2FullChargesTip': '小车执行两次满充任务之间的最大间隔时间',
  'app.chargeStrategy.maximumConsecutiveTimesOfNormalCharging': '普通充电最大连续次数',
  'app.chargeStrategy.maximumConsecutiveTimesOfNormalChargingTip':
    '小车最大连续普通充电次数（达到这个连续次数，就需要让小车进行一次满充）',

  'app.chargeStrategy.minimumPower': '最低电量',
  'app.chargeStrategy.minimumPowerTip': '小车可接任务的最低电量',
  'app.chargeStrategy.minimumVoltage': '最低电压',
  'app.chargeStrategy.minimumVoltageTip': '小车可接任务的最低电压',
  'app.chargeStrategy.minimumChargingTime': '最短充电时间',
  'app.chargeStrategy.minimumChargingTimeTip': '小车最短充电时间（至少要充这么久）',

  'app.chargeStrategy.cancelChargeAndReceiveTask': '小车取消充电并开始接任务',
  'app.chargeStrategy.cancelChargerAndReceiveTaskTip': '小车取消充电并开始接任务的最低电量',

  'app.chargeStrategy.defaultConfig': '默认配置',
  'app.chargeStrategy.recommendedConfigOfLithiumIron': '锂电推荐配置',

  'app.chargeStrategy.save.success': '保存充电策略成功',
  'app.chargeStrategy.save.failed': '保存充电策略失败',

  // 闲时充电策略
  'app.chargeStrategy.past': '过去',
  'app.chargeStrategy.minute': '分钟',
  'app.chargeStrategy.percentageOfFreeAgv': '空闲车占比',
  'app.chargeStrategy.idleTimeRangeTip': '允许时间段(默认任何时间段)',
  'app.chargeStrategy.idle.save.success': '闲时策略保存成功',
  'app.chargeStrategy.idle.save.failed': '闲时策略保存失败',
};
