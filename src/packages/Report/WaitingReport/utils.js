import sortBy from 'lodash/sortBy';
import { transformValue, clearZeroValue } from '../TaskReport/utils';

const Template = {
  allWaitTime: 0,
  mixWaitTime: 0,
  maxWaitTime: 0,
  secondWaitTime: 0,
  waitSize: 0,
};

export const sortNumber = array => {
  const first_step = sortBy(array, item => {
    return item.target;
  });
  return sortBy(first_step, ['group']);
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

export const convertWaitingToChartVM = (isBaseHour, detail, viewMode = 'detail') => {
  const averageWaitTime = { overview: 0, data: [] }, // 平均空等时间
    allWaitTime = { overview: 0, data: [] }, // 总的空等时间
    mixWaitTime = { overview: 0, data: [] }, // 最短空等时间
    maxWaitTime = { overview: 0, data: [] }, // 最长空等时间
    secondWaitTime = { overview: 0, data: [] }; // 次长空等时间

  const newDetail = [];
  if (viewMode === 'detail') {
    Object.keys(detail).forEach(key => {
      const keyItems = key.split('#');
      const targetCellId = keyItems[0];
      const startTime = keyItems[1].replace('T', ' ');
      newDetail.push({ ...detail[key], targetCellId, group: `${startTime}` });
    });
  } else {
    // Generate Overview
    const overview = {};
    const targetCells = new Set();
    // 首先去重
    Object.keys(detail).forEach(key => {
      const targetCellId = key.split('#')[0];
      targetCells.add(targetCellId);
    });
    // 根据目标点创建初始化数据
    targetCells.forEach(targetCellId => {
      overview[targetCellId] = { ...Template };
    });
    // 填充数据
    const detailKeys = Object.keys(detail);
    detailKeys.forEach(detailKey => {
      const targetCellId = detailKey.split('#')[0];
      const overviewValue = overview[targetCellId];
      const detailValue = detail[detailKey];
      // 总的空等时间
      overviewValue.allWaitTime = overviewValue.allWaitTime + detailValue.allWaitTime;
      // 等待次数
      overviewValue.waitSize = overviewValue.waitSize + detailValue.waitSize;
      // 最短空等时间
      if (overviewValue.mixWaitTime === 0) {
        overviewValue.mixWaitTime = detailValue.mixWaitTime;
      } else if (overviewValue.mixWaitTime > detailValue.mixWaitTime) {
        overviewValue.mixWaitTime = detailValue.mixWaitTime;
      }
      // 最长空等时间
      if (overviewValue.maxWaitTime < detailValue.maxWaitTime) {
        overviewValue.maxWaitTime = detailValue.maxWaitTime;
      }
      // 次长空等时间
      if (overviewValue.secondWaitTime < detailValue.secondWaitTime) {
        overviewValue.secondWaitTime = detailValue.secondWaitTime;
      }
    });

    // 转化数据使其可被接下来的流程处理
    Object.keys(overview).forEach(targetCellId => {
      newDetail.push({ ...overview[targetCellId], targetCellId });
    });
  }

  newDetail.forEach(item => {
    const xName = item.targetCellId;
    // 平均空等时间
    if (viewMode === 'detail') {
      averageWaitTime.data.push({
        target: xName,
        value: transformValue(item.averageWaitTime),
        group: item.group,
      });
    } else {
      const waitTime = Number.parseFloat(item.maxWaitTime) / Number.parseFloat(item.waitSize);
      averageWaitTime.data.push({
        target: xName,
        value: transformValue(waitTime),
        group: item.group,
      });
    }

    // 总的空等时间
    allWaitTime.data.push({
      target: xName,
      value: transformValue(item.allWaitTime),
      group: item.group,
    });

    // 最短空等时间
    mixWaitTime.data.push({
      target: xName,
      value: transformValue(item.mixWaitTime),
      group: item.group,
    });

    // 最长空等时间
    maxWaitTime.data.push({
      target: xName,
      value: transformValue(item.maxWaitTime),
      group: item.group,
    });

    // 次长空等时间
    secondWaitTime.data.push({
      target: xName,
      value: transformValue(item.secondWaitTime),
      group: item.group,
    });
  });

  // 剔除data中 value 为 0 的数据
  averageWaitTime.data = clearZeroValue(averageWaitTime.data);
  allWaitTime.data = clearZeroValue(allWaitTime.data);
  mixWaitTime.data = clearZeroValue(mixWaitTime.data);
  maxWaitTime.data = clearZeroValue(maxWaitTime.data);
  secondWaitTime.data = clearZeroValue(secondWaitTime.data);

  // 横坐标排序
  averageWaitTime.data = sortNumber(averageWaitTime.data);
  allWaitTime.data = sortNumber(allWaitTime.data);
  mixWaitTime.data = sortNumber(mixWaitTime.data);
  maxWaitTime.data = sortNumber(maxWaitTime.data);
  secondWaitTime.data = sortNumber(secondWaitTime.data);

  return {
    averageWaitTime,
    allWaitTime,
    mixWaitTime,
    maxWaitTime,
    secondWaitTime,
  };
};
