import intl from 'react-intl-universal';
import { getDpr } from '@/utils/utils';

export const LineChartsAxisColor = 'rgb(189, 189, 189)';

const TrendLineColor = [
  '#f47721',
  '#0082fc',
  '#fff000',
  '#09b0d3',
  '#7ac143',
  '#f47a75',
  '#00c4ff',
  '#009db2',
  '#024b51',
  '#0780cf',
  '#a0ac48',
  '#22ed7c',
];

export const getAgvStatusMap = () => {
  return {
    Working: intl.formatMessage({ id: 'app.exhibition.agvState.working' }),
    StandBy: intl.formatMessage({ id: 'app.exhibition.agvState.standby' }),
    Charging: intl.formatMessage({ id: 'app.exhibition.agvState.charging' }),
    Offline: intl.formatMessage({ id: 'app.exhibition.agvState.offline' }),
    Connecting: intl.formatMessage({ id: 'app.exhibition.agvState.connecting' }),
    Error: intl.formatMessage({ id: 'app.exhibition.agvState.error' }),
  };
};

export const agvStateColor = {
  Working: '#2F8949',
  StandBy: '#0092FF',
  Charging: '#eba954',
  Offline: '#9E9E9E',
  Connecting: '#4DFCE1',
  Error: '#BA2F35',
};

export const getAgvPowerStateMap = () => {
  return {
    full: intl.formatMessage({ id: 'app.exhibition.agvPower.full' }),
    good: intl.formatMessage({ id: 'app.exhibition.agvPower.good' }),
    normal: intl.formatMessage({ id: 'app.exhibition.agvPower.normal' }),
    low: intl.formatMessage({ id: 'app.exhibition.agvPower.low' }),
    danger: intl.formatMessage({ id: 'app.exhibition.agvPower.danger' }),
  };
};

export const agvPowerStateColor = {
  full: '#2F8949',
  good: '#21b6b9',
  normal: '#0092ff',
  low: '#eba954',
  danger: '#d74e67',
};

// 任务实时
export function getTaskStatePieOption() {
  return {
    backgroundColor: 'rgba(35,43,46,0.3)',
    title: {
      text: intl.formatMessage({ id: 'app.exhibition.taskState.title' }),
      x: 'center',
      textStyle: {
        fontWeight: 'normal',
        color: 'orange',
        fontSize: 12 * getDpr(),
      },
    },
    legend: {
      bottom: '10%',
      itemGap: 20,
      textStyle: {
        color: '#FFFFFF',
        fontSize: 13 * getDpr(),
      },
      data: [
        intl.formatMessage({ id: 'app.exhibition.taskState.new' }),
        intl.formatMessage({ id: 'app.exhibition.taskState.excuting' }),
        intl.formatMessage({ id: 'app.exhibition.taskState.fail' }),
      ],
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    grid: {
      top: 25 * getDpr(),
      bottom: '20%',
      textStyle: {
        color: '#fff',
      },
    },
    xAxis: {
      show: false,
      type: 'value',
      // 轴线
      axisLine: {
        lineStyle: {
          color: LineChartsAxisColor,
        },
      },
      // 轴刻度标签
      axisLabel: {
        fontSize: 12 * getDpr(),
        interval: 0,
      },
      // 轴刻度线
      axisTick: {
        show: false,
      },
      // 轴刻度标签对应的分割线
      splitLine: {
        show: true,
        lineStyle: {
          width: 0.5,
          color: '#ECECEC',
          type: 'dotted',
          opacity: 0.7,
        },
      },
      splitArea: {
        show: false,
      },
    },
    yAxis: {},
    series: [],
  };
}

// 任务历史
export function getTaskTrendLineOption() {
  return {
    backgroundColor: 'rgba(35,43,46,0.3)',
    calculable: true,
    color: TrendLineColor,
    title: {
      text: intl.formatMessage({ id: 'app.exhibition.taskHistory.title' }),
      x: 'center',
      textStyle: {
        fontWeight: 'normal',
        color: 'orange',
        fontSize: 13 * getDpr(),
      },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        textStyle: {
          fontSize: 12 * getDpr(),
          color: '#fff',
        },
      },
    },
    legend: {
      top: `${100 + 1 * getDpr() - 27 * (1 / getDpr())}%`,
      textStyle: {
        color: '#ffffff',
        fontSize: 12 * getDpr(),
      },
    },
    grid: {
      left: '5%',
      right: '5%',
      top: 25 * getDpr(),
      bottom: `${27 * (1 / getDpr())}%`,
      containLabel: true,
      textStyle: {
        fontSize: 12 * getDpr(),
        color: '#fff',
      },
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: LineChartsAxisColor,
        },
      },
      axisLabel: {
        fontSize: 12 * getDpr(),
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
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        interval: 0,
        fontSize: 12 * getDpr(),
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
          color: '#ECECEC',
          type: 'dotted',
          opacity: 0.7,
        },
      },
      splitArea: {
        show: false,
      },
    },
    series: [],
  };
}

