import { GMT2UserTimeZone, isNull, isStrictNull, formatMessage } from '@/utils/util';

export const LineChartsAxisColor = 'rgb(189, 189, 189)';
export const DataColor = '#0389ff';
export const timesColor = ['#1890ff', '#0389ff'];

export const taskHistoryLineOption = () => ({
  title: {
    text: formatMessage({ id: 'monitor.workstation.label.arrivals' }),
    x: 'center',
    bottom: '3%',
    textStyle: {
      fontWeight: 'normal',
      color: LineChartsAxisColor,
      fontSize: 16,
    },
  },
  color: timesColor,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      textStyle: {
        fontSize: 12,
        color: '#fff',
      },
    },
    confine: true,
  },
  lineStyle: {
    normal: {
      color: DataColor,
    },
  },
  grid: {
    top: '8%',
    left: '6%',
    right: '2%',
    containLabel: false,
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: [],
    },
  ],
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 12,
    },
    axisLine: {
      lineStyle: {
        color: LineChartsAxisColor,
      },
    },
    axisTick: {
      show: false, //坐标轴刻度。
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 0.5,
        color: LineChartsAxisColor,
        type: 'dotted',
        opacity: 0.7,
      },
    },
    splitArea: {
      show: false,
    },
  },
  series: [], // 有几层数据 就放几层
});

export const waitingHistoryLineOption = () => ({
  title: {
    text: formatMessage({ id: 'monitor.workstation.label.last30Wait' }),
    x: 'center',
    bottom: '3%',
    textStyle: {
      fontWeight: 'normal',
      color: LineChartsAxisColor,
      fontSize: 16,
    },
  },
  color: timesColor,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      textStyle: {
        fontSize: 12,
        color: '#fff',
      },
    },
    confine: true,
  },
  grid: {
    top: '8%',
    left: '6%',
    right: '2%',
    containLabel: false,
  },
  xAxis: {
    axisLine: {
      lineStyle: {
        color: LineChartsAxisColor,
      },
    },
    axisLabel: {
      interval: 1,
      fontSize: 12,
    },
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
      alignWithLabel: true,
    },
    splitArea: {
      show: false,
    },
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      interval: 0,
      fontSize: 12,
    },
    axisLine: {
      lineStyle: {
        color: LineChartsAxisColor,
      },
    },
    axisTick: {
      show: false,
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 0.5,
        color: LineChartsAxisColor,
        type: 'dotted',
        opacity: 0.7,
      },
    },
    splitArea: {
      show: false,
    },
  },
  series: [],
});

// 到站个数
export const trafficHistoryLineOption = () => ({
  title: {
    text: formatMessage({ id: 'monitor.workstation.label.traffic' }),
    x: 'center',
    bottom: '3%',
    textStyle: {
      fontWeight: 'normal',
      color: LineChartsAxisColor,
      fontSize: 16,
    },
  },
  color: timesColor,
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
      textStyle: {
        fontSize: 12,
        color: '#fff',
      },
    },
  },
  lineStyle: {
    normal: {
      color: DataColor,
    },
  },
  grid: {
    top: '8%',
    left: '6%',
    right: '2%',
    containLabel: false,
  },
  xAxis: [
    {
      type: 'category',
      axisTick: { show: false },
      data: [],
    },
  ],
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 12,
    },
    axisLine: {
      lineStyle: {
        color: LineChartsAxisColor,
      },
    },
    axisTick: {
      show: false, //坐标轴刻度。
    },
    splitLine: {
      show: true,
      lineStyle: {
        width: 0.5,
        color: LineChartsAxisColor,
        type: 'dotted',
        opacity: 0.7,
      },
    },
    splitArea: {
      show: false,
    },
  },
  series: [], // 有几层数据 就放几层
});

// 转换最后30s数据
export const transformCommonWaitingData = (waitingDataResponse) => {
  let waitingData = Object.values(waitingDataResponse).find((item) => {
    if (
      !isStrictNull(item) &&
      Array.isArray(item.waitAroundTimeRecords) &&
      item.waitAroundTimeRecords.length > 0
    )
      return item.waitAroundTimeRecords;
  });
  const workStationWaitingData = waitingData?.waitAroundTimeRecords ?? [];

  const xAxis = {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: LineChartsAxisColor,
      },
    },
    axisLabel: {
      fontSize: 12,
      interval: 0,
    },
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitArea: {
      show: false,
    },
    data: workStationWaitingData.map((item, index) => `${workStationWaitingData.length - index}`),
  };

  const trafficLabelOption = {
    position: 'insideBottom',
    distance: 15,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {},
    },
  };
  const commonOption = {
    type: 'bar',
    label: trafficLabelOption,
    emphasis: {
      focus: 'series',
      lable: {
        show: true,
      },
    },
  };

  const series = [];

  const averagNum = []; // 全部数据存入
  Object.entries(waitingDataResponse).forEach(([key, typeData]) => {
    const typeNum = [];
    if (
      !isStrictNull(typeData) &&
      Array.isArray(typeData.waitAroundTimeRecords) &&
      typeData.waitAroundTimeRecords.length > 0
    ) {
      typeData?.waitAroundTimeRecords.map(({ waitTime }) => {
        let time = (waitTime / 1000).toFixed(2);
        typeNum.push(time);
      });
      const avarageT = (typeData.averageWaitTime / 1000).toFixed(2);
      averagNum.push(avarageT);
    }
    series.push({
      ...commonOption,
      stack: '11',
      data: typeNum.reverse(),
      name: formatMessage({ id: `app.module.${key}` }),
    });
  });
  // 全部数据求平均值
  let currentAveragNum = averagNum.reduce(function (preValue, curValue) {
    return preValue * 1 + curValue * 1;
  }, 0);
  // 取平均值
  if (averagNum.length > 1) {
    currentAveragNum = (currentAveragNum / averagNum.length).toFixed(2);
  }

  const showAverageData = [];
  xAxis?.data.map(() => {
    showAverageData.push(currentAveragNum);
  });
  series.push({
    ...commonOption,
    data: showAverageData,
    name: formatMessage({ id: `app.monitor.modal.workstation.label.average` }),
    type: 'line',
  });

  return { xAxis, series };
};

