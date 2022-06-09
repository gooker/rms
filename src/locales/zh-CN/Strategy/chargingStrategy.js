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
  'app.chargeStrategy.defaultConfig.fetch.fail': '获取默认配置信息失败',
  'app.chargeStrategy.recommendedConfigOfLithiumIron': '锂电推荐配置',

  'app.chargeStrategy.save.success': '保存充电策略成功',
  'app.chargeStrategy.save.failed': '保存充电策略失败',

  // 闲时充电策略
  'app.chargeStrategy.past': '过去',
  'app.chargeStrategy.minute': '分钟',
  'app.chargeStrategy.percentageOfFreeVehicle': '空闲车占比',
  'app.chargeStrategy.idleTimeRangeTip': '允许时间段(默认任何时间段)',
  'app.chargeStrategy.idle.save.success': '闲时策略保存成功',
  'app.chargeStrategy.idle.save.failed': '闲时策略保存失败',

  // 清扫策略
  'cleaninCenter.overtimeskip': '超时跳过',
  'cleaninCenter.normalScopeCode': '指定正常时段路线',
  'cleaninCenter.freeTimeScopeCode': '指定空闲时段路线',
  'cleaninCenter.cleaningperiod': '清扫时段',
  'cleaninCenter.forbidTime': '禁止时段',
  'cleaninCenter.freeTime': '空闲时段',
  'cleaninCenter.cleanAreas.set': '清扫区域设置',
  'cleaninCenter.cleanPriority': '清扫权重',
  'cleaninCenter.onlyCleanlostcode': '只清扫丢码',

  'cleaninCenter.onlyClean.free': '只在空闲时间段清扫',
  'cleaninCenter.designatedarea': '指定区域',
  'cleaninCenter.day': '天',
  'cleaninCenter.inside': '内',
  'cleaninCenter.cleaning': '清扫',
  'cleaninCenter.times': '次',
  'app.common.tableRowCount': '共计 {value} 条记录',
  'cleaninCenter.startTime': '清扫开始时间',
  'cleaninCenter.endTime': '清扫结束时间',
  'cleaninCenter.cleaningtime': '清扫时间',
  'cleaninCenter.status': '清扫状态',
  'cleaninCenter.isSkip': '是否跳过',
  'cleaninCenter.isDropby': '是否顺路清扫',
  'cleaninCenter.fail.reason': '失败原因',

  'cleaninCenter.currentmode': '当前模式',
  'cleaninCenter.targetNum': '目标次数',
  'cleaninCenter.accumulative': '累计周期',
  'cleaninCenter.planCell': '计划点位',
  'cleaningCenter.executing': '正在执行',
  'cleaningCenter.waiting': '待执行',
  'cleaningCenter.complete': '已完成',

  'cleaningCenter.skip.tips': '表示{day}天内跳过{num}次',
  'cleaningCenter.success.tips': '表示{day}天内成功{num}次',
  'cleaningCenter.allot.tips': '分配车辆{value}',
  'cleaningCenter.throwcode.tips':
    ' 表示发生丢码,立刻增加的清扫(优先级按丢码数越多越优先)清扫成功次数越多,优先级越落后',
  'cleaningCenter.data.fail': '获取清扫策略数据失败!',
  'cleaningCenter.history.fetchFailed': '获取清扫记录失败',

  'app.mapRecorder.fail': '获取已激活地图数据失败!',
  'app.operate.fail': '操作失败',
  'cleaningCenter.pleaseSelect': '请选择',
  'cleaningCenter.plan.fetchFailed': '获取清扫计划失败',
  'cleaningCenter.plan.cleanarea': '清扫区域',
  'cleaningCenter.strategy.open': '开启清扫策略成功',
  'cleaningCenter.strategy.closed': '关闭清扫策略成功',
  'cleaningCenter.isCleanMissCode': '丢码清扫',
  'cleaningCenter.mode.Forbid': '禁止',
  'cleaningCenter.cleanAreas.required': '指定区域不能为空',
  'cleaningCenter.cleanAreas.cycleRequired': '清扫次数或清扫周期不能为空',
};
