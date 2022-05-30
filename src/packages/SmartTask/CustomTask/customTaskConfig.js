export const CustomNodeType = {
  BASE: 'BASE',
  START: 'START',
  ACTION: 'ACTION',
  WAIT: 'WAIT',
  PODSTATUS: 'PODSTATUS',
  END: 'END',
};

// 自定义任务: 任务类型 -- 任务数据字段
export const CustomNodeTypeFieldMap = {
  START: 'customStart',
  END: 'customEnd',
  ACTION: 'customActions',
  EVENT: 'customEvents',
  WAIT: 'customWaits',
  PODSTATUS: 'customPodStatus',
};