// 转换到站个数/次数数据
export const transformCommonTrafficData = (allData = {}) => {
  const result = {}; // 用于横坐标
  let taskCount = Object.values(allData)
    .filter((item) => {
      return (
        !isStrictNull(item) &&
        !isStrictNull(item.taskCountMap) &&
        Object.keys(item.taskCountMap).length > 0
      );
    })
    .map(({ taskCountMap }) => taskCountMap);

  const currentTaskCountMap = taskCount.reduce((before, next) => {
    if (Object.keys(before).length < Object.keys(next).length) {
      return next;
    } else {
      return before;
    }
  }, {});

  Object.keys(currentTaskCountMap).forEach((dateTime) => {
    const localDateTime = GMT2UserTimeZone(`${dateTime}:00:00`).format('YYYY-MM-DD HH:mm');
    const time = localDateTime.split(' ')[1];
    result[time] = currentTaskCountMap[dateTime];
  });
  // 横坐标
  const xAxisData = Object.keys(result).sort();

  // Series
  const trafficLabelOption = {
    position: 'insideBottom',
    distance: 15,
    align: 'left',
    verticalAlign: 'middle',
    rotate: 90,
    formatter: '{c}  {name|{a}}',
    fontSize: 16,
    rich: {
      name: {},
    },
  };
  const series = [];
  const commonOption = {
    type: 'bar',
    label: trafficLabelOption,
    emphasis: {
      focus: 'series',
      lable: {
        show: true,
      },
    },
  };

  const averagNum = []; // 数据存入
  Object.entries(allData).forEach(([key, typeData]) => {
    const typeResult = {};
    const typeNum = [];
    if (!isStrictNull(typeData) && !isStrictNull(typeData.taskCountMap)) {
      const { taskCountMap, averageTaskCount } = typeData;
      if (isNull(taskCountMap) || Object.keys(taskCountMap).length === 0) return;
      Object.keys(taskCountMap).forEach((item) => {
        const localDateTime = GMT2UserTimeZone(`${item}:00:00`).format('YYYY-MM-DD HH:mm');
        const time = localDateTime.split(' ')[1];
        typeResult[time] = taskCountMap[item];
      });

      if (!isStrictNull(averageTaskCount)) {
        averagNum.push(averageTaskCount); // 理论上现在只有一种类型 不可能同时出现2种 所以直接取
      }

      xAxisData.forEach((t) => {
        typeNum.push(typeResult[t]);
      });
    }
    series.push({
      ...commonOption,
      data: typeNum,
      name: formatMessage({ id: `app.module.${key}` }),
    });
  });
  // 全部数据求和
  let currentAveragNum = averagNum.reduce(function (preValue, curValue) {
    return preValue + curValue;
  }, 0);
  // 取平均值
  if (averagNum.length > 1) {
    currentAveragNum = (currentAveragNum / averagNum.length).toFixed(2);
  }
  const showAverageData = [];
  xAxisData.map(() => {
    showAverageData.push(currentAveragNum);
  });
  series.push({
    ...commonOption,
    data: showAverageData,
    name: formatMessage({ id: `app.monitor.modal.workstation.label.average` }),
    type: 'line',
  });

  const xAxis = {
    type: 'category',
    axisLine: {
      lineStyle: {
        color: LineChartsAxisColor,
      },
    },
    axisLabel: {
      fontSize: 12,
      interval: 0,
    },
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitArea: {
      show: false,
    },
    data: xAxisData,
  };

  return { xAxis, series };
};

export const transitionRobots = (data) => {
  const result = {};
  Object.entries(data).forEach(([key, typeData]) => {
    let num = [];
    if (!isStrictNull(typeData)) {
      const { robotIds } = typeData;
      if (robotIds && robotIds.length > 0) num = robotIds;
    }
    result[key] = num;
  });
  return result;
};

// 送货物个数数据转换--因为和次数用的同一个方法--key一样就不需要特殊处理了
export const generateGoodsCountData = (allData) => {
  const TaskNumber = {};
  Object.entries(allData).forEach(([key, typeData]) => {
    if (
      !isStrictNull(typeData) &&
      !isStrictNull(typeData.goodsCountMap) &&
      Object.keys(typeData.goodsCountMap).length > 0
    ) {
      TaskNumber[key] = {
        taskCountMap: typeData.goodsCountMap,
        averageTaskCount: typeData.averageGoodsCount,
      };
    }
  });
  return TaskNumber;
};
