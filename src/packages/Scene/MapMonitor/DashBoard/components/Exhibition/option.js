import { formatMessage, getDpr } from '@/utils/util';
import Dictionary from '@/utils/Dictionary';
import { VehicleStateColor } from '@/config/consts';

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

export const getVehicleStatusMap = () => {
  return {
    Working: formatMessage({ id: Dictionary('vehicleStatus', 'Working') }),
    StandBy: formatMessage({ id: Dictionary('vehicleStatus', 'StandBy') }),
    Charging: formatMessage({ id: Dictionary('vehicleStatus', 'Charging') }),
    Offline: formatMessage({ id: Dictionary('vehicleStatus', 'Offline') }),
    Connecting: formatMessage({ id: Dictionary('vehicleStatus', 'Connecting') }),
    Error: formatMessage({ id: Dictionary('vehicleStatus', 'Error') }),
  };
};

export const vehicleStateColor = {
  ...VehicleStateColor,
};

export const getVehiclePowerStateMap = () => {
  return {
    full: formatMessage({ id: 'app.battery.full' }),
    good: formatMessage({ id: 'app.battery.good' }),
    normal: formatMessage({ id: 'app.battery.normal' }),
    low: formatMessage({ id: 'app.battery.low' }),
    danger: formatMessage({ id: 'app.battery.danger' }),
  };
};

export const vehiclePowerStateColor = {
  full: '#2F8949',
  good: '#21b6b9',
  normal: '#0092ff',
  low: '#eba954',
  danger: '#d74e67',
};

// 任务实时
export function getTaskStatePieOption() {
  return {
    title: {
      text: formatMessage({ id: 'monitor.exhibition.taskState' }),
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
        formatMessage({ id: 'app.task.state.New' }),
        formatMessage({ id: 'app.task.state.Executing' }),
        formatMessage({ id: 'app.task.state.Error' }),
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
    calculable: true,
    color: TrendLineColor,
    title: {
      text: formatMessage({ id: 'monitor.exhibition.taskHistory' }),
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
    tooltip: {
      trigger: 'item',
      formatter: `{b}: {c}${formatMessage({ id: 'monitor.workstation.label.piece' })}`,
    },
    title: {
      text: formatMessage({ id: 'customTask.form.isPathWithPod' }),
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
        formatMessage({ id: 'vehicleState.Offline' }),
        formatMessage({ id: 'vehicleState.Working' }),
        formatMessage({ id: 'vehicleState.StandBy' }),
        formatMessage({ id: 'vehicleState.Charging' }),
        formatMessage({ id: 'vehicleState.Error' }),
        formatMessage({ id: 'vehicleState.Connecting' }),
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
        name: formatMessage({ id: 'customTask.form.isPathWithPod' }),
        type: 'pie',
        radius: [`${radiusInner * getDpr()}%`, `${radiusOutside * getDpr()}%`],
        center,
        label: {
          normal: {
            fontSize: 12 * getDpr(),
            formatter: `{c}${formatMessage({ id: 'monitor.workstation.label.piece' })}`,
          },
        },
        labelLine: {
          normal: {
            length: 2 * getDpr(),
          },
        },
        data: [
          {
            name: formatMessage({ id: 'vehicleState.Offline' }),
            value: 0,
            itemStyle: { color: vehicleStateColor.Offline },
          },
          {
            name: formatMessage({ id: 'vehicleState.Connecting' }),
            value: 0,
            itemStyle: { color: vehicleStateColor.Connecting },
          },
          {
            name: formatMessage({ id: 'vehicleState.StandBy' }),
            value: 0,
            itemStyle: { color: vehicleStateColor.StandBy },
          },
          {
            name: formatMessage({ id: 'vehicleState.Working' }),
            value: 0,
            itemStyle: { color: vehicleStateColor.Working },
          },
          {
            name: formatMessage({ id: 'vehicleState.Charging' }),
            value: 0,
            itemStyle: { color: vehicleStateColor.Charging },
          },
          {
            name: formatMessage({ id: 'vehicleState.Error' }),
            value: 0,
            itemStyle: { color: vehicleStateColor.Error },
          },
        ],
      },
    ],
  };
}

export function getCarBatteryStatePieOption() {
  return {
    tooltip: {
      trigger: 'item',
      formatter: `{b}: {c}${formatMessage({ id: 'monitor.workstation.label.piece' })}`,
    },
    title: {
      text: formatMessage({ id: 'monitor.exhibition.vehiclePower' }),
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
        formatMessage({ id: 'app.battery.full' }),
        formatMessage({ id: 'app.battery.good' }),
        formatMessage({ id: 'app.battery.normal' }),
        formatMessage({ id: 'app.battery.low' }),
        formatMessage({ id: 'app.battery.danger' }),
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
        name: formatMessage({ id: 'monitor.exhibition.vehiclePower' }),
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
            formatter: `{c}${formatMessage({ id: 'monitor.workstation.label.piece' })}`,
          },
        },
        data: [
          {
            name: formatMessage({ id: 'app.battery.full' }),
            value: 0,
            itemStyle: { color: vehiclePowerStateColor.full },
          },
          {
            name: formatMessage({ id: 'app.battery.good' }),
            value: 0,
            itemStyle: { color: vehiclePowerStateColor.good },
          },
          {
            name: formatMessage({ id: 'app.battery.normal' }),
            value: 0,
            itemStyle: { color: vehiclePowerStateColor.normal },
          },
          {
            name: formatMessage({ id: 'app.battery.low' }),
            value: 0,
            itemStyle: { color: vehiclePowerStateColor.low },
          },
          {
            name: formatMessage({ id: 'app.battery.danger' }),
            value: 0,
            itemStyle: { color: vehiclePowerStateColor.danger },
          },
        ],
      },
    ],
  };
}
