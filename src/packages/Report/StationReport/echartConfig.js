export const HistoryChartX = [
  '00:00',
  '01:00',
  '02:00',
  '03:00',
  '04:00',
  '05:00',
  '06:00',
  '07:00',
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
  '21:00',
  '22:00',
  '23:00',
];

function getChartTitleSize() {
  const { width } = document.getElementById('realTimeExecute').getBoundingClientRect();
  return width * 0.03;
}

export function getRealTimePieConfig(title) {
  return {
    series: [
      {
        name: title,
        type: 'pie',
        selectedMode: 'single',
        radius: ['50%', '70%'], // 将0改成50%，修改圆的内径
        clockwise: false,
        label: {
          normal: {
            position: 'outside', // 设置标签向外
            formatter: '{b}\n{c} ({d}%)', // 设置标签格式
          },
        },
        data: [],
      },
    ],
    graphic: getGraphic(title, 0),
  };
}

export function getHistoryTaskBarConfig() {
  return {
    title: {
      text: '历史任务',
      left: 'center',
      top: '3%',
    },
    tooltip: {
      trigger: 'axis',
      formatter: (params) => {
        const { data } = params[0];
        let nextHour = data.name.split(':')[0];
        nextHour = parseInt(nextHour, 10) + 1 + '';
        nextHour = `${nextHour.padStart(2, '0')}:00`;
        return `${data.name}~${nextHour}<br />${data.value}`;
      },
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    xAxis: {
      type: 'category',
      data: HistoryChartX,
    },
    yAxis: {
      type: 'value',
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
    series: [{ data: [], type: 'line' }],
  };
}

export function getGraphic(title, total) {
  return {
    // 添加原生图形元素组件
    elements: [
      {
        type: 'text', // 组件类型
        left: 'center', //定位
        top: '43%', // 定位
        style: {
          // 样式
          text: title, //文字
          fontSize: getChartTitleSize(), //文字大小
          textAlign: 'center', //定位
        },
      },
      {
        type: 'text',
        left: 'center',
        top: '52%',
        style: {
          text: total,
          fontSize: getChartTitleSize(),
          textAlign: 'center',
          fill: '#3BA5D9',
        },
      },
    ],
  };
}
