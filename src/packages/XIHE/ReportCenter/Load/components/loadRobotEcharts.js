import { isStrictNull } from '@/utils/utils';
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
  animation: true,
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
  dataZoom: [
    {
      start: 0,
      type: 'inside',
    },
    // {
    //   start: 50,
    // },
  ],
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
    top: '2%',
    left: '6%',
    right: '2%',
    containLabel: true,
  },
  legend: {
    data: [],
  },
  color: Color[1],
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
  dataZoom: [
    {
      start: 0,
      type: 'inside',
    },
  ],
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
    axisLabel: {
      rotate: 0,
    },
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
    left: 5,
    formatter: function (name) {
      return name;
    },
    animation: true,
  };

  return { radiusAxis, series, legend };
};

// 根据原始数据--x日期 y:数值 任务次数 任务距离
export const generateNumOrDistanceData = (allData, type) => {
  const series = []; // 存放纵坐标数值
  const { currentSery, xAxisData } = sumloadData(allData, type);

  Object.entries(currentSery).forEach((key, i) => {
    series.push({
      ...commonOption,
      data: key[1],
      name: key[0],
      yAxisIndex: 0,
      type: 'bar',
    });
  });
  const xAxis = {
    type: 'category',
    splitLine: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    splitArea: {
      show: false,
    },
    axisLabel: {
      rotate: 20,
    },
    data: xAxisData,
  };
  return { xAxis, series };
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
    getallkeyMap = currentAxisData[0]?.[type];
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

// table数据--根据robotId
export const generateTableData = (originalData) => {
  let currentAxisData = Object.values(originalData)[0] || [];
  currentAxisData = sortBy(currentAxisData, 'robotId');
  let _key = {
    taskDistance: 'taskDistance',
    statusallTime: 'Charging',
  };
  const firstTimeDataMap = new Map();
  firstTimeDataMap.set('taskDistance', 0);
  firstTimeDataMap.set('statusallTime', 0); //
  firstTimeDataMap.set('taskallTime', 0);
  let currentCellIdData = {}; // 根据robotId 每个key 求和

  currentAxisData.map(({ robotId }) => {
    currentCellIdData[robotId] = {};
  });

  Object.values(originalData).forEach((record) => {
    record.forEach((item) => {
      const { robotId, robotType } = item;
      currentCellIdData[robotId]['robotType'] = robotType;
      currentCellIdData[robotId]['robotId'] = robotId;
      forIn(item, (value, key) => {
        if (firstTimeDataMap.has(key)) {
          let seryData = currentCellIdData[robotId][key] || 0;
          if (_key[key]) {
            let currentKey = _key[key];
            currentCellIdData[robotId][key] = seryData * 1 + value[currentKey] * 1;
          } else {
            let _sum = 0;
            forIn(value, (val2, k2) => {
              _sum += val2;
            });
            currentCellIdData[robotId][key] = seryData * 1 + _sum * 1;
          }
        }
      });
    });
  });
  const currentRobotData = Object.values(currentCellIdData);

  return { currentRobotData };
};

// 1234->1,234
export const formatNumber = (n) => {
  let num = n.toString();
  let decimals = '';
  // 判断是否有小数
  num.indexOf('.') > -1 ? (decimals = num.split('.')[1]) : decimals;
  let len = num.length;
  if (len <= 3) {
    return num;
  } else {
    let temp = '';
    let remainder = len % 3;
    decimals ? (temp = '.' + decimals) : temp;
    if (remainder > 0) {
      return (
        num.slice(0, remainder) + ',' + num.slice(remainder, len).match(/\d{3}/g).join(',') + temp
      );
    } else {
      // 是3的整数倍
      return num.slice(0, len).match(/\d{3}/g).join(',') + temp;
    }
  }
};
