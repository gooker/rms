import React, { Component } from 'react';
import echarts from 'echarts';
import { throttle, find } from 'lodash';
import { message } from 'antd';
import { dealResponse, formatMessage, isNull } from '@/utils/utils';
import StationKpiSearchForm from './StationKpiSearchForm';
import {
  getRegionReport,
  getAllMonitorRegion,
  getRegionRealtimeReport,
} from '@/services/latentLifting';
import {
  getGraphic,
  HistoryChartX,
  getRealTimePieConfig,
  getHistoryTaskBarConfig,
} from './echartConfig';
import commonStyles from '@/common.module.less';
import styles from './StationKpi.module.less';

class StationKpi extends Component {
  executeChartDatasource = [];
  waitChartDatasource = [];

  state = {
    historyLoading: false,
    realTimeLoading: false,
    regionList: [],
  };

  async componentDidMount() {
    const allRegion = await getAllMonitorRegion();
    if (
      !dealResponse(
        allRegion,
        false,
        null,
        formatMessage({ id: 'app.taskDispatch.fetchConfigError' }),
      )
    ) {
      this.setState({ regionList: allRegion });
    }

    // 初始化执行队列echarts图表对象
    this.realTimeExecuteChart = echarts.init(document.getElementById('realTimeExecute'));
    this.realTimeExecuteChart.setOption(
      getRealTimePieConfig(formatMessage({ id: 'app.activity.TaskExecuting' })),
    );

    // 初始化等待队列echarts图表对象
    this.realTimeWaitingChart = echarts.init(document.getElementById('realTimeWaiting'));
    this.realTimeWaitingChart.setOption(
      getRealTimePieConfig(formatMessage({ id: 'app.activity.TaskNew' })),
    );

    // 初始化历史任务echarts图表对象
    this.historyTaskChart = echarts.init(document.getElementById('historyTask'));
    this.historyTaskChart.setOption(
      getHistoryTaskBarConfig(formatMessage({ id: 'app.taskDetail.taskHistory' })),
    );

    this.refreshRealTimeCharts();

    // 绑定 Resize 事件
    this.myObserver = new ResizeObserver(throttle(this.updateDimensions), 500);
    this.myObserver.observe(document.body);
  }

  componentWillUnmount() {
    // 销毁图表实例
    this.realTimeExecuteChart.dispose();
    this.realTimeWaitingChart.dispose();
    this.historyTaskChart.dispose();

    // 销毁Observer
    this.myObserver.disconnect();
    this.myObserver = null;
  }

  updateDimensions = () => {
    this.realTimeExecuteChart.resize();
    this.realTimeWaitingChart.resize();
    this.historyTaskChart.resize();

    //  刷新图表文字大小
    const realTimeExecuteOption = this.realTimeExecuteChart.getOption();
    realTimeExecuteOption.graphic = getGraphic(
      formatMessage({ id: 'app.activity.TaskExecuting' }),
      this.executeChartDatasource.reduce((pre, next) => pre + next.value, 0),
    );
    this.realTimeExecuteChart.setOption(realTimeExecuteOption, true);

    const realTimeWaitingOption = this.realTimeWaitingChart.getOption();
    realTimeWaitingOption.graphic = getGraphic(
      formatMessage({ id: 'app.activity.TaskNew' }),
      this.waitChartDatasource.reduce((pre, next) => pre + next.value, 0),
    );
    this.realTimeWaitingChart.setOption(realTimeWaitingOption, true);
  };

  refreshRealTimeCharts = async (params) => {
    this.setState({ realTimeLoading: true });
    const data = await getRegionRealtimeReport(params);
    if (dealResponse(data) || isNull(data)) {
      this.setState({ realTimeLoading: false });
      message.error(formatMessage({ id: 'app.regionReport.tip.fetchRealtimeFailed' }));
      return;
    }

    // 执行队列图表数据
    this.executeChartDatasource = [];
    if (data.executing) {
      Object.keys(data.executing).forEach((item) => {
        this.executeChartDatasource.push({ name: item, value: data.executing[item] });
      });
    }
    const realTimeExecuteOption = this.realTimeExecuteChart.getOption();
    realTimeExecuteOption.series[0].data = this.executeChartDatasource;
    realTimeExecuteOption.graphic = getGraphic(
      formatMessage({ id: 'app.activity.TaskExecuting' }),
      this.executeChartDatasource.reduce((pre, next) => pre + next.value, 0),
    );
    this.realTimeExecuteChart.setOption(realTimeExecuteOption, true);

    // 等待队列图表数据
    this.waitChartDatasource = [];
    if (data.waiting) {
      Object.keys(data.waiting).forEach((item) => {
        this.waitChartDatasource.push({ name: item, value: data.waiting[item] });
      });
    }
    const realTimeWaitingOption = this.realTimeWaitingChart.getOption();
    realTimeWaitingOption.series[0].data = this.waitChartDatasource;
    realTimeWaitingOption.graphic = getGraphic(
      formatMessage({ id: 'app.activity.TaskNew' }),
      this.waitChartDatasource.reduce((pre, next) => pre + next.value, 0),
    );
    this.realTimeWaitingChart.setOption(realTimeWaitingOption, true);
    this.setState({ realTimeLoading: false });
  };

  refreshHistoryCharts = async (params) => {
    this.setState({ historyLoading: true });
    const data = await getRegionReport(params);
    if (dealResponse(data) || isNull(data)) {
      this.setState({ historyLoading: false });
      message.error(formatMessage({ id: 'app.regionReport.tip.fetchRegionReportFailed' }));
      return;
    }
    const dataSource = HistoryChartX.map((item) => ({ name: item, value: 0 }));
    Object.keys(data).forEach((dataKey) => {
      const [startHour] = dataKey.split('-');
      const name = HistoryChartX[parseInt(startHour)];
      const dataSourceItem = find(dataSource, { name });
      dataSourceItem.value = data[dataKey];
    });
    const historyTaskChartOption = this.historyTaskChart.getOption();
    historyTaskChartOption.series[0].data = dataSource;
    this.historyTaskChart.setOption(historyTaskChartOption, true);
    this.setState({ historyLoading: false });
  };

  render() {
    const { historyLoading, realTimeLoading, regionList } = this.state;
    return (
      <div className={commonStyles.tablePageWrapper}>
        <StationKpiSearchForm
          regionList={regionList}
          historyLoading={historyLoading}
          realTimeLoading={realTimeLoading}
          refreshHistoryCharts={this.refreshHistoryCharts}
          refreshRealTimeCharts={this.refreshRealTimeCharts}
        />
        <div className={styles.charts}>
          <div style={{ flex: 1, display: 'flex', margin: '5px 0' }}>
            <div className={styles.realTimeChart} id={'realTimeExecute'} />
            <div style={{ width: 5 }} />
            <div className={styles.realTimeChart} id={'realTimeWaiting'} />
          </div>
          <div className={styles.historyChartBlock} id={'historyTask'} />
        </div>
      </div>
    );
  }
}
export default StationKpi;
