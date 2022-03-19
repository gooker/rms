import echarts from 'echarts';
import { convertToUserTimezone,formatMessage } from '@/utils/util';

export const LineChartsAxisColor = 'rgb(189, 189, 189)';
export const DataColor = '#0389ff';

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
  tooltip: {
    trigger: 'axis',
    formatter: '{c0}',
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
    left: '5%',
    right: '2%',
    containLabel: false,
  },
  xAxis: {
    boundaryGap: false,
    axisLine: {
      lineStyle: {
        color: LineChartsAxisColor,
      },
    },
    axisLabel: {
      fontSize: 12,
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
  },
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
  color: [DataColor],
  tooltip: {
    trigger: 'axis',
    formatter: '{c0}',
    axisPointer: {
      type: 'shadow',
      textStyle: {
        fontSize: 12,
        color: '#fff',
      },
    },
  },
  grid: {
    top: '8%',
    left: '5%',
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

export const covertData2ChartsData = (taskCountMap) => {
  const result = {};

  Object.keys(taskCountMap).forEach((dateTime) => {
    const localDateTime = convertToUserTimezone(`${dateTime}:00:00`).format('YYYY-MM-DD HH:mm');
    const time = localDateTime.split(' ')[1];
    result[time] = taskCountMap[dateTime];
  });

  // 横坐标
  const xAxisData = Object.keys(result).sort((a,b)=>a-b);
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

  // Series
  const series = [
    {
      type: 'line',
      symbolSize: 8,
      symbol: 'circle',
      areaStyle: {
        normal: {
          // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            {
              offset: 0,
              color: 'rgba(1,137,255,0.6)',
            },
            {
              offset: 0.34,
              color: 'rgba(1,137,255,0.3)',
            },
            {
              offset: 1,
              color: 'rgba(1,137,255,0.1)',
            },
          ]),
        },
      },
      itemStyle: { width: 3, normal: { color: DataColor } },
      data: [],
    },
  ];
  xAxisData.forEach((item) => {
    series[0].data.push(result[item]);
  });
  return { xAxis, series };
};

export const convertWaitingData2Chart = (waitingDataResponse) => {
  const workStationWaitingData = waitingDataResponse
    .map((item) => item.waitTime / 1000)
    .map((item) => item.toFixed(1))
    .reverse();

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
  const series = [
    {
      type: 'bar',
      lineStyle: {
        width: 3,
      },
      itemStyle: {
        normal: {
          // 颜色渐变函数 前四个参数分别表示四个位置依次为左、下、右、上
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            {
              offset: 0,
              color: 'rgba(1,137,255,0.3)',
            },
            {
              offset: 0.5,
              color: 'rgba(1,137,255,0.5)',
            },
            {
              offset: 1,
              color: 'rgba(1,137,255,0.9)',
            },
          ]),
        },
      },
      data: workStationWaitingData,
    },
  ];
  return { xAxis, series };
};
