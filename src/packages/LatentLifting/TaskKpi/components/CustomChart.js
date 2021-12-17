import React, { PureComponent } from 'react';
import { Divider } from 'antd';
import { Chart, Geom, Axis, Tooltip, Legend } from 'bizcharts';
import { formatMessage } from '@/utils/utils';
import Enum from '../enum';
import styles from '../TaskKpi.module.less';

/**
 HourFlag == true    横坐标是目标点
 HourFlag != true && TaskType == 'ALL'   横坐标是任务类型
 HourFlag !=true && TaskType != 'ALL'    横坐标是目标点
 */
export default class CustomChart extends PureComponent {
  render() {
    const subTitleMap = {
      HOUR_BASE: formatMessage({ id: 'app.report.baseHour' }),
      TASK_TYPE_BASE: formatMessage({ id: 'app.report.baseTaskType' }),
      TARGET_CELL_BASE: formatMessage({ id: 'app.report.baseTarget' }),
    };
    const { title, subTitle, detail, overview, chartMode, formator } = this.props;
    const hasGroup = detail[0] && detail[0].group; // 图表是否有分组
    const hasLegend = subTitle === subTitleMap[Enum.targetCellBase]; // 只对 按目标点 情况下加 Legend
    const hasOverview = chartMode !== 'compare'; // 图表是否显示总览部分
    // 对包含 group 或者 目标点 进行标记
    const color = hasGroup ? { color: 'group' } : hasLegend ? { color: 'target' } : {};
    const IntervalWidth = detail.length <= 3 ? { size: 40 } : { size: 260 / detail.length };
    const ChartHeight = hasOverview ? 245 : 350;
    const ToolTipConfig = hasGroup
      ? [
          'group*value',
          (name, value) => ({
            name: formator ? `${name}: [ ${formator(value)} ]` : `${name}: ${value}`,
          }),
        ]
      : ['target*value', (name, value) => ({ name: formator ? formator(value) : value })];
    const ChartPadding = hasLegend
      ? { top: 20, right: 50, bottom: 100, left: 50 }
      : { top: 20, right: 50, bottom: 60, left: 50 };

    return (
      <div className={styles.chartsItem}>
        <div className={styles.chartTitle}>{title}</div>
        {hasOverview && (
          <>
            <div className={styles.chartOverview}>
              <div className={styles.chartOverviewTitle}>
                {formatMessage({ id: 'app.report.summary' })}
              </div>
              <div className={styles.chartOverviewValue}>{overview}</div>
            </div>
            <div className={styles.chartsDivider}>
              <Divider />
            </div>
          </>
        )}
        <div className={styles.chartDetailTitle} style={hasOverview ? {} : { marginTop: '24px' }}>
          {subTitle}
        </div>
        <div className={styles.chartDetail}>
          <Chart data={detail} padding={ChartPadding} height={ChartHeight} forceFit={true}>
            <Axis name="target" />
            <Axis name="value" />
            <Tooltip />
            {hasLegend && <Legend />}
            <Geom
              type="interval"
              position="target*value"
              tooltip={ToolTipConfig}
              {...IntervalWidth}
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
    );
  }
}
