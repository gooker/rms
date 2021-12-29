export default {
  // 任务出发
  'customTasks.taskTrigger.stateQuery': '状态查询',
  'customTasks.taskTrigger.paused': '已暂停',
  'customTasks.taskTrigger.startTaskTrigger.tip': '确定开始任务吗？',
  'customTasks.taskTrigger.pauseTaskTrigger.tip': '确定暂停任务吗？',
  'customTasks.taskTrigger.endTaskrigger.tip': '确定结束任务吗?',
  'customTasks.taskTrigger.deleteTaskrigger.tip': '确定删除该任务吗?',
  'customTasks.taskTrigger.editVariable': '编辑变量',
  'customTasks.taskTrigger.triggerTasks': '触发任务',
  'customTasks.taskTrigger.variable': '支持变量',
  'customTasks.taskTrigger.randomVariable': '随机',
  'customTasks.taskTrigger.fixedVariable': '固定',
  'customTasks.taskTrigger.time.tip': '请输入时间间隔(s)',
  'customTasks.taskTrigger.totaTimes': '总下发次数',

  // 任务限流
  'customTasks.taskLimit': '任务限流',
  'customTasks.taskLimit.currentlimiting': '限流',
  'customTasks.taskLimit.sourcelimitng': '资源限流',
  'customTasks.taskLimit.tasklimiting': '任务限流',
  'customTasks.taskLimit.num': '限流数量',
  'customTasks.taskLimit.delete.confirm': '确定删除吗?',
  'customTasks.taskLimit.batchUpdateNum': '批量更新限流数',
  'customTasks.taskLimit.updateSelectedNum': '更新选中的限流数量',
  'customTasks.taskLimit.limitTips': '提示：限流数量为空 则不会限流',

  'customTasks.groupBinding.horizontalaxis': '横轴',
  'customTasks.groupBinding.verticalaxis': '纵轴',
  'customTasks.groupBinding.repeat.vertivalaxis': '不能和纵轴重复',
  'customTasks.groupBinding.repeat.horizeontalaxis': '不能和横轴重复',
  'customTasks.groupManage.fetchFailed': '获取分组信息失败',
  'customTasks.map.fetchFailed': '获取地图数据失败',

  // 自定义任务
  'customTasks.table.taskCode': '任务编码',
  'customTasks.table.requestBody': '请求体',
  'customTasks.requesting': '请求中',
  'customTasks.delete.success': '删除任务成功',
  'customTasks.delete.failed': '删除任务失败',
  'customTasks.deleteList.confirm': '确定删除已选择的条目?',
  'customTasks.requestBodyDemo': '请求体示例',
  'customTasks.cannotEdit': '不可更改',
  'customTasks.form.dependencies': '任务依赖',

  // 开始
  'app.customTask.form.robot': '分车',
  'app.customTask.form.AUTO': '自动分车',
  'app.customTask.form.SPECIFY_AGV': '指定小车',
  'app.customTask.form.SPECIFY_GROUP': '指定小车组',

  // 结束
  'app.customTask.form.robotWait': '进入待命状态',
  'app.customTask.form.agvWaitTask': '小车待命',
  'app.customTask.form.agvTaskTypes': '可接任务类型',
  'app.customTask.form.appointResources': '可接资源任务',
  'app.customTask.form.robotAutoCharge': '可自动退出待命去充电',
  'app.customTask.form.backZone': '无任务返回区域',

  // 待命
  'app.customTask.form.recover': '等待恢复命令',
  'app.customTask.form.waitTime': '待命时间',

   // 事件
   'app.customTask.form.payLoad': '消息体',
   'app.customTask.form.topic': '广播主题',

  // 路径和动作
  'app.customTask.form.heavy': '重车',
  'app.customTask.form.empty': '空车',
  'app.customTask.form.pathCode': '地图路线',
  'app.customTask.form.scopeCode': '地图编程',
  'app.customTask.form.isPathWithPod': '车辆状态',
  'app.customTask.form.speed': '速度档位',
  'app.customTask.form.canReCalculatePath': '自动切换路线',
  'app.customTask.form.runAction': '行走动作',
  'app.customTask.form.turnAction': '转弯动作',
  'app.customTask.form.podAngle': '货架方向',
  'app.customTask.form.firstActions': '起点动作',
  'app.customTask.form.afterFirstActions': '第二点位动作',
  'app.customTask.form.beforeLastActions': '倒数第二动作',
  'app.customTask.form.lastActions': '终点动作',
  'app.customTask.form.programCode': '任务编程',
  'app.customTask.form.programCode.no': '不使用任务编程',
  'app.customTask.form.targetArea': '目标区域',
  'app.customTask.form.target': '目标',
  'app.customTask.form.store': '存储点',
  'app.customTask.form.resourceLock': '资源锁',
  'app.customTask.form.resourceType': '资源类型',
  'app.customTask.form.lockTime': '锁定时机',
  'app.customTask.form.unLockTime': '解锁时机',
  'app.customTask.form.beginTaskStart': '任务开始前',
  'app.customTask.form.afterTaskEnd': '任务结束',
  'app.customTask.form.BeginActionStart': '路径动作开始前',
  'app.customTask.form.AfterActionEnd': '路径动作结束',
  'app.customTask.form.noLock': '不锁',
  'app.customTask.form.dontUnLock': '不解锁',
  'app.customTask.form.trayActionProtocol': '托盘动作协议',
  'app.customTask.form.trayLiftProtocol': '顶升协议',
  'app.customTask.form.trayDownProtocol': '下降协议',
  'app.customTask.form.lift': '顶升',
  'app.customTask.form.blindLift': '盲顶',
  'app.customTask.form.down': '下降',
  'app.customTask.form.blindDown': '盲降',
  'app.customTask.form.upAction': '顶升协议',
  'app.customTask.form.downAction': '下降协议',
  'app.customTask.form.isDownOrUp': '升降动作',
  'app.customTask.form.operatorDirection': '操作点',

  // 货架状态
  'app.customTask.form.podStatus': '货架状态',
  'app.customTask.form.generate': '生成',
  'app.customTask.form.disappear': '消失',
  'app.customTask.form.random': '随机',
  'app.customTask.form.generateType': '生成方式',

  // 请求体示例
  'customTasks.example.field': '字段',
  'customTasks.example.default': '默认值',

  // 自定义页面
  'app.customTask.backToList': '返回列表',
  'app.customTask.customTypes': '任务节点',
  'customTasks.button.temporarySave': '暂存',
  'customTasks.button.updateModel': '更新关联信息',

  // 表单
  'customTasks.form.baseInfo': '基础信息',
  'customTasks.form.delete.confirm': '即将删除该节点并清空表单数据, 是否确定?',
  'app.customTask.form.code': '编码',//这些 app.customTask.form 都是固定的
  'app.customTask.form.skip': '跳过',
  'app.customTask.form.specify': '指定',
  'customTasks.form.clear.warn': '该操作会清空当前所有的输入数据, 确定执行吗?',
};
