export const CellTypeSetting = [
  // 不可走点
  {
    type: 'blockCellIds',
    picture: 'block_cell.png',
    i18n: 'app.cellMap.notGoAway',
    scope: 'routeMap',
    texture: 'block_cell',
  },
  // 存储点
  {
    type: 'storeCellIds',
    picture: 'store_cell.png',
    i18n: 'app.cellMap.storagePoint',
    scope: 'logic',
    texture: 'store_cell',
  },
  // 跟车点
  {
    type: 'followCellIds',
    picture: 'follow_cell.png',
    i18n: 'app.cellMap.carFollowingPoint',
    scope: 'routeMap',
    texture: 'follow_cell',
  },
  // 等待点
  {
    type: 'waitCellIds',
    picture: 'wait_cell.png',
    i18n: 'app.cellMap.waitingPoint',
    scope: 'routeMap',
    texture: 'wait_cell',
  },
  // 接任务点
  {
    type: 'taskCellIds',
    picture: 'get_task.png',
    i18n: 'app.cellMap.getTask',
    scope: 'logic',
    texture: 'get_task',
  },
  // 安全区
  {
    type: 'safeAreaCellIds',
    picture: 'safe_spot.png',
    i18n: 'app.cellMap.safeArea',
    scope: 'logic',
    texture: 'safe_spot',
  },
  // 独立旋转点
  {
    type: 'rotateCellIds',
    picture: 'round.png',
    i18n: 'app.workStationMap.rotationPoint',
    scope: 'logic',
    texture: 'round',
  },
];

export const CostOptions = [
  {
    value: '10',
    label: 'app.mapEditView.green',
    key: '10',
  },
  {
    value: '20',
    label: 'app.mapEditView.blue',
    key: '20',
  },
  {
    value: '100',
    label: 'app.mapEditView.yellow',
    key: '100',
  },
  {
    value: '1000',
    label: 'app.mapEditView.red',
    key: '1000',
  },
];

export const DirectionOption = [
  { value: '0', label: 'app.common.top' },
  { value: '1', label: 'app.common.right' },
  { value: '2', label: 'app.common.bottom' },
  { value: '3', label: 'app.common.left' },
];
