export default {
  // **********  任务触发器 ********** //
  'taskTrigger.stateQuery': '状态查询',
  'taskTrigger.paused': '已暂停',
  'taskTrigger.startTaskTrigger.tip': '是否确定开始任务?',
  'taskTrigger.pauseTaskTrigger.tip': '是否确定暂停任务?',
  'taskTrigger.endTaskrigger.tip': '确定结束任务吗?',
  'taskTrigger.deleteTaskrigger.tip': '确定删除该任务吗?',
  'taskTrigger.editVariable': '编辑变量',
  'taskTrigger.triggerTasks': '触发任务',
  'taskTrigger.variable': '支持变量',
  'taskTrigger.randomVariable': '随机',
  'taskTrigger.fixedVariable': '固定',
  'taskTrigger.time.tip': '请输入时间间隔(s)',
  'taskTrigger.totaTimes': '总下发次数',

  // **********  均衡限流器 ********** //
  'taskLimit.currentLimiting': '限流',
  'taskLimit.resourceLimiting': '资源限流',
  'taskLimit.limiting': '任务限流',
  'taskLimit.quantity': '限流数量',
  'taskLimit.batchUpdateQuantity': '批量更新限流数',
  'taskLimit.updateSelectedNum': '更新选中的限流数量',
  'taskLimit.limitTips': '提示: 若限流数量为空 则不会限流',

  // **********  自定义任务 ********** //
  'customTasks.example.field': '字段',
  'customTasks.example.default': '默认值',
  'customTask.backToList': '返回列表',
  'customTask.customTypes': '任务节点',
  'customTasks.button.updateModel': '更新关联信息',
  'customTasks.form.delete.confirm': '即将删除该节点并清空表单数据, 是否确定?',
  'customTask.form.skip': '跳过',
  'customTask.form.specify': '指定',
  'customTasks.form.clear.warn': '该操作会清空当前所有的输入数据, 确定执行吗?',
  'customTasks.table.requestBody': '请求体',
  'customTasks.requesting': '请求中',
  'customTasks.requestBodyDemo': '请求体示例',
  'customTasks.cannotEdit': '不可更改',
  'customTask.form.invalid': '表单数据错误',
  'customTasks.form.useVariable': '使用变量',

  // 任务节点名称
  'customTask.type.BASE': '基础信息',
  'customTask.type.START': '任务开始',
  'customTask.type.ACTION': '子任务',
  'customTask.type.WAIT': '待命',
  'customTask.type.PODSTATUS': '载具模拟',
  'customTask.type.END': '任务结束',

  // 开始
  'customTask.form.robot': '分车',
  'customTask.form.NO_SPECIFY': '自动分车',
  'customTask.form.SPECIFY_AGV': '指定小车',
  'customTask.form.SPECIFY_GROUP': '指定小车组',
  'customTask.form.limit': '约束',
  'customTask.form.limit.podWithStandbyAgv': '接任务约束: 要求的载具ID必须有待命车辆持有',

  // 结束
  'customTask.form.agvWaitTask': '小车待命',
  'customTask.form.agvTaskTypes': '可接任务类型',
  'customTask.form.appointResources': '可接资源任务',
  'customTask.form.robotAutoCharge': '可自动退出待命去充电',
  'customTask.form.backZone': '自动找停车点',
  'customTask.form.heavyBackZone': '载具自动放回储位',
  'customTask.form.robotNeedCharge': '自动充电',

  // 子任务
  'customTask.form.target': '目标',
  'customTask.form.pathCode': '路线区',
  'customTask.form.pathStrategy': '路线策略',
  'customTask.form.keyPointActionConfig': '关键点动作配置 ',

  'customTask.form.heavy': '重车',
  'customTask.form.empty': '空车',
  'customTask.form.isPathWithPod': '车辆状态',
  'customTask.form.speed': '行驶速度',
  'customTask.form.canReCalculatePath': '自动切换路线',
  'customTask.form.runAction': '行走动作',
  'customTask.form.turnAction': '转弯动作',
  'customTask.form.podAngle': '载具方向',
  'customTask.form.firstActions': '起点动作',
  'customTask.form.afterFirstActions': '第二点位动作',
  'customTask.form.beforeLastActions': '倒数第二动作',
  'customTask.form.lastActions': '终点动作',
  'customTask.form.programCode': '任务编程',
  'customTask.form.waitTaskCell': '是否去接任务点',

  //// 资源锁 ////
  'customTask.lock.resourceLock': '资源锁',
  'customTask.lock.resourceType': '资源类型',
  'customTask.lock.STORE': '存储点',
  'customTask.lock.TARGET': '目标',
  'customTask.lock.LOCK': '锁定时机',
  'customTask.lock.LOCK.NO': '不锁',
  'customTask.lock.UNLOCK': '解锁时机',
  'customTask.lock.UNLOCK.NO': '不解锁',
  'customTask.lock.BeginTaskStart': '任务开始前',
  'customTask.lock.BeginActionStart': '路径动作开始前',
  'customTask.lock.AfterTaskEnd': '任务结束',
  'customTask.lock.AfterActionEnd': '路径动作结束',
  //// 资源锁 ////  end

  'customTask.form.trayActionProtocol': '托盘动作协议',
  'customTask.form.trayLiftProtocol': '顶升协议',
  'customTask.form.trayDownProtocol': '下降协议',
  'customTask.form.lift': '顶升',
  'customTask.form.blindLift': '盲顶',
  'customTask.form.down': '下降',
  'customTask.form.blindDown': '盲降',
  'customTask.form.upAction': '顶升协议',
  'customTask.form.downAction': '下降协议',
  'customTask.form.operatorDirection': '操作者方向',

  // 待命子任务
  'customTask.form.waitTime': '待命时长',

  // 载具模拟
  'customTask.form.podStatus': '载具状态',
  'customTask.form.generate': '生成',
  'customTask.form.disappear': '消失',
  'customTask.form.random': '随机',
  'customTask.form.generateType': '生成方式',

  // 事件
  'customTask.form.payLoad': '消息体',
  'customTask.form.topic': '广播主题',

  // **********  分组管理 ********** //
  'groupManage.management': '分组配置',
  'groupManage.detail': '分组配置信息',
  'groupManage.key': '唯一key',
  'groupManage.key.duplicate': '唯一key不能重复',
  'groupManage.name.duplicate': '组名不能重复',
  'groupManage.fetchFailed': '获取分组信息失败',
  'groupManage.batchUpdate': '批量更新',
  'groupManage.updateSelectedPriority': '更新选中的优先级',
  'groupManage.button.deleteGroup': '清空此分组',
  'groupManage.tip.deleteGroupAll': '确定删除此分组全部记录吗？',
};
