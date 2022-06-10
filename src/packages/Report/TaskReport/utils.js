import sortBy from 'lodash/sortBy';
import Enum from './enum';

export const TaskTyps = [
  { label: '所有类型', value: 'ALL' },
  { label: '空跑', value: 'EMPTY_RUN' },
  { label: '充电', value: 'CHARGE_RUN' },
  { label: '回休息区', value: 'REST_UNDER_POD' },
  { label: '搬运货架', value: 'CARRY_POD_TO_CELL' },
  { label: '工作站任务', value: 'CARRY_POD_TO_STATION' },
  { label: '高级搬运任务', value: 'SUPER_CARRY_POD_TO_CELL' },
  { label: '重车回存储区', value: 'HEARVY_CARRY_POD_TO_STORE' },
];

export const getLabelByValue = (value) => {
  const item = TaskTyps.filter((item) => item.value === value);
  if (item.length < 1) {
    return null;
  }
  return item[0].label;
};

export const transformValue = (value) => {
  const result = (value / 1000).toString().match(/^\d+(?:\.\d{0,2})?/);
  if (result) {
    return Number.parseFloat(result[0]);
  } else {
    return 0;
  }
};

export const transformTime = (millisecond = 0) => {
  // expect: xx分xx.xx秒
  if (millisecond === 0) {
    return `0`;
  }
  const totalSeconds = millisecond / 1000;
  if (totalSeconds < 60 && totalSeconds > 0) {
    return `${totalSeconds.toFixed(1)}秒`;
  }
  const seconds = Number.parseInt(totalSeconds); // 剔除毫秒的总秒数
  const milliseconds = (totalSeconds % seconds).toFixed(1); // 剔除出来的毫秒(string)
  const mm = Math.floor(seconds / 60); // 分
  const ss = (seconds % 60) + Number.parseFloat(milliseconds); // 秒 (包含毫秒)
  return `${mm}分${ss}秒`;
};

export const sortTaskType = (array) => {
  const first_step = sortBy(array, (item) => {
    return item.target.length;
  });
  return sortBy(first_step, ['group']);
};

export const sortNumber = (array) => {
  return sortBy(array, (item) => {
    return item.target;
  });
};

export const getFirstSetItem = (set) => {
  const result = set.values().next();
  return result.value;
};

export const clearZeroValue = (list) => {
  return list.filter((item) => item.value > 0);
};

export const getSubTitleKey = (taskType, isBaseHour, targetCells) => {
  const hasTargetCells = targetCells.length > 0;
  let subTitleKey = isBaseHour ? Enum.hourBase : Enum.targetCellBase;
  subTitleKey = taskType === 'ALL' ? Enum.taskTypeBase : subTitleKey;
  subTitleKey = hasTargetCells ? Enum.targetCellBase : subTitleKey;
  return subTitleKey;
};

/**
 * @param {*} isBaseHour 是否是按小时查询
 * @param {*} taskType 任务类型
 * @param {*} response 后台返回的查询数据
 */
