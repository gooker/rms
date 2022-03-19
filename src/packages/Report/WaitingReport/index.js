import React, { Component } from 'react';
import { message, Radio, Row, Col } from 'antd';
import CustomChart from './components/CustomChart';
import SearchConditionForm from './components/SearchConditionForm';
import GanttModal from './components/GanttModal';
import { convertWaitingToChartVM, transformTime } from './utils';
import { fetchWaitingKpiView } from '@/services/latentLifting';
import styles from './WaitingKpi.module.less';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const gridLayout = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 6,
};

export default class Index extends Component {
  state = {
    isBaseHour: true,
    viewMode: 'detail',
    ganttVisible: false,
    searchLoading: false,
    originalChartsData: null,

    // Charts VN
    averageWaitTime: { overview: 0, data: [] }, // 平均空等时间
    allWaitTime: { overview: 0, data: [] }, // 总的空等时间
    mixWaitTime: { overview: 0, data: [] }, // 最短空等时间
    maxWaitTime: { overview: 0, data: [] }, // 最长空等时间
    secondWaitTime: { overview: 0, data: [] }, // 第二长空等时间
  };

  getChartsData = async (value) => {
    this.setState({ searchLoading: true });

    // 收集请求参数
    const { isBaseHour } = this.state;
    const [startTimeMoment, endTimeMoment] = value.dateRange;
    const requestParams = {};
    requestParams.startTime = startTimeMoment.format('YYYY-MM-DD HH:00:00');
    requestParams.endTime = endTimeMoment.format('YYYY-MM-DD HH:00:00');
    requestParams.targetCellId = value.targetCells;
    requestParams.hourFlag = isBaseHour;

    // Request
    const kpiData = await fetchWaitingKpiView(requestParams);
    if (kpiData === undefined || kpiData === null || kpiData.hasOwnProperty('code')) {
      message.error(formatMessage({ id: 'app.message.fetchDataFailed' }));
    } else if (
      Object.keys(kpiData).length === 0 ||
      Object.keys(kpiData.detail).length === 0 ||
      Object.keys(kpiData.overview).length === 0
    ) {
      message.warn(formatMessage({ id: 'app.message.fetchDataEmpty' }));
    } else {
      this.setState({ searchLoading: false, originalChartsData: kpiData }, this.renderCharts);
    }
    this.setState({ searchLoading: false });
  };

  renderCharts = () => {
    const { isBaseHour, viewMode, originalChartsData } = this.state;
    if (!originalChartsData) return;
    const chartVM = convertWaitingToChartVM(isBaseHour, originalChartsData.detail, viewMode);
    this.setState(chartVM);
  };

  chartsTypeChanged = (ev) => {
    this.setState({ viewMode: ev.target.value }, this.renderCharts);
  };

  switchGanttModal = (data) => {
    this.setState({ ganttVisible: !this.state.ganttVisible }, () => {
      this.generateGanttContent(data);
    });
  };

  generateGanttContent = (data) => {
    const { originalChartsData } = this.state;
  };

  render() {
    const { isBaseHour, searchLoading, ganttVisible, viewMode } = this.state;
    return (
      <div className={styles.waitingKpi}>
        <SearchConditionForm
          isBaseHour={isBaseHour}
          loading={searchLoading}
          action={this.getChartsData}
        />
        <Radio.Group
          size="small"
          buttonStyle="solid"
          defaultValue="detail"
          onChange={this.chartsTypeChanged}
        >
          <Radio.Button value="detail">
            <FormattedMessage id="app.report.detail" />
          </Radio.Button>
          <Radio.Button value="overview">
            <FormattedMessage id="app.report.overview" />
          </Radio.Button>
        </Radio.Group>
        <Row className={styles.charts} gutter={[15, 15]}>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.waiting.averageIdleWaitingTime' })}
              subTitle={formatMessage({ id: 'app.report.baseHour' })}
              detail={this.state.averageWaitTime.data}
              formator={(value) => transformTime(value * 1000)}
              action={viewMode === 'detail' && this.switchGanttModal}
            />
          </Col>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.waiting.totalIdleWaitingTime' })}
              subTitle={formatMessage({ id: 'app.report.baseHour' })}
              detail={this.state.allWaitTime.data}
              formator={(value) => transformTime(value * 1000)}
              action={viewMode === 'detail' && this.switchGanttModal}
            />
          </Col>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.waiting.minIdleWaitingTime' })}
              subTitle={formatMessage({ id: 'app.report.baseHour' })}
              detail={this.state.mixWaitTime.data}
              formator={(value) => transformTime(value * 1000)}
              action={viewMode === 'detail' && this.switchGanttModal}
            />
          </Col>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.waiting.maxIdleWaitingTime' })}
              subTitle={formatMessage({ id: 'app.report.baseHour' })}
              detail={this.state.maxWaitTime.data}
              formator={(value) => transformTime(value * 1000)}
              action={viewMode === 'detail' && this.switchGanttModal}
            />
          </Col>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.waiting.secondMaxIdleWaitingTime' })}
              subTitle={formatMessage({ id: 'app.report.baseHour' })}
              detail={this.state.secondWaitTime.data}
              formator={(value) => transformTime(value * 1000)}
              action={viewMode === 'detail' && this.switchGanttModal}
            />
          </Col>
        </Row>
        <GanttModal
          visible={ganttVisible}
          data={{}}
          onCancel={() => {
            this.setState({ ganttVisible: false });
          }}
        />
      </div>
    );
  }
}
