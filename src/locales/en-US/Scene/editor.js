export default {
  'editor.addScope': '添加作用域',
  'editor.locate': '点位定位',
  'editor.map.active': '激活地图',
  'editor.map.active.warn': '无法取消激活',
  'editor.map.upload': '导入地图',
  'editor.map.upload.mapIncomplete': '地图数据不完整',
  'editor.map.download': '下载地图',
  'editor.selectMap.required': '请先选择地图',
  'editor.saveMap.contentLoss': '是否保存当前修改的地图？若不保存, 则所有的修改会丢失',
  'editor.button.notSaveMap': '不保存',
  'editor.button.record': '保存记录',
  'editor.deleteMapConfirm': '是否确定删除该地图?',
  'editor.updateHistory': '地图更新记录',
  'editor.editorVersion': '编辑器版本',
  'editor.mapVersion': '地图版本',
  'editor.programing': '编程信息',
  'editor.cell.notExist': '点位不存在',
  'editor.logic.rangeStart': '范围起始值',
  'editor.logic.rangeEnd': '范围结束值',
  'editor.navigationType': '导航类型',
  'editor.navigationType.none': '无',

  // 操作提示
  'editor.tip.storageWithoutBlock': '{value} 已经是存储点, 不可设置为Block点',
  'editor.tip.blockWithoutOthers': '{value} 点已经相关作用域是Block点, 不可设置为其它任意点位类型',
  'editor.tip.noLogicStorage': '当前逻辑区没有存储区',
  'editor.tip.requireTypeForDeleting': '请选择需要删除的导航点类型',
  'editor.message.codeNotExit': '点位不存在',
  'editor.message.codeNotInRange': '点位ID不在该逻辑区范围',
  'editor.code.duplicate': '编码已存在',
  'editor.merge.requireLand': '请切换到物理坐标模式',

  // 施工图
  'editor.constructionDrawing.export': '导出施工图',
  'editor.constructionDrawing.paperSize': '纸张尺寸',
  'editor.constructionDrawing.paperOrientation': '纸张方向',
  'editor.constructionDrawing.vertical': '纵向',
  'editor.constructionDrawing.horizontal': '横向',
  'editor.constructionDrawing.showBlockedCells': '包含不可走点',
  'editor.constructionDrawing.exportCellData': '导出点位数据',
  'editor.constructionDrawing.showCellCoordinates': '显示点位坐标',
  'editor.constructionDrawing.cellExport': '点位导出',
  'editor.constructionDrawing.pngExport': 'PNG导出',
  'editor.constructionDrawing.pdfExport': 'PDF导出',
  'editor.constructionDrawing.standardCell': '标准点',
  'editor.constructionDrawing.mapName': '地图名称',
  'editor.constructionDrawing.unit': '单位',
  'editor.constructionDrawing.createUser': '生成用户',
  'editor.constructionDrawing.cellNumber': '点位个数',

  // 两侧工具栏
  'editor.tools.insertPicture': '插入图片',
  'editor.tools.insertFont': '插入文字',
  'editor.tools.insertRect': '绘制矩形',
  'editor.tools.insertCircle': '绘制圆形',
  'editor.tools.useTemplate': '引用模板',
  'editor.tools.createTemplate': '创建模板',
  'editor.tools.history': '操作历史',
  'editor.tools.selections': '已选择元素',
  'editor.tools.layer': '图层',

  // 点位操作
  'editor.cell.code': '地址码',
  'editor.cell.abscissa': '导航横坐标',
  'editor.cell.ordinate': '导航纵坐标',
  'editor.cell.addNavigation': '添加导航点',
  'editor.cell.batchAdd': '批量添加',
  'editor.cell.delete': '删除点位',
  'editor.cell.move': '移动点位',
  'editor.cell.bases': '基准点位',
  'editor.cell.space': '码间距',
  'editor.cell.adjustSpace': '调整码间距',
  'editor.cell.merge': '点位融合',
  'editor.cell.horizontalSelection': '横向选择',
  'editor.cell.verticalSelection': '纵向选择',
  'editor.cell.batchSelection': '批量选择',

  // 批量新增点位
  'editor.batchAddCell.addWay': '添加方式',
  'editor.batchAddCell.addWay.absolute': '绝对值',
  'editor.batchAddCell.addWay.offset': '偏移',
  'editor.batchAddCell.firstCode': '起始编码',
  'editor.batchAddCell.firstXCoordinator': '起始横坐标',
  'editor.batchAddCell.firstYCoordinator': '起始纵坐标',
  'editor.batchAddCell.horizontalSpace': '横向码间距',
  'editor.batchAddCell.verticalSpace': '纵向码间距',
  'editor.batchAddCell.rows': '行数',
  'editor.batchAddCell.columns': '列数',
  'editor.batchAddCell.offsetsNumber': '偏移个数',
  'editor.moveCell.offsetDistance': '偏移距离',
  'editor.adjustSpace.baseLine': '调整基线',

  // 点位类型  @有重复
  'editor.cellType': '点位类型',
  'editor.cellType.forbid': '不可走点',
  'editor.cellType.storage': '存储点',
  'editor.cellType.follow': '跟车点',
  'editor.cellType.waiting': '等待点',
  'editor.cellType.getTask': '接任务点',
  'editor.cellType.safe': '安全区',
  'editor.cellType.rotation': '旋转点',
  'editor.cellType.rotationGroup': '旋转点组',
  'editor.cellType.stop': '停止点',
  'editor.cellType.scan': '扫描点',
  'editor.cellType.buffer': '缓冲点',
  'editor.cellType.bifurcation': '分叉点',
  'editor.cellType.charging': '充电点',
  'editor.cellType.entrance': '入口点',
  'editor.cellType.exit': '出口点',
  'editor.cellType.rest': '休息点',

  // 线条
  'editor.cost.lowPriority': '低优先级',
  'editor.cost.normalPriority': '一般优先级',
  'editor.cost.highPriority': '高优先级',
  'editor.cost.topPriority': '最高优先级',
  'editor.cost.noPass': '不可走',
  'editor.cost.straightLineType': '直线',
  'editor.cost.curveType': '曲线',
  'editor.cost.delete': '删除箭头',

  // 显示
  'editor.view.mapViewMode': '模式切换',
  'editor.view.mapViewMode.standard': '标准',
  'editor.view.mapViewMode.scaled': '大图',
  'editor.view.hideBlock': '隐藏不可走点',
  'editor.view.coordinateDisplay': '坐标显示',
  'editor.view.backImgDisplay': '背景显示',
  'editor.view.cellsLineDisplay': '线条显示',
  'editor.view.priorityDisplay': '箭头显示',
  'editor.view.directionShown': '方向显示',
  'editor.view.showOnlyRelevantPoints': '仅显示相关点',

  // 功能
  'editor.config.distance': '距离',
  'editor.station.icon': '图标',
  'editor.station.icon.width': '图标宽度',
  'editor.station.icon.height': '图标高度',
  'editor.station.icon.angle': '图标角度',
  'editor.delivery': '投递点',
  'editor.delivery.basket': '投递框',
  'editor.delivery.baseCell': '基准点',
  'editor.delivery.speed': '投递速度',
  'editor.delivery.distance': '投递距离',
  'editor.delivery.aligned.required': '请选择两个对齐的点位',
  'editor.delivery.different.required': '请选择两个不同的点位',
  'editor.intersection.multiDirection': '多向设置',
  'editor.intersection.isTrafficCell': '交通管控',
  'editor.elevator.location': '电梯点',
  'editor.elevator.singleDoor': '单门',
  'editor.tunnel.giveWay': '避让方向',

  // 急停区
  'editor.emergency.mode': '模式',
  'editor.emergency.VehiclePathFinished': '完成下发路径',
  'editor.emergency.NearestQRCode': '紧急停在最近二维码 ',
  'editor.emergency.ImmediateStop': '立即停止',
  'editor.emergency.LockPath': '暂停锁格',
  'editor.emergency.group': '组别',
  'editor.emergency.shape': '形状',
  'editor.emergency.shape.rect': '矩形',
  'editor.emergency.shape.circle': '圆形',
  'editor.emergency.tip': '请在地图区域按住并拖动完成区域框选',

  // 添加地图标记
  'editor.zone.creation': '创建区域',
  'editor.label.creation': '创建标记信息',
  'editor.label.required': '请输入标签内容',

  // 地图编程
  'editor.program.SYSTEM': '系统动作',
  'editor.program.VEHICLE': '车辆动作',
  'editor.program.DEVICE': '设备动作',
  'editor.program.relation': '线条',
  'editor.program.relation.BEGIN': '起点',
  'editor.program.relation.ONROAD': '行驶中',
  'editor.program.relation.END': '终点',

  // 创建默认线条
  'editor.defaultRoute.title': '创建默认路线',
  'editor.defaultRoute.warn': '该操作可能会覆盖已存在的路线, 是否继续执行?',

  // 其他
  'editor.button.swap': '交换',
};