export const convertResponseToChartVM = (isBaseHour, taskType, response) => {
  const { detail, overview } = response;
  let tasksCount = [];
  const averageYards = { overview: 0, data: [] },
    averageTimeConsumer = { overview: 0, data: [] },
    averageReleaseTime = { overview: 0, data: [] },
    averageDistance = { overview: 0, data: [] },
    averageTurnSize = { overview: 0, data: [] },
    averageNoChangeSize = { overview: 0, data: [] },
    averageChargerTime = { overview: 0, data: [] },
    averageChargerCapacity = { overview: 0, data: [] },
    averagePodRotateSize = { overview: 0, data: [] },
    averageWaitTime = { overview: 0, data: [] },
    averageQueueTime = { overview: 0, data: [] };
  const newDetail = [];

  if (isBaseHour) {
    // @按小时查询:
    //// 如果 TaskType === 'ALL', 横坐标是任务类型 (横坐标每个点有 N 个柱状图，N为时间段数量)
    //// 如果 TaskType !== 'ALL', 横坐标是目标点 (横坐标每个点有 N 个柱状图，N为时间段数量)

    // @非按小时查询:
    //// 如果 TaskType === 'ALL' 横坐标是任务类型 (结果key: [Task_Type_Key]#2020-08-27T08:00)
    //// 如果 TaskType !== 'ALL' 横坐标是目标点 (结果key: [目标点]#2020-08-27T08:00)
    Object.keys(detail).forEach((key) => {
      const keyItems = key.split('#');
      const targetCellId = taskType === 'ALL' ? getLabelByValue(keyItems[0]) : keyItems[0];
      const startTime = keyItems[1].replace('T', ' ');
      newDetail.push({ ...detail[key], targetCellId, group: `${startTime}` });
    });
  } else {
    if (taskType === 'ALL') {
      // 所有任务类型查询，横坐标是任务类型
      Object.keys(detail).forEach((taskType) => {
        newDetail.push({ ...detail[taskType], targetCellId: getLabelByValue(taskType) });
      });
    } else {
      // 否则横坐标是目标点
      Object.keys(detail).forEach((stopCellId) => {
        newDetail.push({ ...detail[stopCellId], targetCellId: stopCellId + '' });
      });
    }
  }
  const sortFunction = taskType !== 'ALL' ? sortNumber : sortTaskType;
  newDetail.forEach((item) => {
    const xName = item.targetCellId;
    // 平均码数
    averageYards.data.push({ target: xName, value: item.averageYards, group: item.group });
    averageYards.overview = overview.averageYards;

    // 平均耗时
    averageTimeConsumer.data.push({
      target: xName,
      value: transformValue(item.averageTimeConsumer),
      group: item.group,
    });
    averageTimeConsumer.overview = transformTime(overview.averageTimeConsumer);

    // 平均释放时间
    averageReleaseTime.data.push({
      target: xName,
      value: transformValue(item.averageReleaseTime),
      group: item.group,
    });
    averageReleaseTime.overview = transformTime(overview.averageReleaseTime);

    // 平均距离
    averageDistance.data.push({
      target: xName,
      value: transformValue(item.averageDistance),
      group: item.group,
    });
    averageDistance.overview = transformValue(overview.averageDistance);

    // 平均转弯次数
    averageTurnSize.data.push({
      target: xName,
      value: item.averageTurnSize,
      group: item.group,
    });
    averageTurnSize.overview = overview.averageTurnSize;

    // 平均重算次数
    averageNoChangeSize.data.push({
      target: xName,
      value: item.averageNoChangeSize,
      group: item.group,
    });
    averageNoChangeSize.overview = overview.averageNoChangeSize;

    // 平均充电时间
    averageChargerTime.data.push({
      target: xName,
      value: transformValue(item.averageChargerTime),
      group: item.group,
    });
    averageChargerTime.overview = transformTime(overview.averageChargerTime);

    // 平均充电电量
    averageChargerCapacity.data.push({
      target: xName,
      value: item.averageChargerCapacity,
      group: item.group,
    });
    averageChargerCapacity.overview = overview.averageChargerCapacity;

    // 平均货架旋转次数
    averagePodRotateSize.data.push({
      target: xName,
      value: item.averagePodRotateSize,
      group: item.group,
    });
    averagePodRotateSize.overview = overview.averagePodRotateSize;

    // 平均等待时间
    averageWaitTime.data.push({
      target: xName,
      value: transformValue(item.averageWaitTime),
      group: item.group,
    });
    averageWaitTime.overview = transformTime(overview.averageWaitTime);

    // 平均排队时间
    averageQueueTime.data.push({
      target: xName,
      value: transformValue(item.averageQueueTime),
      group: item.group,
    });
    averageQueueTime.overview = transformTime(overview.averageQueueTime);

    // 任务总数
    tasksCount.push({
      target: xName,
      value: item.count,
      group: item.group,
    });
  });

  // 剔除data中 value 为 0 的数据
  averageYards.data = clearZeroValue(averageYards.data);
  averageDistance.data = clearZeroValue(averageDistance.data);
  averageTurnSize.data = clearZeroValue(averageTurnSize.data);
  averageWaitTime.data = clearZeroValue(averageWaitTime.data);
  averageQueueTime.data = clearZeroValue(averageQueueTime.data);
  averageReleaseTime.data = clearZeroValue(averageReleaseTime.data);
  averageChargerTime.data = clearZeroValue(averageChargerTime.data);
  averageTimeConsumer.data = clearZeroValue(averageTimeConsumer.data);
  averageNoChangeSize.data = clearZeroValue(averageNoChangeSize.data);
  averagePodRotateSize.data = clearZeroValue(averagePodRotateSize.data);
  averageChargerCapacity.data = clearZeroValue(averageChargerCapacity.data);
  tasksCount = clearZeroValue(tasksCount);

  // 横坐标排序
  averageYards.data = sortFunction(averageYards.data);
  averageDistance.data = sortFunction(averageDistance.data);
  averageTurnSize.data = sortFunction(averageTurnSize.data);
  averageWaitTime.data = sortFunction(averageWaitTime.data);
  averageQueueTime.data = sortFunction(averageQueueTime.data);
  averageReleaseTime.data = sortFunction(averageReleaseTime.data);
  averageChargerTime.data = sortFunction(averageChargerTime.data);
  averageTimeConsumer.data = sortFunction(averageTimeConsumer.data);
  averageNoChangeSize.data = sortFunction(averageNoChangeSize.data);
  averagePodRotateSize.data = sortFunction(averagePodRotateSize.data);
  averageChargerCapacity.data = sortFunction(averageChargerCapacity.data);
  tasksCount = sortFunction(tasksCount);
  tasksCount = { overview: response.overview.count, data: [...tasksCount] };

  return {
    tasksCount,
    averageYards,
    averageDistance,
    averageTurnSize,
    averageWaitTime,
    averageQueueTime,
    averageReleaseTime,
    averageChargerTime,
    averageTimeConsumer,
    averageNoChangeSize,
    averagePodRotateSize,
    averageChargerCapacity,
  };
};

