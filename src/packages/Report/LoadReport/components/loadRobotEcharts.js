import { isStrictNull, formatMessage } from '@/utils/util';
import { forIn, isNull } from 'lodash';
import { AgvStateColor } from '@/config/consts';
import { labelColor, titleColor } from '@/packages/Report/components/GroundQrcodeEcharts';
import { filterNewXAixsTime, getNewKey } from '@/packages/Report/components/reportUtil';
import moment from 'moment';
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

// 动作负载-pie option

export const actionPieOption = (title, keyMap) => ({
  title: {
    text: title,
    subtext: '汇总',
    left: 'center',
  },
  tooltip: {
    confine: true,
    trigger: 'item',
    formatter: function (params) {
      const { name, value, percent } = params;
      const currentValue = MinuteFormat(value);
      var showHtm = `${keyMap[name]} ${' : '}${currentValue} ${' ('}${percent} ${'%)'}
      `;
      return showHtm;
    },
  },
  color: Color,
  legend: {
    left: 5,
    orient: 'vertical',
  },
  series: [],
});

// 动作负载-柱状图 横坐标是日期
export const actionBarOption = (title, keyMap) => ({
  title: {
    text: title,
    subtext: '按时间',
    subTextStyle: {
      fontWeight: 'bold',
      color: titleColor,
      fontSize: 16,
    },
    x: 'center',
    y: 'top',
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
    formatter: function (params) {
      const name = params[0].axisValue;
      var showHtm = name + '<br>';
      for (let i = 0; i < params.length; i++) {
        const { marker, seriesName, value } = params[i];
        showHtm += marker + keyMap[seriesName] + '：' + MinuteFormat(value) + '<br>';
      }
      return showHtm;
    },
  },
  color: Color,
  lineStyle: {
    normal: {
      color: DataColor,
    },
  },
  legend: {
    // right: 0,
    top: 110,
    // bottom: 0,
    // left: 5,
    // orient: 'vertical',
  },
  grid: {
    // top: '2%',
    left: '2%',
    right: '10%',
    containLabel: true,
  },

  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
    },
  ],
  xAxis: [
    {
      type: 'category',
      data: [],
    },
  ],
  yAxis: {
    type: 'value',
    // name: '分',
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
    // axisLabel: {
    //   formatter: function (value) {
    //     if (value === 0) {
    //       return value;
    //     } else {
    //       return Number.parseFloat((value / 60).toFixed(5));
    //     }
    //   },
    // },
  },
  series: [], // 有几层数据 就放几层
});