// 饼图
const radiusInner = 25;
const radiusOutside = 40;
const center = ['50%', '45%'];
export function getCarStatePieOption() {
  return {
    backgroundColor: 'rgba(35,43,46,0.3)',
    tooltip: {
      trigger: 'item',
      formatter: `{b}: {c}${intl.formatMessage({ id: 'app.exhibition.agv.unit' })}`,
    },
    title: {
      text: intl.formatMessage({ id: 'app.exhibition.agvState.title' }),
      x: 'center',
      textStyle: {
        fontWeight: 'normal',
        color: 'orange',
        fontSize: 12 * getDpr(),
      },
    },
    legend: {
      x: 'center',
      bottom: '3%',
      data: [
        intl.formatMessage({ id: 'app.exhibition.agvState.offline' }),
        intl.formatMessage({ id: 'app.exhibition.agvState.working' }),
        intl.formatMessage({ id: 'app.exhibition.agvState.standby' }),
        intl.formatMessage({ id: 'app.exhibition.agvState.charging' }),
        intl.formatMessage({ id: 'app.exhibition.agvState.error' }),
        intl.formatMessage({ id: 'app.exhibition.agvState.connecting' }),
      ],
      padding: [2, 4],
      itemWidth: 12 * getDpr(),
      itemHeight: 6 * getDpr(),
      formatter: ' {name}',
      textStyle: {
        fontSize: 12 * getDpr(),
        color: '#ffffff',
      },
    },
    series: [
      {
        name: intl.formatMessage({ id: 'app.exhibition.agvState.title' }),
        type: 'pie',
        radius: [`${radiusInner * getDpr()}%`, `${radiusOutside * getDpr()}%`],
        center,
        label: {
          normal: {
            fontSize: 12 * getDpr(),
            formatter: `{c}${intl.formatMessage({ id: 'app.exhibition.agv.unit' })}`,
          },
        },
        labelLine: {
          normal: {
            length: 2 * getDpr(),
          },
        },
        data: [
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvState.offline' }),
            value: 0,
            itemStyle: { color: agvStateColor.Offline },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvState.connecting' }),
            value: 0,
            itemStyle: { color: agvStateColor.Connecting },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvState.standby' }),
            value: 0,
            itemStyle: { color: agvStateColor.StandBy },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvState.working' }),
            value: 0,
            itemStyle: { color: agvStateColor.Working },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvState.charging' }),
            value: 0,
            itemStyle: { color: agvStateColor.Charging },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvState.error' }),
            value: 0,
            itemStyle: { color: agvStateColor.Error },
          },
        ],
      },
    ],
  };
}

export function getCarBatteryStatePieOption() {
  return {
    backgroundColor: 'rgba(35,43,46,0.3)',
    tooltip: {
      trigger: 'item',
      formatter: `{b}: {c}${intl.formatMessage({ id: 'app.exhibition.agv.unit' })}`,
    },
    title: {
      text: intl.formatMessage({ id: 'app.exhibition.agvPower.title' }),
      x: 'center',
      textStyle: {
        fontWeight: 'normal',
        color: 'orange',
        fontSize: 12 * getDpr(),
      },
    },
    legend: {
      x: 'center',
      bottom: '3%',
      data: [
        intl.formatMessage({ id: 'app.exhibition.agvPower.full' }),
        intl.formatMessage({ id: 'app.exhibition.agvPower.good' }),
        intl.formatMessage({ id: 'app.exhibition.agvPower.normal' }),
        intl.formatMessage({ id: 'app.exhibition.agvPower.low' }),
        intl.formatMessage({ id: 'app.exhibition.agvPower.danger' }),
      ],
      padding: [2, 5],
      itemWidth: 14 * getDpr(),
      itemHeight: 8 * getDpr(),
      formatter: ' {name}',
      textStyle: {
        color: '#ffffff',
        fontSize: 12 * getDpr(),
      },
    },
    series: [
      {
        name: intl.formatMessage({ id: 'app.exhibition.agvPower.title' }),
        type: 'pie',
        radius: [`${radiusInner * getDpr()}%`, `${radiusOutside * getDpr()}%`],
        center,
        labelLine: {
          normal: {
            length: 2 * getDpr(),
          },
        },
        label: {
          normal: {
            fontSize: 12 * getDpr(),
            formatter: `{c}${intl.formatMessage({ id: 'app.exhibition.agv.unit' })}`,
          },
        },
        data: [
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvPower.full' }),
            value: 0,
            itemStyle: { color: agvPowerStateColor.full },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvPower.good' }),
            value: 0,
            itemStyle: { color: agvPowerStateColor.good },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvPower.normal' }),
            value: 0,
            itemStyle: { color: agvPowerStateColor.normal },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvPower.low' }),
            value: 0,
            itemStyle: { color: agvPowerStateColor.low },
          },
          {
            name: intl.formatMessage({ id: 'app.exhibition.agvPower.danger' }),
            value: 0,
            itemStyle: { color: agvPowerStateColor.danger },
          },
        ],
      },
    ],
  };
}