/**
 * @param {*} isBaseHour 是否是按小时查询
 * @param {*} taskType 任务类型
 * @param {*} selectedRows 参与对比的数据集
 */
export const convertComparisionToChartVM = (isBaseHour, taskType, selectedRows) => {
  let tasksCount = [];
  const averageYards = { overview: 0, data: [] },
    averageTimeConsumer = { overview: 0, data: [] },
    averageReleaseTime = { overview: 0, data: [] },
    averageDistance = { overview: 0, data: [] },
    averageTurnSize = { overview: 0, data: [] },
    averageNoChangeSize = { overview: 0, data: [] },
    averageChargerTime = { overview: 0, data: [] },
    averageChargerCapacity = { overview: 0, data: [] },
    averagePodRotateSize = { overview: 0, data: [] },
    averageWaitTime = { overview: 0, data: [] },
    averageQueueTime = { overview: 0, data: [] };

  const sortFunction = taskType !== 'ALL' && !isBaseHour ? sortNumber : sortTaskType;
  for (const selectedRow of selectedRows) {
    const { detail, overview, name } = selectedRow;

    const newDetail = [];
    if (taskType === 'ALL') {
      // 所有任务类型查询，横坐标是任务类型
      Object.keys(detail).forEach((taskType) => {
        const item = detail[taskType];
        newDetail.push({ ...item, targetCellId: getLabelByValue(taskType), seedName: name });
      });
    } else {
      // 否则横坐标是目标点
      Object.keys(detail).forEach((stopCellId) => {
        const item = detail[stopCellId];
        newDetail.push({ ...item, targetCellId: stopCellId + '', seedName: name });
      });
    }
    newDetail.forEach((item) => {
      const xName = item.targetCellId;
      // 平均码数
      averageYards.data.push({ target: xName, value: item.averageYards, group: item.seedName });
      averageYards.overview = overview.averageYards;

      // 平均耗时
      averageTimeConsumer.data.push({
        target: xName,
        value: transformValue(item.averageTimeConsumer),
        group: item.seedName,
      });
      averageTimeConsumer.overview = transformValue(overview.averageTimeConsumer);

      // 平均释放时间
      averageReleaseTime.data.push({
        target: xName,
        value: transformValue(item.averageReleaseTime),
        group: item.seedName,
      });
      averageReleaseTime.overview = transformValue(overview.averageReleaseTime);

      // 平均距离
      averageDistance.data.push({
        target: xName,
        value: transformValue(item.averageDistance),
        group: item.seedName,
      });
      averageDistance.overview = transformValue(overview.averageDistance);

      // 平均转弯次数
      averageTurnSize.data.push({
        target: xName,
        value: item.averageTurnSize,
        group: item.seedName,
      });
      averageTurnSize.overview = overview.averageTurnSize;

      // 平均重算次数
      averageNoChangeSize.data.push({
        target: xName,
        value: item.averageNoChangeSize,
        group: item.seedName,
      });
      averageNoChangeSize.overview = overview.averageNoChangeSize;

      // 平均充电时间
      averageChargerTime.data.push({
        target: xName,
        value: transformValue(item.averageChargerTime),
        group: item.seedName,
      });
      averageChargerTime.overview = transformValue(overview.averageChargerTime);

      // 平均充电电量
      averageChargerCapacity.data.push({
        target: xName,
        value: item.averageChargerCapacity,
        group: item.seedName,
      });
      averageChargerCapacity.overview = overview.averageChargerCapacity;

      // 平均货架旋转次数
      averagePodRotateSize.data.push({
        target: xName,
        value: item.averagePodRotateSize,
        group: item.seedName,
      });
      averagePodRotateSize.overview = overview.averagePodRotateSize;

      // 平均等待时间
      averageWaitTime.data.push({
        target: xName,
        value: transformValue(item.averageWaitTime),
        group: item.seedName,
      });
      averageWaitTime.overview = transformValue(overview.averageWaitTime);

      // 平均排队时间
      averageQueueTime.data.push({
        target: xName,
        value: transformValue(item.averageQueueTime),
        group: item.seedName,
      });
      averageQueueTime.overview = transformValue(overview.averageQueueTime);

      // 任务总数
      tasksCount.push({
        target: xName,
        value: item.count,
        group: item.seedName,
      });
    });
  }

  // 提出data中 value 为 0 的数据
  averageYards.data = clearZeroValue(averageYards.data);
  averageDistance.data = clearZeroValue(averageDistance.data);
  averageTurnSize.data = clearZeroValue(averageTurnSize.data);
  averageWaitTime.data = clearZeroValue(averageWaitTime.data);
  averageQueueTime.data = clearZeroValue(averageQueueTime.data);
  averageReleaseTime.data = clearZeroValue(averageReleaseTime.data);
  averageChargerTime.data = clearZeroValue(averageChargerTime.data);
  averageTimeConsumer.data = clearZeroValue(averageTimeConsumer.data);
  averageNoChangeSize.data = clearZeroValue(averageNoChangeSize.data);
  averagePodRotateSize.data = clearZeroValue(averagePodRotateSize.data);
  averageChargerCapacity.data = clearZeroValue(averageChargerCapacity.data);
  tasksCount = clearZeroValue(tasksCount);

  // 横坐标排序
  averageYards.data = sortFunction(averageYards.data);
  averageDistance.data = sortFunction(averageDistance.data);
  averageTurnSize.data = sortFunction(averageTurnSize.data);
  averageWaitTime.data = sortFunction(averageWaitTime.data);
  averageQueueTime.data = sortFunction(averageQueueTime.data);
  averageReleaseTime.data = sortFunction(averageReleaseTime.data);
  averageChargerTime.data = sortFunction(averageChargerTime.data);
  averageTimeConsumer.data = sortFunction(averageTimeConsumer.data);
  averageNoChangeSize.data = sortFunction(averageNoChangeSize.data);
  averagePodRotateSize.data = sortFunction(averagePodRotateSize.data);
  averageChargerCapacity.data = sortFunction(averageChargerCapacity.data);
  tasksCount = sortFunction(tasksCount);

  return {
    tasksCount,
    averageYards,
    averageDistance,
    averageTurnSize,
    averageWaitTime,
    averageQueueTime,
    averageReleaseTime,
    averageChargerTime,
    averageTimeConsumer,
    averageNoChangeSize,
    averagePodRotateSize,
    averageChargerCapacity,
  };
};

