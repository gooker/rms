import { formatMessage, isStrictNull } from '@/utils/utils';
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
  label: trafficLabelOption,
  barMaxWidth: 100,
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
    // formatter: function (params) {
    // const name = params[0].axisValue;
    // var showHtm = name + '<br>';
    // for (let i = 0; i < params.length; i++) {
    //   const { marker, seriesName, value } = params[i];
    //   showHtm +=
    //     marker +
    //     formatMessage({ id: `reportCenter.qrcodehealth.${seriesName}` }) +
    //     '：' +
    //     value +
    //     '<br>';
    // }
    // return showHtm;
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
    width: 10,
  },
  // dataZoom: [// 用于区域缩放
  //   {
  //     show: true,
  //     start: 30,
  //     end: 100,
  //     right:30,
  //   },
  //   {
  //     type: 'inside',
  //     start: 30,
  //     end: 100,
  //     right:30,
  //   },
  // ],
  xAxis: [
    {
      type: 'category',
      // axisTick: { show: false }, //是否显示坐标轴刻度。
      axisLabel: { rotate: 38 },
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

export const codeHistoryLineOption = (title) => ({
  title: {
    text: `${title}(${formatMessage({
      id: 'reportCenter.way.robot',
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
export const generateTimeData = (allData, notformatlegend) => {
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
      // rotate: 10,
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
    x: 'right',
    align: 'right',
    type: 'scroll',
    textStyle: {
      color: '#90979c',
    },
    pageTextStyle: {
      color: '#fff',
    },
    pageIconColor: '#1890FF',
    formatter: function (name) {
      if (!notformatlegend) return formatMessage({ id: `reportCenter.qrcodehealth.${name}` });
      return name;
    },
    animation: true,
  };
  // todo 对于偏移次数 和偏移小车  这个数据要和在一起

  return { xAxis, series, legend };
};

// 根据原始数据 --处理robotId数据 横坐标是和 纵坐标yxisData是小车id
export const transformCodeData = (allData = {}, notformatlegend) => {
  const series = []; // 存放横坐标数值 是x 每个sery是每种key的求和(根据robotId)
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
      if (!notformatlegend) return formatMessage({ id: `reportCenter.qrcodehealth.${name}` });
      return name;
    },
    animation: true,
  };

  return { yAxis, series, legend };
};

//  拿到原始数据的 所有参数 所有根据robotId的参数求和
export const getOriginalDataBycode = (originalData) => {
  let currentAxisData = Object.values(originalData)[0] || [];
  currentAxisData = sortBy(currentAxisData, 'robotId');
  const firstTimeDataMap = new Map(); // 存放key 比如车次 偏移等
  const legendData = [];
  const yxisData = []; // 纵坐标 是y
  let currentCellIdData = {}; // 根据robotId 每个key 求和

  forIn(currentAxisData[0], (value, key) => {
    if (key !== 'robotId') {
      firstTimeDataMap.set(key, 0);
      legendData.push(key);
    }
  });

  currentAxisData.map(({ robotId }) => {
    yxisData.push(robotId);
    currentCellIdData[robotId] = {};
  });

  Object.values(originalData).forEach((record) => {
    record.forEach((item) => {
      const { robotId } = item;
      forIn(item, (value, key) => {
        if (firstTimeDataMap.has(key)) {
          let seryData = currentCellIdData[robotId][key] || 0;
          currentCellIdData[robotId][key] = seryData * 1 + value * 1;
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
