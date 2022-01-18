import React, { memo } from 'react';
import { unionBy, groupBy } from 'lodash';
import { connect } from '@/utils/RcsDva';
import ReactEcharts from './EchartsForReact';
import { formatMessage, match } from '@/utils/utils';

const Line = (props) => {
  const { description, type, info, agvType, allTaskTypes } = props;
  const { descriptionKeys, descriptionValues } = description;
  const { data, style } = props;

  const getOption = () => {
    //首先根据第一维度渲染x轴
    let series = [];
    let legend = [];
    const name = info[descriptionKeys[0]];
    const unionArray = unionBy(data, descriptionKeys[0]);
    const xAxis = unionArray.map((record) => {
      return record[descriptionKeys[0]];
    });
    if (descriptionKeys.length > 1) {
      //要求渲染二维数组
      //要对数据进行渲染
      const group = groupBy(data, (record) => record[descriptionKeys[1]]);
      Object.keys(group).forEach((key) => {
        const element = group[key];
        legend.push(key);
        series.push({
          name: key,
          type: type,
          data: match(xAxis, element, descriptionKeys[0], descriptionValues[0]),
          smooth: true,
          stack: '总量',
          itemStyle: {
            normal: {},
          },
        });
      });
    } else {
      //一维数组,基本可以直接展示
      legend = data.map((record) => record[descriptionKeys[0]]);
      series = [
        {
          name: descriptionKeys[0],
          type: type,
          data: match(xAxis, data, descriptionKeys[0], descriptionValues[0]),
          smooth: true,
        },
      ];
    }
    let boundaryGap = true;
    if (type === 'line') {
      boundaryGap = false;
    }
    return {
      width: '86%',
      title: {
        subtext: '',
        x: 'center',
        textStyle: {
          color: '#333',
          fontSize: '18',
        },
        subtextStyle: {
          color: '#90979c',
          fontSize: '16',
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross', // shadow
          crossStyle: {
            color: '#999',
          },
          animation: false,
          label: {
            backgroundColor: '#0D4286',
          },
        },
      },
      toolbox: {
        right: '48px',
        feature: {
          dataView: { show: true, readOnly: false },
          magicType: { show: true, type: ['line', 'bar'] },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100,
          zoomLock: true, // 控制触屏缩放效果
          xAxisIndex: 0,
        },
        {
          start: 0,
          end: 100,
          handleSize: '80%',
          handleStyle: {
            color: '#fff',
            shadowBlur: 3,
            shadowColor: 'rgba(0, 0, 0, 0.6)',
            shadowOffsetX: 2,
            shadowOffsetY: 2,
          },
          textStyle: {
            color: '#ccc',
          },
          bottom: 20,
          borderColor: '#ffffff',
          dataBackgroundColor: 'rgba(255,255,255,0.3)',
          handleIcon:
            'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        },
      ],
      legend: {
        x: 'right',
        orient: 'vertical',
        type: 'scroll',
        textStyle: {
          color: '#90979c',
        },
        top: '8%',
        bottom: '15%',
        pageTextStyle: {
          color: '#fff',
        },
        pageIconColor: '#1890FF',
        animation: true,
        data: legend,
        formatter: function (name) {
          if (allTaskTypes?.[agvType]?.[name]) {
            return allTaskTypes[agvType][name];
          }
          const Legend = info[descriptionKeys[1]];
          return Legend + '  ' + name;
        },
      },
      calculable: true,
      grid: {
        borderWidth: 0,
        left: 50,
        bottom: 50,
        textStyle: {
          color: '#333',
        },
      },
      xAxis: [
        {
          name: name,
          type: 'category',
          position: 'bottom',
          boundaryGap: boundaryGap,
          axisLine: {
            lineStyle: {
              color: '#90979c',
            },
          },
          axisTick: {
            // x坐标轴刻度
            show: true,
            alignWithLabel: true,
          },
          axisPointer: { type: 'shadow' },
          splitLine: { show: false },
          splitArea: { show: false },
          data: xAxis,
        },
      ],
      yAxis: [
        {
          type: 'value',
          name: formatMessage({ id: 'app.reportCenter.reportCount' }),
          position: 'left',
          min: 0,
          boundaryGap: false,
          axisLine: {
            // 轴线
            show: true,
            lineStyle: {
              color: '#90979c',
              type: 'solid',
              width: 1,
            },
          },
          axisTick: {
            // 轴标记
            show: true,
            length: 5,
            lineStyle: {
              color: '#90979c',
              type: 'solid',
              width: 1,
            },
          },
          axisLabel: {
            // Y轴左
            show: true,
            interval: 'auto',
            textStyle: {
              color: '#90979c',
              fontFamily: 'verdana',
              fontSize: 10,
              fontStyle: 'normal',
            },
          },
          splitLine: {
            // 横轴分割线
            show: true,
            lineStyle: {
              color: 'rgba(204,204,204,0.42)',
              type: 'dotted',
              width: 1,
            },
          },
          splitArea: { show: false },
        },
      ],
      series: series,
    };
  };

  if (data.length > 0) {
    return <ReactEcharts notMerge lazyUpdate option={getOption()} style={style} />;
  } else {
    return null;
  }
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(Line));
