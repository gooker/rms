export default {
  'menu.home': '首页',

  // SSO
  'menu.userManager': '用户管理',
  'menu.sectionManger': '区域管理',
  'menu.roleManager': '角色',
  'menu.userLoginHistory': '登录历史',
  'menu.accountCenter': '个人中心',
  'menu.authorizationCenter': '授权中心',
  'menu.environmentManger': '自定义环境',
  'menu.customConfiguration': '定制化配置',
  'menu.operationLog': '操作日志',
  'menu.notificationCenter': '通知',
  'menu.notificationCenter.broadcast': '广播频道',
  'menu.notificationCenter.subscription': '频道订阅',
  'menu.notificationCenter.alertCenter': '告警中心',

  // 载具
  'menu.container': '载具',
  'menu.container.customType': '载具类型',
  'menu.container.management': '载具管理',
  'menu.container.group': '载具分组',
  'menu.container.circulation': '载具流转记录',

  // 储位
  'menu.storage': '储位',
  'menu.storage.tote': '料箱货架储位',
  'menu.storage.latentTote': '潜伏料箱货架储位',
  'menu.storage.liftContainer': '顶升式载具储位',
  'menu.storage.group': '储位分组',
  'menu.storage.delivery': '投递口',

  // 车辆
  'menu.agv': '车辆',
  'menu.agv.customType': '车辆类型',
  'menu.agv.registration': '车辆注册',
  'menu.agv.list': '车辆列表',
  'menu.agv.faultManagement': '车辆故障查询',
  'menu.agv.realTime': '车辆详情',
  'menu.agv.adapter': '车辆适配器',
  'menu.agv.customIndustrial': '自定义工装',
  'menu.agv.OTA': 'OTA',

  // 充电桩
  'menu.charger': '充电桩',
  'menu.charger.customType': '充电桩类型',
  'menu.charger.registration': '充电桩注册',
  'menu.charger.list': '充电桩列表',
  'menu.charger.adapter': '充电桩适配器',
  'menu.charger.faultManagement': '充电桩故障查询',

  // 设备
  'menu.equipment': '设备',
  'menu.equipment.customType': '设备类型',
  'menu.equipment.registration': '设备注册',
  'menu.equipment.list': '设备列表',
  'menu.equipment.adapter': '设备适配器',
  'menu.equipment.faultManagement': '故障查询',

  // 系统集成
  'menu.integration': '系统集成',
  'menu.integration.webHook': 'Webhook',
  'menu.integration.logManagement': '日志查询',

  // 资源锁
  'menu.resourceLock': '资源锁',
  'menu.resourceLock.targetLock': '目标锁',
  'menu.resourceLock.agvLock': '车辆锁',
  'menu.resourceLock.stationLock': '站点锁',
  'menu.resourceLock.containerLock': '载具锁',
  'menu.resourceLock.storageLock': '储位锁',
  'menu.resourceBind': '资源绑定',

  // 智能任务
  'menu.customTask': '自定义任务',
  'menu.taskRouteBind': '任务路线绑定',
  'menu.trigger': '触发器',
  'menu.limitEqualizer': '限流均衡器',
  'menu.customOrderPool': '自定义订单池',
  'menu.taskDependency': '任务依赖',

  // 无人搬运
  'menu.carryTaskPool': '订单池',
  'menu.carryTaskManagement': '任务查询',

  // 场景
  'menu.map': '地图',
  'menu.map.editor': '地图编辑',
  'menu.map.monitor': '地图监控',
  'menu.map.recorder': '地图回放',
  'menu.customDashboard': '自定义大屏',

  // 料箱存取 && 潜伏货架存取
  'menu.task': '任务',
  'menu.task.toteTaskPool': '料箱池订单',
  'menu.task.waitingQueue': '等待队列',
  'menu.task.executingQueue': '执行队列',
  'menu.task.taskManagement': '任务查询',
  'menu.task.systemParameters': '参数配置',

  // 柔性分拣
  'menu.sortTaskQueue': '任务队列',
  'menu.sortExecutingTask': '执行任务',
  'menu.sortTaskManagement': '任务查询',

  // 清扫
  'menu.cleaningStrategy': '清扫策略',
  'menu.cleaningPlan': '清扫计划',
  'menu.cleaningRecord': '清扫记录',

  // 策略配置
  'menu.strategy': '策略',
  'menu.strategy.chargingStrategy': '充电策略',
  'menu.strategy.speedStrategy': '速度策略',
  'menu.strategy.parkingStrategy': '停车策略',
  'menu.systemConfig': '系统配置',
  'menu.systemConfig.parameters': '参数配置',
  'menu.systemConfig.requestor': '接口请求库',
  'menu.systemConfig.richEditor': '富文本编辑',
  'menu.systemConfig.timeZone': '系统时区',
  'menu.systemConfig.i18n': '国际化',

  // 报表数据
  'menu.healthReport': '健康报表',
  'menu.healthReport.agv': '小车健康',
  'menu.healthReport.network': '网络健康',
  'menu.healthReport.qrcode': '二维码健康',
  'menu.healthReport.qrcode.ground': '地面',
  'menu.healthReport.qrcode.latentPod': '潜伏货架',
  'menu.healthReport.qrcode.tote': '料箱',
  'menu.healthReport.chargerHealth': '充电桩健康',
  'menu.healthReport.automationHealth': '自动化设备健康',
  'menu.loadReport': '负载报表',
  'menu.loadReport.agvLoad': '小车负载',
  'menu.loadReport.taskLoad': '任务负载',
  'menu.loadReport.containerLoad': '载具负载',
  'menu.loadReport.chargerLoad': '充电桩负载',
  'menu.sourceDownload': '源数据下载',
  'menu.customReport': '自定义报表',
  'menu.taskReport': '任务报表',
  'menu.stationReport': '站点报表',
  'menu.waitingReport': '空等报表',
  'menu.flowReport': '流量报表',

  // 潜伏料箱
  'menu.latentToteTaskManagement': '任务管理',
  'menu.mockTask': '模拟任务',
  'menu.scoringAlgorithm': '打分算法',
  'menu.pod': '货架',
  'menu.pod.podManagement': '货架管理',
};
