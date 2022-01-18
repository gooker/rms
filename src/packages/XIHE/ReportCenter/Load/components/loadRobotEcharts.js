import { formatMessage, isStrictNull, GMT2UserTimeZone } from '@/utils/utils';
import { forIn, isNull, sortBy } from 'lodash';
export const LineChartsAxisColor = 'rgb(189, 189, 189)';
export const DataColor = '#0389ff';
export const Color = [
  '#5470c6',
  '#91cc75',
  '#fac858',
  '#ee6666',
  '#73c0de',
  '#3ba272',
  '#fc8452',
  '#9a60b4',
  '#ea7ccc',
];

const statusallTime = {
  //状态时长
  Offline: 5, //离线
  Free: 10, // 空闲
  Working: 10, // 执行
  StandBy: 10, // 待命
  Charging: 10, // 充电
  Error: 0, //异常  状态时长结束
};
const taskallTime = {
  //任务时长
  EMPTY_RUN: 0, //空跑
  REST_UNDER_POD: 0, //回休息区
  CARRY_POD_TO_STATION: 0, //工作站任务
  CHARGE_RUN: 0, //充电
  CUSTOM_TASK: 0, //自定义任务
  CARRY_POD_TO_CELL: 0, //搬运货架
};

// 任务时长 状态时长
const commonOption = {
  type: 'bar',
  stack: 'a',
  barMaxWidth: 60,
  emphasis: {
    focus: 'series',
    lable: {
      show: true,
    },
  },
};

export const durationLineOption = (title) => ({
  title: {
    text: title,
    bottom: 0,
    x: 'center',
    textStyle: {
      fontWeight: 'normal',
      color: LineChartsAxisColor,
      fontSize: 16,
    },
  },
  tooltip: {
    confine: true,
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  color: Color,
  grid: {
    top: '8%',
    left: '6%',
    right: '2%',
    containLabel: true,
  },
  legend: {
    show: true,
    orient: 'vertical',
    data: [],
  },
  polar: {},
  angleAxis: {}, // 数值
  radiusAxis: {
    // name: title,
    type: 'category',
    data: [],
    z: 10,
  },
  series: [], // 有几层数据 就放几层
});
// 任务次数 任务距离
export const taskLineOption = (title) => ({
  title: {
    text: title,
    x: 'center',
    bottom: '3%',
    textStyle: {
      fontWeight: 'normal',
      color: LineChartsAxisColor,
      fontSize: 16,
    },
  },
  tooltip: {
    confine: true,
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
    containLabel: true,
  },
  legend: {
    data: [],
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

// 根据原始数据 --x日期数据- 数值:任务时长 状态时长
export const generateDurationDataByTime = (allData, type) => {
  const series = []; // 存放纵坐标数值
  const { currentSery, xAxisData, legendData } = sumloadData(allData, type);

  Object.entries(currentSery).forEach((key, i) => {
    series.push({
      ...commonOption,
      coordinateSystem: 'polar',
      data: key[1],
      name: key[0],
      yAxisIndex: 0,
      type: 'bar',
    });
  });

  const radiusAxis = {
    type: 'category',
    // splitLine: {
    //   show: false,
    // },
    // axisTick: {
    //   show: false,
    // },
    // splitArea: {
    //   show: false,
    // },
    splitArea: {
      show: true,
      interval: 0,
    },
    data: xAxisData,
    z: 10,
  };

  const legend = {
    data: legendData,
    type: 'scroll',
    textStyle: {
      color: '#90979c',
    },
    pageTextStyle: {
      color: '#fff',
    },
    orient: 'vertical',
    // align: 'right',
    left: 20,
    formatter: function (name) {
      return name;
    },
    animation: true,
  };

  return { radiusAxis, series, legend };
};

export const sumloadData = (allData, type) => {
  const xAxisData = Object.keys(allData).sort(); // 横坐标-日期

  const typeResult = [];
  Object.entries(allData).forEach(([key, typeData]) => {
    if (!isStrictNull(typeData)) {
      let currentTime = {}; // 当前日期key 求和
      typeData.forEach((record) => {
        let _record = { ...record };
        if (!isNull(type)) {
          _record = { ...record[type] };
        }
        forIn(_record, (value, parameter) => {
          const _value = isStrictNull(value) ? 0 : value;
          const existValue = currentTime[parameter] || 0;
          currentTime[parameter] = existValue * 1 + _value * 1;
        });
      });
      typeResult.push(currentTime);
    }
  });

  const firstTimeDataMap = new Map(); // 存放key 比如充电 空闲等
  const legendData = [];
  let currentAxisData = Object.values(allData)[0] || []; // 横坐标
  let getallkeyMap = currentAxisData[0];
  if (!isNull(type)) {
    getallkeyMap = currentAxisData[0][type];
  }

  forIn(getallkeyMap, (value, key) => {
    if (key !== 'robotId') {
      firstTimeDataMap.set(key, 0);
      legendData.push(key);
    }
  });

  const currentSery = {};
  typeResult.map((v) => {
    forIn(v, (value, key) => {
      if (firstTimeDataMap.has(key)) {
        let seryData = currentSery[key] || [];
        currentSery[key] = [...seryData, value];
      }
    });
  });
  return { currentSery, xAxisData, legendData };
};
