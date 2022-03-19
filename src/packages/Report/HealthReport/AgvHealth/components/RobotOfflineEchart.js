import { isStrictNull } from '@/utils/util';
import { forIn } from 'lodash';
import { getOriginalDataBycode } from '@/packages/Report/components/GroundQrcodeEcharts';

export const LineChartsAxisColor = 'rgb(189, 189, 189)';
export const DataColor = '#0389ff';
export const colors = ['#91CC75', '#89c7f2'];

// Series
export const trafficLabelOption = {
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

export const commonOption = {
  type: 'bar',
  barMaxWidth: 100,
  label: trafficLabelOption,
  emphasis: {
    focus: 'series',
    lable: {
      show: true,
    },
  },
};

export const offlineHistoryLineOption = (title, keyMap) => ({
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
  color: colors,
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
  yAxis: [
    {
      type: 'value',
      name: '次数',
      min: 0,
      position: 'left', // 次数 bar
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[0],
        },
      },
      axisLabel: {
        formatter: '{value}',
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
    },
    {
      type: 'value',
      name: '时长',
      min: 0,
      position: 'right', // 时长 折线
      axisLine: {
        show: true,
        lineStyle: {
          color: colors[1],
        },
      },
      axisLabel: {
        formatter: '{value} ',
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
    },
  ],
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
    },
    {
      start: 0,
      end: 100,
      handleIcon:
        'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
      handleSize: '80%',
      handleStyle: {
        color: '#fff',
        shadowBlur: 3,
        shadowColor: 'rgba(0, 0, 0, 0.6)',
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      },
    },
  ],
  series: [], // 有几层数据 就放几层
});

/*
 *根据原始数据 --处理日期数据(x轴:日期)-小车离线
 *translate {key:value}
 */
export const generatOfflineDataByTime = (allData, translate) => {
  const series = []; // 存放纵坐标数值
  const xAxisData = Object.keys(allData).sort(); // 横坐标

  const typeResult = [];
  Object.entries(allData).forEach(([key, typeData]) => {
    if (!isStrictNull(typeData)) {
      let currentTime = {}; // 当前日期每个key 求和
      typeData.forEach((record) => {
        forIn(record, (value, parameter) => {
          const _value = isStrictNull(value) ? 0 : value;
          const existValue = currentTime[parameter] || 0;
          currentTime[parameter] = existValue * 1 + _value * 1;
        });
      });
      typeResult.push(currentTime);
    }
  });

  const keyDataMap = new Map(); // 存放key 比如车次 偏移等的求和
  const legendData = Object.keys(translate);
  legendData.map((item) => {
    keyDataMap.set(item, 0);
  });

  const currentSery = {};
  typeResult.map((v) => {
    forIn(v, (value, key) => {
      if (keyDataMap.has(key)) {
        let seryData = currentSery[key] || [];
        currentSery[key] = [...seryData, value];
      }
    });
  });

  Object.entries(currentSery).forEach((key, i) => {
    series.push({
      ...commonOption,
      data: key[1],
      name: key[0],
      yAxisIndex: i,
      type: ['offlineTime', 'errorTime'].includes(key[0]) ? 'line' : 'bar',
    });
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
      rotate: 20,
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

  const legend = {
    data: legendData,
    type: 'scroll',
    textStyle: {
      color: '#90979c',
    },
    pageTextStyle: {
      color: '#fff',
    },
    formatter: function (name) {
      return translate[name];
    },
    animation: true,
  };

  return { xAxis, series, legend };
};

// 根据原始数据 --处理agvId数据-小车离线
export const generatOfflineDataByRobot = (allData = {}, translate, idName = 'agvId') => {
  const series = []; // 存放纵坐标数值
  const {
    legendData,
    yxisData: xAxisData,
    currentSery,
  } = getOriginalDataBycode(allData, translate, idName);

  Object.entries(currentSery).forEach((key, i) => {
    series.push({
      ...commonOption,
      data: key[1],
      name: key[0],
      yAxisIndex: i,
      type: ['offlineTime', 'errorTime'].includes(key[0]) ? 'line' : 'bar',
    });
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

  const legend = {
    data: legendData,
    type: 'scroll',
    textStyle: {
      color: '#90979c',
    },
    pageTextStyle: {
      color: '#fff',
    },
    formatter: function (name) {
      return translate[name];
    },
    animation: true,
  };

  return { xAxis, series, legend };
};
