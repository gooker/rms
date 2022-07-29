export default {
  // 模块名称
  'app.module': '应用',
  'app.module.Map': '地图', //Ma
  'app.module.ResourceManage': '资源', //Re
  'app.module.SmartTask': '任务', //Ta
  'app.module.Report': '报表', //Rp
  'app.module.Configuration': '配置', //Cf
  'app.module.DevOps': '运维', //Op
  'app.module.SSO': '用户', //Ur

  // 模块描述
  'app.module.Map.desc': '地图工具',
  'app.module.ResourceManage.desc': '资源管理',
  'app.module.SmartTask.desc': '任务管理',
  'app.module.Report.desc': '报表管理',
  'app.module.Configuration.desc': '系统配置',
  'app.module.DevOps.desc': '运维工具',
  'app.module.SSO.desc': '用户管理',

  // 'app.module.LatentPod': '潜伏货架存取',
  // 'app.module.LatentTote': '潜伏料箱存取',
  // 'app.module.ForkLift': '叉车存取',
  // 'app.module.Tote': '料箱存取',
  // 'app.module.FlexibleSorting': '柔性分拣',
  // 'app.module.Cleaning': '清扫',
  // 'app.module.VehicleManned': '载人车',
  // 'app.module.Customized': '定制',
  // 'app.module.Carry': '无人搬运',

  // 任务相关
  'menu.home': '首页',
  'menu.waitingQueue': '等待队列',
  'menu.executingQueue': '执行队列',

  // DevOps
  'menu.systemLogWarehouse': '系统日志',
  'menu.operationLog': '操作日志',
  'menu.alertCenter': '告警中心',
  'menu.pda': '虚拟PDA',
  'menu.upgradeOnline': '在线升级',
  'menu.performanceMonitoring': '性能监控',
  'menu.feedback': '问题反馈',
  'menu.utilBox': '实用工具',
  'menu.db': '数据库操作',

  // SSO
  'menu.userManager': '用户管理',
  'menu.sectionManger': '区域管理',
  'menu.roleManager': '角色',
  'menu.userLoginHistory': '登录历史',
  'menu.accountCenter': '个人中心',
  'menu.environmentManger': '自定义环境',
  'menu.channel': '频道',
  'menu.channel.broadcastChannel': '广播频道',
  'menu.channel.channelSubscription': '频道订阅',

  // 载具
  'menu.load': '载具',
  'menu.load.customSpecification': '载具规格',
  'menu.load.management': '载具列表',
  'menu.load.circulation': '载具流转记录',

  // 储位
  'menu.storage': '储位',
  'menu.storage.customType': '储位类型',
  'menu.storage.management': '储位列表',

  // 车辆
  'menu.vehicle': '车辆',
  'menu.vehicle.customType': '车辆类型',
  'menu.vehicle.list': '车辆列表',
  'menu.vehicle.faultManagement': '车辆故障查询',
  'menu.vehicle.faultDefinition': '车辆故障定义',
  'menu.vehicle.realTime': '车辆详情',
  'menu.vehicle.vehicleLog': '车辆日志',
  'menu.vehicle.vehicleUpgrade': '车辆固件升级',
  'menu.vehicle.OTA': 'OTA',

  // 充电桩
  'menu.charger': '充电桩',
  'menu.charger.customType': '充电桩类型',
  'menu.charger.list': '充电桩列表',
  'menu.charger.faultManagement': '充电桩故障查询',

  // 设备
  'menu.equipment': '设备',
  'menu.equipment.customType': '设备类型',
  'menu.equipment.list': '设备列表',
  'menu.equipment.faultManagement': '设备故障查询',

  // 资源锁
  'menu.resourceLock': '资源锁',
  'menu.resourceLock.targetLock': '目标锁',
  'menu.resourceLock.vehicleLock': '车辆锁',
  'menu.resourceLock.stationLock': '站点锁',
  'menu.resourceLock.containerLock': '载具锁',
  'menu.resourceLock.storageLock': '储位锁',
  'menu.resourceGroupMapping': '资源分组绑定',

  // 任务
  'menu.standardTaskPool': '任务池',
  'menu.taskHistory': '历史任务',
  'menu.customTask': '自定义任务',
  'menu.quickTask': '快捷任务',
  'menu.limitEqualizer': '限流均衡器',
  'menu.trigger': '触发器',
  'menu.taskRouteBind': '任务路线绑定',
  'menu.taskDependency': '任务依赖',
  'menu.customOrderPool': '自定义排程池',

  // 无人搬运
  'menu.carryTaskPool': '任务排程池',
  'menu.carryTaskManagement': '任务查询',

  // 场景
  'menu.editor': '地图编辑',
  'menu.monitor': '地图监控',
  'menu.recorder': '地图回放',
  'menu.customDashboard': '自定义大屏',

  // 料箱存取 && 潜伏货架存取
  'menu.toteTaskPool': '料箱任务排程池',

  // 柔性分拣
  'menu.sortTaskQueue': '任务队列',
  'menu.sortExecutingTask': '执行任务',
  'menu.sortTaskManagement': '任务查询',

  // 清扫
  'menu.cleaningStrategy': '清扫策略',
  'menu.cleaningPlan': '清扫计划',
  'menu.cleaningRecord': '清扫记录',

  // 配置
  'menu.authorizationCenter': '授权中心',
  'menu.strategy': '策略',
  'menu.strategy.chargingStrategy': '充电策略',
  'menu.systemConfig': '系统配置',
  'menu.systemConfig.oem': 'OEM',
  'menu.systemConfig.customMenuManager': '自定义菜单',
  'menu.systemConfig.parameters': '参数配置',
  'menu.systemConfig.requestor': '接口请求库',
  'menu.systemConfig.richEditor': '富文本编辑',
  'menu.systemConfig.timeZone': '系统时区',
  'menu.systemConfig.i18n': '国际化',
  'menu.integration': '系统集成',
  'menu.integration.webHook': 'Webhook',

  // 报表数据
  'menu.healthReport': '健康报表',
  'menu.healthReport.vehicle': '小车健康',
  'menu.healthReport.network': '网络健康',
  'menu.healthReport.qrcode': '二维码健康',
  'menu.healthReport.qrcode.ground': '地面',
  'menu.healthReport.qrcode.latentPod': '潜伏货架',
  'menu.healthReport.qrcode.tote': '料箱',
  'menu.healthReport.chargerHealth': '充电桩健康',
  'menu.healthReport.automationHealth': '自动化设备健康',
  'menu.loadReport': '负载报表',
  'menu.loadReport.vehicleLoad': '小车负载',
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
  'menu.pod': '货架',
  'menu.pod.podManagement': '货架管理',
  'menu.scoringAlgorithm': '打分算法',
  'menu.latentToteStationList': '工作站列表',
};
