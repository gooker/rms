import { TaskPathColor } from '@/config/consts';

export const ActionState = {
  INITIALIZING: 'INITIALIZING', // 表示指令已经发给小车
  RUNNING: 'RUNNING', // 表示小车正在执行动作
  FINISHED: 'FINISHED', // 表示动作已完成
};

// release == true 表示已被锁中
// actionState == FINISHED 表示已完成
export function getTaskNodeColorFlag(item) {
  let flag = 'future';
  if (item.released) {
    if (item.actionState === ActionState.FINISHED) {
      flag = 'passed';
    } else {
      flag = 'locked';
    }
  }
  return flag;
}

export function getTaskNodeColor(item) {
  const flag = getTaskNodeColorFlag(item);
  return TaskPathColor[flag].replace('0x', '#');
}
