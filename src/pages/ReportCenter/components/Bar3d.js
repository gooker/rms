import React, { memo } from 'react';
import { unionBy, groupBy, indexOf } from 'lodash';
import ReactEcharts from './EchartsForReact';

const Bar3d = memo(function Line(props) {
  const { description, info } = props;
  const { descriptionKeys, descriptionValues } = description;
  const { data, style } = props;

  const getOption = () => {
    // const xAxis=[]
    //首先根据第一维度渲染x轴
    let legend = [];
    // const name=info[descriptionKeys[0]]
    const unionArray = unionBy(data, descriptionKeys[0]);
    const xAxis = unionArray.map((record) => {
      return record[descriptionKeys[0]];
    });
    // let color=['rgb(81, 107, 145)', 'rgb(89, 196, 230)', 'rgb(237, 175, 218)','rgb(105,191,255)','rgb(165, 231, 240)','rgb(235, 129, 70)']
    // if (descriptionKeys.length > 1) {//要求渲染二维数组
    //要对数据进行渲染
    const group = groupBy(data, (record) => {
      return record[descriptionKeys[1]];
    });
    for (const key in group) {
      if (group.hasOwnProperty(key)) {
        // const element = group[key];
        legend.push(key);
        //这里存在逻辑错误，数据后面要做修改
      }
    }

    const newData = data.map((record) => {
      const y = legend.indexOf(record[descriptionKeys[1]] + '');
      return [indexOf(xAxis, record[descriptionKeys[0]]), y, record[descriptionValues[0]]];
    });
    return {
      tooltip: {},
      visualMap: {
        max: 15,
        inRange: {
          color: [
            '#313695',
            '#4575b4',
            '#74add1',
            '#abd9e9',
            '#e0f3f8',
            '#ffffbf',
            '#fee090',
            '#fdae61',
            '#f46d43',
            '#d73027',
            '#a50026',
          ],
        },
      },
      xAxis3D: {
        name: info[descriptionKeys[0]],
        type: 'category',
        data: xAxis.map((record) => {
          return '' + record;
        }),
      },
      yAxis3D: {
        name: info[descriptionKeys[1]],
        type: 'category',
        data: legend.map((record) => {
          return '' + record;
        }),
      },
      zAxis3D: {
        type: 'value',
      },
      grid3D: {
        boxWidth: 350,
        boxDepth: 350,
        viewControl: {
          projection: 'orthographic',
        },
        light: {
          main: {
            intensity: 1.2,
            shadow: true,
          },
          ambient: {
            intensity: 0.2,
          },
        },
        // left:30,
        right: 100,
      },
      series: [
        {
          type: 'bar3D',
          data: newData,
          shading: 'lambert',

          label: {
            textStyle: {
              fontSize: 16,
              borderWidth: 1,
            },
          },

          emphasis: {
            label: {
              textStyle: {
                fontSize: 20,
                color: '#900',
              },
            },
            itemStyle: {
              color: '#900',
            },
          },
        },
      ],
    };
  };
  if (data.length > 0) {
    return <ReactEcharts notMerge lazyUpdate option={getOption()} style={style} />;
  } else {
    return null;
  }
});

export default Bar3d;
