import { formatMessage, isStrictNull, GMT2UserTimeZone } from '@/utils/utils';
import { forIn, sortBy } from 'lodash';
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
  barMaxWidth: 60,
  label: trafficLabelOption,
  emphasis: {
    focus: 'series',
    lable: {
      show: true,
    },
  },
};

export const dateHistoryLineOption = (title) => ({
  title: {
    text: `${title}(${formatMessage({
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
    formatter: (params) => {
      const name = params[0]?.axisValue;
      var showHtm = name + '<br>';
      params.map(({ marker, value, seriesName, index }) => {
        showHtm +=
          marker +
          formatMessage({ id: `reportCenter.qrcodehealth.${seriesName}` }) +
          '：' +
          value +
          '<br>';
      });
      return showHtm;
    },
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
    top: '15%',
    left: '6%',
    right: '2%',
    containLabel: true,
  },
  legend: {
    top: '0',
    data: [],
  },
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

export const codeHistoryLineOption = (title) => ({
  title: {
    text: `${title}(${formatMessage({
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
    formatter: (params) => {
      const name = params[0]?.axisValue;
      var showHtml = name + '<br>';
      params.map(({ marker, value, seriesName, index }) => {
        showHtml +=
          marker +
          formatMessage({ id: `reportCenter.qrcodehealth.${seriesName}` }) +
          '：' +
          value +
          '<br>';
      });
      return showHtml;
    },
  },
  lineStyle: {
    normal: {
      color: DataColor,
    },
  },
  grid: {
    top: '10%',
    left: '6%',
    right: '2%',
    containLabel: true,
  },
  dataZoom: [
    {
      type: 'inside',
      start: 0,
      end: 100,
      yAxisIndex: 0,
    },
  ],
  xAxis: {
    type: 'value',
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
  legend: {
    top: '0',
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
  const currentAxisData = Object.values(allData)[0] || []; // 横坐标

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
    // orient: 'vertical',
    // right: 0,
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

// 根据原始数据 --处理cellId数据 纵坐标 是y
export const transformCodeData = (allData = {}) => {
  const series = []; // 存放横坐标数值 是x 每个sery是每种key的求和(根据cellId)
  const { legendData, yxisData, currentSery } = getOriginalDataBycode(allData);

  Object.entries(currentSery).forEach((key) => {
    series.push({
      ...commonOption,
      data: key[1],
      name: key[0],
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
    x: 'right',
    align: 'right',
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

//  拿到原始数据的 所有参数 所有根据cellId的参数求和
export const getOriginalDataBycode = (originalData) => {
  let currentAxisData = Object.values(originalData)[0] || [];
  currentAxisData = sortBy(currentAxisData, 'cellId');
  const firstTimeDataMap = new Map(); // 存放key 比如车次 偏移等
  const legendData = [];
  const yxisData = []; // 纵坐标 是y
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

  Object.values(originalData).forEach((record) => {
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
  const currentSery = {};
  Object.entries(currentCellIdData).forEach(([_, v]) => {
    forIn(v, (value, key) => {
      if (firstTimeDataMap.has(key)) {
        let seryData = currentSery[key] || [];
        currentSery[key] = [...seryData, value];
      }
    });
  });
  return { legendData, yxisData, currentSery, commonOption };
};