/**
 * @param {*} isBaseHour 是否是按小时查询
 * @param {*} taskType 任务类型
 * @param {*} selectedRows 参与对比的数据集
 */
export const convertComparisionOverViewToChartVM = (isBaseHour, taskType, selectedRows) => {
  const averageYards = { overview: 0, data: [] },
    averageTimeConsumer = { overview: 0, data: [] },
    averageReleaseTime = { overview: 0, data: [] },
    averageDistance = { overview: 0, data: [] },
    averageTurnSize = { overview: 0, data: [] },
    averageNoChangeSize = { overview: 0, data: [] },
    averageChargerTime = { overview: 0, data: [] },
    averageChargerCapacity = { overview: 0, data: [] },
    averagePodRotateSize = { overview: 0, data: [] },
    averageWaitTime = { overview: 0, data: [] },
    averageQueueTime = { overview: 0, data: [] };

  const sortFunction = taskType !== 'ALL' && !isBaseHour ? sortNumber : sortTaskType;
  for (const selectedRow of selectedRows) {
    const { overview, name } = selectedRow;
    const xName = name;
    // 平均码数
    averageYards.data.push({ target: xName, value: overview.averageYards });
    averageYards.overview = overview.averageYards;

    // 平均耗时
    averageTimeConsumer.data.push({
      target: xName,
      value: transformValue(overview.averageTimeConsumer),
    });
    averageTimeConsumer.overview = transformValue(overview.averageTimeConsumer);

    // 平均释放时间
    averageReleaseTime.data.push({
      target: xName,
      value: transformValue(overview.averageReleaseTime),
    });
    averageReleaseTime.overview = transformValue(overview.averageReleaseTime);

    // 平均距离
    averageDistance.data.push({
      target: xName,
      value: transformValue(overview.averageDistance),
    });
    averageDistance.overview = transformValue(overview.averageDistance);

    // 平均转弯次数
    averageTurnSize.data.push({
      target: xName,
      value: overview.averageTurnSize,
    });
    averageTurnSize.overview = overview.averageTurnSize;

    // 平均重算次数
    averageNoChangeSize.data.push({
      target: xName,
      value: overview.averageNoChangeSize,
    });
    averageNoChangeSize.overview = overview.averageNoChangeSize;

    // 平均充电时间
    averageChargerTime.data.push({
      target: xName,
      value: transformValue(overview.averageChargerTime),
    });
    averageChargerTime.overview = transformValue(overview.averageChargerTime);

    // 平均充电电量
    averageChargerCapacity.data.push({
      target: xName,
      value: overview.averageChargerCapacity,
    });
    averageChargerCapacity.overview = overview.averageChargerCapacity;

    // 平均货架旋转次数
    averagePodRotateSize.data.push({
      target: xName,
      value: overview.averagePodRotateSize,
    });
    averagePodRotateSize.overview = overview.averagePodRotateSize;

    // 平均等待时间
    averageWaitTime.data.push({
      target: xName,
      value: transformValue(overview.averageWaitTime),
    });
    averageWaitTime.overview = transformValue(overview.averageWaitTime);

    // 平均排队时间
    averageQueueTime.data.push({
      target: xName,
      value: transformValue(overview.averageQueueTime),
    });
    averageQueueTime.overview = transformValue(overview.averageQueueTime);
  }

  // 提出data中 value 为 0 的数据
  averageYards.data = clearZeroValue(averageYards.data);
  averageDistance.data = clearZeroValue(averageDistance.data);
  averageTurnSize.data = clearZeroValue(averageTurnSize.data);
  averageWaitTime.data = clearZeroValue(averageWaitTime.data);
  averageQueueTime.data = clearZeroValue(averageQueueTime.data);
  averageReleaseTime.data = clearZeroValue(averageReleaseTime.data);
  averageChargerTime.data = clearZeroValue(averageChargerTime.data);
  averageTimeConsumer.data = clearZeroValue(averageTimeConsumer.data);
  averageNoChangeSize.data = clearZeroValue(averageNoChangeSize.data);
  averagePodRotateSize.data = clearZeroValue(averagePodRotateSize.data);
  averageChargerCapacity.data = clearZeroValue(averageChargerCapacity.data);

  // 横坐标排序
  averageYards.data = sortFunction(averageYards.data);
  averageDistance.data = sortFunction(averageDistance.data);
  averageTurnSize.data = sortFunction(averageTurnSize.data);
  averageWaitTime.data = sortFunction(averageWaitTime.data);
  averageQueueTime.data = sortFunction(averageQueueTime.data);
  averageReleaseTime.data = sortFunction(averageReleaseTime.data);
  averageChargerTime.data = sortFunction(averageChargerTime.data);
  averageTimeConsumer.data = sortFunction(averageTimeConsumer.data);
  averageNoChangeSize.data = sortFunction(averageNoChangeSize.data);
  averagePodRotateSize.data = sortFunction(averagePodRotateSize.data);
  averageChargerCapacity.data = sortFunction(averageChargerCapacity.data);

  return {
    averageYards,
    averageDistance,
    averageTurnSize,
    averageWaitTime,
    averageQueueTime,
    averageReleaseTime,
    averageChargerTime,
    averageTimeConsumer,
    averageNoChangeSize,
    averagePodRotateSize,
    averageChargerCapacity,
  };
};
