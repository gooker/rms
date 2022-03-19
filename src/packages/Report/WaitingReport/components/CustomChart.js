import React, { PureComponent } from 'react';
import { Chart, Geom, Axis, Tooltip } from 'bizcharts';
import styles from '../../TaskReport/TaskKpi.module.less';

export default class CustomChart extends PureComponent {
  render() {
    const { title, subTitle, detail, formator, action } = this.props;
    const intervalWidth = detail.length <= 3 ? { size: 40 } : { size: 260 / detail.length };
    const hasGroup = detail[0] && detail[0].group; // 图表是否有分组
    const color = hasGroup ? { color: 'group' } : {}; // 图表存在分组情况下对组元素进行颜色标记
    const ToolTipConfig = hasGroup
      ? [
          'group*value',
          (name, value) => ({
            name: formator ? `${name}: [ ${formator(value)} ]` : `${name}: ${value}`,
          }),
        ]
      : ['target*value', (name, value) => ({ name: formator ? formator(value) : value })];
    return (
      <div className={styles.chartsItem}>
        <div className={styles.chartTitle}>{title}</div>
        <div className={styles.chartDetail}>
          <div className={styles.chartDetailTitle} style={{ marginTop: '24px' }}>
            {subTitle}
          </div>
          <div className={styles.chartDetail}>
            <Chart
              forceFit
              height={400}
              data={detail}
              padding={{ top: 20, right: 50, bottom: 60, left: 50 }}
              onIntervalClick={(ev) => {
                action && action(ev.data);
              }}
            >
              <Axis name="target" />
              <Axis name="value" />
              <Tooltip />
              <Geom
                type="interval"
                position="target*value"
                tooltip={ToolTipConfig}
                {...intervalWidth}
                {...color}
                adjust={[
                  {
                    type: 'dodge',
                    marginRatio: 1 / 32,
                  },
                ]}
              />
            </Chart>
          </div>
        </div>
      </div>
    );
  }
}
