import { formatMessage, isStrictNull } from '@/utils/util';
import { forIn } from 'lodash';
import { filterNewXAixsTime, getNewKey } from './reportUtil';

export const LineChartsAxisColor = 'rgb(189, 189, 189)';
export const DataColor = '#0389ff';
export const timesColor = ['#1890ff', '#0389ff'];
export const labelColor = '#564d4d';
export const titleColor = 'rgb(77, 76, 76)';

// Series
export const labelOption = {
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

export const commonOption = {
  type: 'bar',
  stack: '11',
  barMaxWidth: 60,
  label: labelOption,
  emphasis: {
    focus: 'series',
    lable: {
      show: true,
    },
  },
};

export const noDataGragraphic = (invisible) => {
  return {
    graphic: [
      {
        type: 'text',
        left: 'center',
        top: 'middle',
        silent: true,
        invisible,
        style: {
          fill: '#605e5e',
          text: formatMessage({ id: 'reportCenter.noData' }),
          fontWeight: 'bold',
          font: '16px Microsoft YaHei',
        },
      },
    ],
  };
};

export const dateHistoryLineOption = (title, keyMap = {}) => ({
  title: {
    text: `${title}(${formatMessage({
      id: 'reportCenter.way.date',
    })})`,
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
    formatter: (params) => {
      const name = params[0]?.axisValue;
      var showHtm = name + '<br>';
      params.map(({ marker, value, seriesName, index }) => {
        showHtm += marker + keyMap[seriesName] + '：' + value + '<br>';
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
    // {
    //   start: 0,
    //   end: 100,
    //   handleIcon:
    //     'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
    //   handleSize: '80%',
    //   handleStyle: {
    //     color: '#fff',
    //     shadowBlur: 3,
    //     shadowColor: 'rgba(0, 0, 0, 0.6)',
    //     shadowOffsetX: 2,
    //     shadowOffsetY: 2,
    //   },
    // },
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

export const codeHistoryLineOption = (title, keyMap = {}) => ({
  title: {
    text: `${title}`,
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
    formatter: (params) => {
      const name = params[0]?.axisValue;
      var showHtml = name + '<br>';
      params.map(({ marker, value, seriesName, index }) => {
        showHtml += marker + keyMap[seriesName] + '：' + value + '<br>';
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

// 根据原始数据 --处理日期数据(x轴：日期)
/*
 *根据原始数据 --x日期数据- 数值:任务时长 状态时长
 *@param allData-源数据
 *@param translate-报表的legend {key:value}
 @param  timeType--(x轴：日期) 显示是按日/月/小时
 */
export const generateTimeData = (allData, translate, timeType = 'hour') => {
  const keyDataMap = new Map(); // 存放key 比如车次 偏移等等的求和
  let legendData = [];
  if (Array.isArray(translate)) {
    legendData = [...translate];
  } else {
    legendData = Object.keys(translate);
  }

  legendData.map((item) => {
    keyDataMap.set(item, 0);
  });
  const series = []; // 存放纵坐标数值
  const xAxisData = filterNewXAixsTime(allData, timeType);

  let keyResult = {}; //
  xAxisData.map((item) => {
    keyResult[item] = {};
  });

  Object.entries(allData).forEach(([key, typeData]) => {
    if (!isStrictNull(typeData)) {
      const idKey = getNewKey(key, timeType);
      typeData.forEach((record) => {
        forIn(record, (value, parameter) => {
          if (legendData.includes(parameter)) {
            const _value = isStrictNull(value) ? 0 : value;
            const existValue = keyResult[idKey][parameter] || 0;
            keyResult[idKey][parameter] = existValue * 1 + _value * 1;
          }
        });
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
      color: labelColor,
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
    top: '8%',
    bottom: '15%',
    pageIconColor: '#1890FF',
    formatter: function (name) {
      return translate[name];
    },
    animation: true,
  };
  return { xAxis, series, legend };
};

/*
 * idName- 是cellId或者agvId
 *根据原始数据 --处理idName数据(y轴) 横坐标是key的sum
 *translate-是翻译{key:value}
 *
 */
export const transformCodeData = (allData = {}, translate, idName = 'cellId') => {
  const series = []; // 存放横坐标数值 是x 每个sery是每种key的求和(根据cellId)
  const { legendData, yxisData, currentSery } = getOriginalDataBycode(allData, translate, idName);

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
      color: labelColor,
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
      return translate[name];
    },
    animation: true,
  };

  return { yAxis, series, legend };
};

/**拿到原始数据的 所有参数 所有根据cellId/agvId的参数求和
 * @param {*} originalData 数据
 * *@param {*} translate 报表所有的key和对应的翻译 {key:value}
 * *@param {*} idName 根据id求合 可以是cellId/vehicleId
 * */
export const getOriginalDataBycode = (originalData, translate, idName) => {
  let keyDataMap = new Map(); // 存放key 比如车次 偏移等的求和
  let legendData = []; // 存放key
  const yxisData = getAllCellId(originalData, idName); // 纵坐标 是y
  let currentCellIdData = {}; // 根据cellId 每个key 求和

  if (Array.isArray(translate)) {
    legendData = [...translate];
  } else {
    legendData = Object.keys(translate);
  }

  legendData.map((item) => {
    keyDataMap.set(item, 0);
  });

  yxisData.map((item) => {
    currentCellIdData[item] = {};
  });

  Object.values(originalData).forEach((record) => {
    record.forEach((item) => {
      const id = item[idName];
      forIn(item, (value, key) => {
        if (keyDataMap.has(key)) {
          let seryData = currentCellIdData[id][key] || 0;
          currentCellIdData[id][key] = seryData * 1 + value * 1;
        }
      });
    });
  });

  const currentSery = {};
  Object.entries(currentCellIdData).forEach(([_, v]) => {
    legendData.map((key) => {
      const _value = v[key] || 0;
      let seryData = currentSery[key] || [];
      currentSery[key] = [...seryData, _value];
    });
  });
  return { legendData, yxisData, currentSery, commonOption };
};

/*获取数据里所有的cellId/vehicleId;*/
export const getAllCellId = (originalData, key) => {
  const result = new Set();
  Object.values(originalData).forEach((record) => {
    record?.forEach((item) => {
      result.add(item[key]);
    });
  });
  // 重要！！不排序 数据会乱掉 这样Id的轴是顺序的 对应的seriy也是顺序的
  return [...result].sort((a, b) => a - b);
};

// 日期排序
export const getDatBysortTime = (loadData) => {
  const currentNewLoadTime = Object.keys(loadData).sort((a, b) => (a >= b ? 1 : -1));
  const newLoadData = {};
  currentNewLoadTime.map((t) => {
    newLoadData[t] = loadData[t];
  });
  return newLoadData;
};
