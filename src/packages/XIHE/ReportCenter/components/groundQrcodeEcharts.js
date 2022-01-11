import { formatMessage, isStrictNull, GMT2UserTimeZone } from '@/utils/utils';
import { forIn, groupBy, sumBy } from 'lodash';
export const LineChartsAxisColor = 'rgb(189, 189, 189)';
export const DataColor = '#0389ff';
export const timesColor = ['#1890ff', '#0389ff'];

// Series
const trafficLabelOption = {
  // show: true,
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
  stack: '11',
  label: trafficLabelOption,
  emphasis: {
    focus: 'series',
    lable: {
      show: true,
    },
  },
};

export const dateHistoryLineOption = () => ({
  title: {
    text: `${formatMessage({ id: 'reportCenter.qrcodehealth' })}(${formatMessage({
      id: 'reportCenter.way.date',
    })})`,
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
    // formatter: (params) => {
    //   params.map(({ name, value, seriesName, index }) => {
    //     return `${name}${index}<br />${formatMessage({
    //       id: `reportCenter.qrcodehealth.${seriesName}`,
    //     })}:${value}`;
    //   });
    // },
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

export const codeHistoryLineOption = () => ({
  title: {
    text: `${formatMessage({ id: 'reportCenter.qrcodehealth' })}(${formatMessage({
      id: 'reportCenter.way.cellId',
    })})`,
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
  xAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 12,
    },
    axisLine: {
      lineStyle: {
        color: LineChartsAxisColor, // 坐标轴线线的颜色。
      },
    },
    axisTick: {
      show: false, //坐标轴刻度。
    },
    splitLine: {
      //坐标轴在 grid 区域中的分隔线。
      show: true, //是否显示分隔线。默认数值轴显示，类目轴不显示。
      lineStyle: {
        width: 0.5,
        color: LineChartsAxisColor, //分隔线颜色
        type: 'dotted',
        opacity: 0.7,
      },
    },
    splitArea: {
      show: false,
    },
  },
  yAxis: {
    type: 'category',
    data: [],
  },
  series: [], // 数据 有几种类型就放几种
});

// 根据原始数据 --处理日期数据
export const generateTimeData = (allData) => {
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

  const firstTimeDataMap = new Map(); // 存放key 比如车次 偏移等
  const legendData = [];
  const currentAxisData = Object.values(allData)[0]; // 横坐标

  forIn(currentAxisData[0], (value, key) => {
    if (key !== 'cellId') {
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

  Object.entries(currentSery).forEach((key) => {
    series.push({
      ...commonOption,
      data: key[1],
      name: key[0],
      type: 'bar',
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
    orient: 'vertical',
    right: 0,
    x: 'right',
    align: 'right',
    type: 'scroll',
    textStyle: {
      color: '#90979c',
    },
    pageTextStyle: {
      color: '#fff',
    },
    top: '8%',
    bottom: '15%',
    pageIconColor: '#1890FF',
    formatter: function (name) {
      return formatMessage({ id: `reportCenter.qrcodehealth.${name}` });
    },
    animation: true,
  };
  // todo 对于偏移次数 和偏移小车  这个数据要和在一起

  return { xAxis, series, legend };
};

// 根据原始数据 --处理cellId数据
export const transformCodeData = (allData = {}) => {
  const currentAxisData = Object.values(allData)[0];
  const firstTimeDataMap = new Map(); // 存放key 比如车次 偏移等
  const legendData = [];
  const yxisData = []; // 纵坐标 是y
  const series = []; // 存放横坐标数值 是x 每个sery是每种key的求和(根据cellId)
  let currentCellIdData = {}; // 根据cellId 每个key 求和

  forIn(currentAxisData[0], (value, key) => {
    if (key !== 'cellId') {
      firstTimeDataMap.set(key, 0);
      legendData.push(key);
    }
  });

  currentAxisData.map(({ cellId }) => {
    yxisData.push(cellId);
    currentCellIdData[cellId] = {};
  });

  Object.values(allData).forEach((record) => {
    record.forEach((item) => {
      const { cellId } = item;
      forIn(item, (value, key) => {
        if (firstTimeDataMap.has(key)) {
          let seryData = currentCellIdData[cellId][key] || 0;
          currentCellIdData[cellId][key] = seryData * 1 + value * 1;
        }
      });
    });
  });

  console.log('last', currentCellIdData);

  const currentSery = {};
  Object.entries(currentCellIdData).forEach(([cellId, v]) => {
    console.log(cellId);
    forIn(v, (value, key) => {
      if (firstTimeDataMap.has(key)) {
        let seryData = currentSery[key] || [];
        currentSery[key] = [...seryData, value];
      }
    });
  });

  console.log(currentSery);
  Object.entries(currentSery).forEach((key) => {
    console.log(key);
    series.push({
      ...commonOption,
      data: key[1],
      name: `${formatMessage({
        id: `reportCenter.qrcodehealth.${key[0]}`,
      })}`,
      type: 'bar',
    });
  });

  const yAxis = {
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
    data: yxisData,
  };

  const legend = {
    data: legendData,
    // orient: 'vertical',
    align: 'left',
    type: 'scroll',
    textStyle: {
      color: '#90979c',
    },
    pageTextStyle: {
      color: '#fff',
    },
    formatter: function (name) {
      return formatMessage({ id: `reportCenter.qrcodehealth.${name}` });
    },
    animation: true,
  };

  return { yAxis, series, legend };
};
