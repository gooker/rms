import React, { PureComponent } from 'react';
import { groupBy, forIn, sumBy, orderBy } from 'lodash';
import { connect } from '@/utils/dva';

import ReactEcharts from './EchartsForReact';

@connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))
class ReportForEcharts extends PureComponent {
  groupSum = (data, descriptionKey, descriptionValue, fun) => {
    const newData = groupBy(data, descriptionKey);
    let result = [];
    forIn(newData, (value, key) => {
      result.push({
        name: value[0][descriptionKey],
        value: sumBy(value, (record) => {
          return record[descriptionValue];
        }),
      });
      if (fun) {
        fun(value, key);
      }
      return key;
    });
    result = orderBy(result, (record) => {
      return record.value;
    });
    return result;
  };

  getData = () => {
    const { data, description } = this.props;
    const { descriptionKeys, descriptionValues } = description;
    const result = {};
    const legendData = [];
    const selected = {};

    const seriesData = this.groupSum(data, descriptionKeys[0], descriptionValues[0], (value) => {
      legendData.push(value[0][descriptionKeys[0]]);
    });

    for (let index = 0; index < seriesData.length; index++) {
      const element = seriesData[index];
      selected[element.name] = index >= seriesData.length - 10;
    }
    result.legendData = legendData;
    result.seriesData = seriesData;
    result.selected = selected;
    return result;
  };

  getData2 = () => {
    const { data, description } = this.props;
    const { descriptionKeys, descriptionValues } = description;
    const result = {};
    const legendData = [];
    const seriesData = this.groupSum(data, descriptionKeys[1], descriptionValues[0], (value) => {
      legendData.push(value[0][descriptionKeys[1]]);
    });
    result.legendData = legendData;
    result.seriesData = seriesData;
    return result;
  };

  getSeries = () => {
    const { description } = this.props;
    const { descriptionKeys } = description;

    if (descriptionKeys.length === 1) {
      //如果是一个维度
      const data = this.getData();
      return [
        {
          name: descriptionKeys[0],
          type: 'pie',
          roseType: 'radius',
          radius: ['10%', '65%'],
          center: ['40%', '48%'],
          labelLine: {
            normal: {
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
          },
          itemStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 50,
            },
          },
          data: data.seriesData,
        },
      ];
    } else {
      //如果是俩个维度，先处理数据
      const data = this.getData();
      const data2 = this.getData2();

      return [
        {
          name: descriptionKeys[1],
          type: 'pie',
          radius: ['5%%', '40%'],
          center: ['50%', '55%'],
          label: {
            normal: {
              position: 'inner',
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          itemStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 50,
            },
          },
          data: data2.seriesData,
        },
        {
          name: descriptionKeys[0],
          type: 'pie',
          radius: ['50%', '90%'],
          center: ['50%', '55%'],
          labelLine: {
            normal: {
              smooth: 0.2,
              length: 10,
              length2: 20,
            },
          },
          itemStyle: {
            normal: {
              shadowColor: 'rgba(0, 0, 0, 0.2)',
              shadowBlur: 50,
            },
          },
          data: data.seriesData,
        },
      ];
    }
  };

  getOption = () => {
    //维度and值 报表类型 报表标题
    const { description, info, agvType, allTaskTypes } = this.props;
    const { descriptionKeys } = description;

    const data = this.getData();

    return {
      title: {
        x: 'center',
        textStyle: {
          fontSize: '18',
        },
        subtextStyle: {
          color: '#90979c',
          fontSize: '16',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)',
      },
      calculable: true,
      toolbox: {
        show: true,
        right: '48px',
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true },
        },
      },
      legend: {
        orient: 'vertical',
        type: 'scroll',
        x: 'right',
        top: '8%',
        textStyle: {
          color: '#90979c',
        },
        pageTextStyle: {
          color: '#fff',
        },
        pageIconColor: '#1890FF',
        animation: true,
        data: data.legendData,
        selected: data.selected,
        formatter: function (name) {
          if (allTaskTypes?.[agvType]?.[name]) {
            return allTaskTypes[agvType][name];
          }
          const Legend = info[descriptionKeys[0]];
          return Legend + '  ' + name;
        },
      },
      series: this.getSeries(),
    };
  };

  render() {
    const { data, style } = this.props;
    return (
      <div>
        {data.length > 0 ? (
          <ReactEcharts notMerge lazyUpdate option={this.getOption()} style={style} />
        ) : null}
      </div>
    );
  }
}
export default ReportForEcharts;