// 状态时长 任务时长 极坐标
export const durationLineOption = (title, keyMap) => ({
  title: {
    text: title,
    x: 'center',
    y: 'top',
    top: '-5',
    textStyle: {
      fontWeight: 'bold',
      color: titleColor,
      fontSize: 16,
    },
  },
  tooltip: {
    confine: true,
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
    formatter: function (params) {
      const name = params[0].axisValue;
      var showHtm = name + '<br>';
      for (let i = 0; i < params.length; i++) {
        const { marker, seriesName, value } = params[i];
        showHtm += marker + keyMap[seriesName] + '：' + MinuteFormat(value) + '<br>';
      }
      return showHtm;
    },
  },
  color: Color,
  grid: {
    top: '2%',
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
export const taskLineOption = (title, keyMap) => ({
  title: {
    text: title,
    x: 'center',
    bottom: '3%',
    textStyle: {
      fontWeight: 'bold',
      color: titleColor,
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
    formatter: function (params) {
      const name = params[0].axisValue;
      var showHtm = name + '<br>';
      for (let i = 0; i < params.length; i++) {
        const { marker, seriesName, value } = params[i];
        showHtm += marker + keyMap[seriesName] + '：' + value + '<br>';
      }
      return showHtm;
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

/*
 *根据原始数据 --x日期数据- y数值:任务时长 状态时长
 *@param allData-源数据
 *@param type-用于从源数据中取报表对应的数据
 *@param translate-报表的legend {key:value}
 *@param colorFlag-目前只有状态时长传true
 @param  timeType--(x轴：日期) 显示是按日/月/小时
 */
export const generateDurationDataByTime = (
  allData,
  type,
  translate,
  colorFlag,
  timeType = 'hour',
) => {
  const series = []; // 存放纵坐标数值
  const { currentSery, xAxisData, legendData } = sumloadData(
    allData,
    type,
    translate,
    timeType,
    'average',
  );
  Object.entries(currentSery).forEach((key, i) => {
    series.push({
      ...commonOption,
      coordinateSystem: 'polar',
      data: key[1],
      name: key[0],
      yAxisIndex: 0,
      type: 'bar',
      itemStyle: {
        color: colorFlag ? AgvStateColor[key[0]] ?? null : null, //null会是取默认颜色，key[1]?.[0]?.color,
      },
    });
  });

  const radiusAxis = {
    type: 'category',
    axisLabel: {
      rotate: 0,
      color: labelColor,
    },
    splitArea: {
      show: true,
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
      return translate[name];
    },
    animation: true,
  };

  return { radiusAxis, series, legend };
};

// 根据原始数据--x日期 y:数值 任务次数 任务距离
export const generateNumOrDistanceData = (allData, type, translate, timeType = 'hour') => {
  const series = []; // 存放纵坐标数值
  const { currentSery, xAxisData } = sumloadData(allData, type, translate, timeType);

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
      color: labelColor,
    },
    data: xAxisData,
  };
  return { xAxis, series };
};

// 运动动作负载-pie
export const generateActionPieData = (allData, type, translate) => {
  const seryData = [];
  let legendData = Object.keys(translate); // 存放key数组
  let currentActionSum = {}; // 当前key-运动动作求和

  legendData.map((item) => {
    currentActionSum[item] = 0;
  });

  Object.entries(allData).forEach(([key, typeData]) => {
    if (!isStrictNull(typeData)) {
      typeData.forEach((record) => {
        let _record = { ...record };
        if (!isNull(type)) {
          _record = { ...record[type] };
        }
        forIn(_record, (value, parameter) => {
          if (legendData.includes(parameter)) {
            const _value = isStrictNull(value) ? 0 : value;
            const existValue = currentActionSum[parameter] || 0;
            currentActionSum[parameter] = existValue * 1 + _value * 1;
          }
        });
      });
    }
  });

  forIn(currentActionSum, (v, key) => {
    const value = v === 0 ? '' : v;
    if (v !== 0) {
      seryData.push({ name: key, value, label: translate[key] });
    }
  });

  const legend = {
    left: 5,
    orient: 'vertical',
    formatter: function (name) {
      return translate[name];
    },
    animation: true,
  };

  const series = [
    {
      type: 'pie',
      radius: ['38%', '70%'],
      avoidLabelOverlap: false,
      label: {
        formatter: (params) => {
          if (params?.data?.label) {
            const currentLabel = params?.data?.label;
            return currentLabel;
          } else {
            return params.name;
          }
        },
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12',
          fontWeight: 'bold',
        },
      },
      data: seryData,
    },
  ];
  return { series, legend };
};

// 运动动作负载-bar  x:日期 y:数值 比如:无动作 顶升 下降
export const generateActionBarData = (allData, type, translate, timeType = 'hour') => {
  const series = []; // 存放纵坐标数值
  const { currentSery, xAxisData } = sumloadData(allData, type, translate, timeType);

  Object.entries(currentSery).forEach((key, i) => {
    series.push({
      ...commonOption,
      data: key[1],
      name: key[0],
      itemStyle: {
        color: null, //null会是取默认颜色，key[1]?.[0]?.color,
      },
      yAxisIndex: 0,
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
      color: labelColor,
    },
    data: xAxisData,
  };

  const legend = {
    type: 'scroll',
    formatter: function (name) {
      return translate[name];
    },
    top: 8,
    right: 5,
    orient: 'vertical',
    animation: true,
  };

  return { xAxis, series, legend };
};

/*
 * 小车负载/任务负载 调用
 *@param allData-源数据
 *@param type-用于从源数据中取报表对应的数据
 *@param translate-报表的legend {key:value}
 *@param  timeType--(x轴：日期) 显示是按日/月/小时
 *@param  average--(求平均值) 目前状态时长和任务时长 需要求平均值
 **/
export const sumloadData = (allData, type, translate, timeType, average) => {
  const legendData = Object.keys(translate);
  const keyDataMap = new Map(); // 存放key 比如充电 空闲等的求和
  legendData.map((item) => {
    keyDataMap.set(item, 0);
  });

  const xAxisData = filterNewXAixsTime(allData, timeType); // 横坐标-日期

  let keyResult = {};
  xAxisData.map((item) => {
    keyResult[item] = {};
  });

  Object.entries(allData).forEach(([key, typeData]) => {
    if (!isStrictNull(typeData)) {
      const idKey = getNewKey(key, timeType);
      let currentTime = {}; // 当前日期key 求和
      typeData.forEach((record) => {
        let _record = {};
        if (!isNull(type)) {
          _record = { ...record[type] };
        }
        forIn(_record, (value, parameter) => {
          if (legendData.includes(parameter)) {
            const _value = isStrictNull(value) ? 0 : value;
            const existValue = currentTime[parameter] || 0;
            currentTime[parameter] = existValue * 1 + _value * 1;
          }
        });
      });

      // 状态时长和任务时长 需要求平均值
      let newTimes = {};
      if (!isNull(average) && average === 'average') {
        const _length = typeData.length;
        forIn(currentTime, (value, parameter) => {
          const _value = isStrictNull(value) ? 0 : value / _length;
          newTimes[parameter] = Number.parseFloat(_value.toFixed(3));
        });
      } else {
        newTimes = currentTime;
      }

      forIn(newTimes, (value, parameter) => {
        const _value = isStrictNull(value) ? 0 : value;
        const existValue = keyResult[idKey][parameter] || 0;
        keyResult[idKey][parameter] = Number.parseFloat((existValue * 1 + _value * 1).toFixed(3));
      });
    }
  });

  const currentSery = {};

  Object.values(keyResult).map((v, index) => {
    legendData.map((key) => {
      const _value = v[key] || 0;
      let seryData = currentSery[key] || [];
      currentSery[key] = [...seryData, _value];
    });
  });

  return { currentSery, xAxisData, legendData };
};

// table数据--根据agvId
export const generateTableData = (originalData = {}, agvData = []) => {
  const currentAxisData = [...agvData];
  if (currentAxisData?.length === 0) {
    return {};
  }
  let _key = {
    taskDistance: 'taskDistance',
    statusAllTime: 'Charging',
  };
  const firstTimeDataMap = new Map();
  firstTimeDataMap.set('taskDistance', 0);
  firstTimeDataMap.set('statusAllTime', 0);
  firstTimeDataMap.set('taskAllTime', 0);
  let currentCellIdData = {}; // 根据agvId 每个key 求和

  currentAxisData.map((agv) => {
    currentCellIdData[agv] = {};
  });

  Object.values(originalData).forEach((record) => {
    record.forEach((item) => {
      const { agvId, robotType } = item;
      if (currentAxisData.includes(agvId)) {
        currentCellIdData[agvId]['robotType'] = robotType;
        currentCellIdData[agvId]['agvId'] = agvId;
        forIn(item, (value, key) => {
          if (firstTimeDataMap.has(key)) {
            let seryData = currentCellIdData[agvId][key] || 0;
            if (_key[key]) {
              let currentKey = _key[key];
              currentCellIdData[agvId][key] = seryData * 1 + (value[currentKey] ?? 0) * 1;
            } else {
              let _sum = 0;
              forIn(value, (val2, k2) => {
                _sum += val2;
              });
              currentCellIdData[agvId][key] = seryData * 1 + _sum * 1;
            }
          }
        });
      }
    });
  });
  const currentRobotData = Object.values(currentCellIdData);

  return { currentRobotData };
};

// 1234->1,234
export const formatNumber = (n) => {
  let num = Number.parseFloat(n.toFixed(3)).toString();
  let decimals = '';
  // 判断是否有小数
  if (num.indexOf('.') > -1) {
    decimals = num.split('.')[1];
    num = num.split('.')[0];
  }
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

// 时间转换-天 时 分 秒
/** seconds
 * minutes
 * hours
 *
 * */

export const MinuteFormat = (value) => {
  if (value === 0) {
    return 0;
  }
  if (value < 60) {
    return value + formatMessage({ id: 'app.time.seconds' });
  }
  const d = moment.duration(value, 'seconds');
  let currentValue = '';
  if (Math.floor(d.asDays()) > 0) {
    currentValue += Math.floor(d.asDays()) + formatMessage({ id: 'app.time.day' });
  }
  if (d.hours() > 0) {
    currentValue += d.hours() + formatMessage({ id: 'app.time.hours' });
  }
  if (d.minutes() > 0) {
    currentValue += d.minutes() + formatMessage({ id: 'app.time.minutes' });
  }
  if (d.seconds() > 0) {
    currentValue += d.seconds() + formatMessage({ id: 'app.time.seconds' });
  }
  return currentValue;
};
