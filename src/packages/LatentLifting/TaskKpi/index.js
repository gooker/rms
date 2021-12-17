import React, { Component } from 'react';
import { Button, Radio, Row, Col, message, Tooltip, Divider } from 'antd';
import { UnorderedListOutlined } from '@ant-design/icons';
import { fetchKpiView, saveSearchSeek } from '@/services/latentLifting';
import {
  transformTime,
  convertResponseToChartVM,
  convertComparisionToChartVM,
  convertComparisionOverViewToChartVM,
} from './utils';
import Enum from './enum';
import KpiSearchConditions from './components/KpiSearchConditions';
import KpiSavedSeedModal from './components/KpiSavedSeedModal';
import SetSeedNameModal from './components/SetSeedNameModal';
import CustomChart from './components/CustomChart';
import { formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import styles from './TaskKpi.module.less';

const gridLayout = {
  xs: 12,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 8,
  xxl: 6,
};

class TaskKPI extends Component {
  state = {
    chartMode: 'check', // compare, search
    searchLoading: false,
    storeSeedLoading: false,
    showStoredSeedsModal: false,
    originalChartsData: null,
    chartsType: 'overview',

    // 设置查询名称Modal
    showSeedNameModal: false,

    // 搜索
    isBaseHour: false,
    startTime: '',
    endTime: '',
    taskType: 'ALL',
    targetCells: [],

    // 显示控制
    taskTypeControl: 'ALL',

    // Charts VN
    tasksCount: { overview: 0, data: [] }, // 任务总数
    averageYards: { overview: 0, data: [] }, // 平均码数
    averageDistance: { overview: 0, data: [] }, // 平均距离
    averageTurnSize: { overview: 0, data: [] }, // 平均转弯次数
    averageWaitTime: { overview: 0, data: [] }, // 平均等待时间
    averageQueueTime: { overview: 0, data: [] }, // 平均排队时间
    averageTimeConsumer: { overview: 0, data: [] }, // 平均耗时
    averageReleaseTime: { overview: 0, data: [] }, // 平均释放时间
    averageChargerTime: { overview: 0, data: [] }, // 平均充电时间
    averageNoChangeSize: { overview: 0, data: [] }, // 平均重算次数
    averageChargerCapacity: { overview: 0, data: [] }, // 平均充电电量
    averagePodRotateSize: { overview: 0, data: [] }, // 平均货架旋转次数
  };

  generateSearchParams = () => {
    const { startTime, endTime, taskType, targetCells, isBaseHour } = this.state;
    const requestParams = {};
    if (startTime) requestParams.startTime = startTime;
    if (endTime) requestParams.endTime = endTime;
    if (targetCells && targetCells.length > 0) requestParams.targetCellId = targetCells;
    if (taskType !== 'ALL') requestParams.taskType = taskType;
    requestParams.hourFlag = isBaseHour;
    return requestParams;
  };

  getChartsData = async () => {
    this.setState({ searchLoading: true });
    const requestParams = this.generateSearchParams();
    const kpiData = await fetchKpiView(requestParams);
    if (kpiData === undefined || kpiData === null || kpiData.hasOwnProperty('code')) {
      this.resetCharts();
      message.error(formatMessage({ id: 'app.message.fetchDataFailed' }));
    } else if (
      Object.keys(kpiData).length === 0 ||
      Object.keys(kpiData.detail).length === 0 ||
      Object.keys(kpiData.overview).length === 0
    ) {
      this.resetCharts();
      message.warn(formatMessage({ id: 'app.message.fetchDataEmpty' }));
    } else {
      this.setState({ originalChartsData: kpiData });
      this.renderCharts();
    }
    this.setState({ searchLoading: false });
  };

  renderCharts = () => {
    const subTitleMap = {
      HOUR_BASE: formatMessage({ id: 'app.report.baseHour' }),
      TASK_TYPE_BASE: formatMessage({ id: 'app.report.baseTaskType' }),
      TARGET_CELL_BASE: formatMessage({ id: 'app.report.baseTarget' }),
    };
    const { isBaseHour, taskType, originalChartsData } = this.state;
    const subTitle = isBaseHour
      ? subTitleMap[Enum.hourBase]
      : taskType === 'ALL'
      ? subTitleMap[Enum.taskTypeBase]
      : subTitleMap[Enum.targetCellBase];
    this.setState(
      {
        subTitle,
        ...convertResponseToChartVM(isBaseHour, taskType, originalChartsData),
      },
      () => {
        this.setState({ taskTypeControl: taskType, chartMode: 'search' });
      },
    );
  };

  resetCharts = () => {
    this.setState({
      tasksCount: { overview: 0, data: [] }, // 任务总数
      averageYards: { overview: 0, data: [] }, // 平均码数
      averageDistance: { overview: 0, data: [] }, // 平均距离
      averageTurnSize: { overview: 0, data: [] }, // 平均转弯次数
      averageWaitTime: { overview: 0, data: [] }, // 平均等待时间
      averageQueueTime: { overview: 0, data: [] }, // 平均排队时间
      averageTimeConsumer: { overview: 0, data: [] }, // 平均耗时
      averageReleaseTime: { overview: 0, data: [] }, // 平均释放时间
      averageChargerTime: { overview: 0, data: [] }, // 平均充电时间
      averageNoChangeSize: { overview: 0, data: [] }, // 平均重算次数
      averageChargerCapacity: { overview: 0, data: [] }, // 平均充电电量
      averagePodRotateSize: { overview: 0, data: [] }, // 平均货架旋转次数
    });
  };

  searchTaskTypeChanged = (taskType) => {
    this.setState({ taskType });
  };

  // 查询工具栏
  searchTargetCellChanged = (targetCells) => {
    this.setState({ targetCells });
  };

  dataRangePickerChanged = (value, dateString) => {
    this.setState({
      startTime: dateString[0],
      endTime: dateString[1],
    });
  };

  changeIsBaseHour = (ev) => {
    this.setState({ isBaseHour: ev.target.checked });
  };

  // 已保存查询列表模态框
  toggleSeedsModal = () => {
    this.setState({ showStoredSeedsModal: !this.state.showStoredSeedsModal });
  };

  // 比较
  startComparing = (selectedRows) => {
    const subTitleMap = {
      HOUR_BASE: formatMessage({ id: 'app.report.baseHour' }),
      TASK_TYPE_BASE: formatMessage({ id: 'app.report.baseTaskType' }),
      TARGET_CELL_BASE: formatMessage({ id: 'app.report.baseTarget' }),
    };

    this.toggleSeedsModal();
    const startTime = selectedRows[0].kpiSearchParam.startTime;
    const endTime = selectedRows[0].kpiSearchParam.endTime;
    const isBaseHour = selectedRows[0].kpiSearchParam.hourFlag;
    const taskType = selectedRows[0].kpiSearchParam.taskType || 'ALL';
    const targetCells = selectedRows[0].kpiSearchParam.targetCellId;
    const subTitle = isBaseHour
      ? subTitleMap[Enum.hourBase]
      : taskType === 'ALL'
      ? subTitleMap[Enum.taskTypeBase]
      : subTitleMap[Enum.targetCellBase];
    // 获取流程处理标志位
    let newTargetCells = targetCells;
    if (!newTargetCells) {
      newTargetCells = [];
    }
    if (selectedRows.length === 1) {
      // 查看模式
      const states = convertResponseToChartVM(isBaseHour, taskType, selectedRows[0]);
      this.setState(
        {
          endTime,
          taskType,
          startTime,
          isBaseHour,
          targetCells: newTargetCells,
          originalChartsData: selectedRows,
          subTitle,
          ...states,
        },
        () => {
          this.setState({ chartMode: 'check' });
        },
      );
    } else {
      // 对比模式
      this.setState(
        {
          subTitle,
          originalChartsData: selectedRows,
          ...convertComparisionToChartVM(isBaseHour, taskType, selectedRows),
        },
        () => {
          this.setState({ chartMode: 'compare' });
        },
      );
    }
  };

  chartsTypeChanged = (ev) => {
    this.setState({ chartsType: ev.target.value }, this.switchComparisonMod);
  };

  switchComparisonMod = () => {
    const subTitleMap = {
      HOUR_BASE: formatMessage({ id: 'app.report.baseHour' }),
      TASK_TYPE_BASE: formatMessage({ id: 'app.report.baseTaskType' }),
      TARGET_CELL_BASE: formatMessage({ id: 'app.report.baseTarget' }),
    };

    // 对比模式下，'详情'的横坐标是点位或者任务类型；'总览'的横坐标是参与对比的查询的名字
    const { chartsType, originalChartsData: selectedRows } = this.state;
    const isBaseHour = selectedRows[0].kpiSearchParam.hourFlag;
    const taskType = selectedRows[0].kpiSearchParam.taskType || 'ALL';
    const subTitle = isBaseHour
      ? subTitleMap[Enum.hourBase]
      : taskType === 'ALL'
      ? subTitleMap[Enum.taskTypeBase]
      : subTitleMap[Enum.targetCellBase];
    if (chartsType === 'detail') {
      this.setState({
        subTitle,
        chartMode: 'compare',
        ...convertComparisionToChartVM(isBaseHour, taskType, selectedRows),
      });
    }
    if (chartsType === 'overview') {
      this.setState({
        chartMode: 'compare',
        subTitle,
        ...convertComparisionOverViewToChartVM(isBaseHour, taskType, selectedRows),
      });
    }
  };

  // 查询名称Modal
  toggleSeedNameModal = () => {
    this.setState({ showSeedNameModal: !this.state.showSeedNameModal });
  };

  storeSearchSeed = async (name) => {
    const { detail, overview } = this.state.originalChartsData;
    const searchParams = this.generateSearchParams();
    const requestParams = { kpiSearchParam: searchParams, name, detail, overview };
    await saveSearchSeek(requestParams);
    message.success(formatMessage({ id: 'app.message.operateSuccess' }));
    this.toggleSeedNameModal();
  };

  render() {
    const {
      startTime,
      endTime,
      taskType,
      subTitle,
      chartMode,
      isBaseHour,
      targetCells,
      searchLoading,
      taskTypeControl,
      storeSeedLoading,
      showSeedNameModal,
      originalChartsData,
      showStoredSeedsModal,
    } = this.state;
    return (
      <div className={styles.KPI}>
        <div className={styles.tools}>
          <KpiSearchConditions
            isBaseHour={isBaseHour}
            startTime={startTime}
            endTime={endTime}
            taskType={taskType}
            targetCells={targetCells}
            changeIsBaseHour={this.changeIsBaseHour}
            searchTaskTypeChanged={this.searchTaskTypeChanged}
            dataRangePickerChanged={this.dataRangePickerChanged}
            searchTargetCellChanged={this.searchTargetCellChanged}
          />
          <div className={styles.bottom}>
            <Button type="primary" onClick={this.getChartsData} loading={searchLoading}>
              <FormattedMessage id="app.button.search" />
            </Button>
            <Button
              onClick={this.toggleSeedNameModal}
              disabled={!originalChartsData || chartMode !== 'search'}
              loading={storeSeedLoading}
            >
              <FormattedMessage id="app.report.saveSearchResult" />
            </Button>
            <div
              className={showStoredSeedsModal ? styles.showSearchSeedActive : styles.showSearchSeed}
            >
              <Tooltip
                placement="top"
                title={formatMessage({ id: 'app.report.checkSaveSearchResult' })}
              >
                <UnorderedListOutlined onClick={this.toggleSeedsModal} />
              </Tooltip>
            </div>
          </div>
        </div>
        <Divider />

        {/* 比较模式 */}
        {chartMode === 'compare' && (
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
        )}

        {/* 图表视图区 */}
        <Row gutter={[15, 15]}>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.report.task.totalTasks' })}
              subTitle={subTitle}
              chartMode={chartMode}
              formator={(value) => `${value}${formatMessage({ id: 'app.report.unit' })}`}
              detail={this.state.tasksCount.data}
              overview={`
            ${this.state.tasksCount.overview}
            ${formatMessage({ id: 'app.report.unit' })}`}
            />
          </Col>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.report.task.averageYardage' })}
              subTitle={subTitle}
              chartMode={chartMode}
              formator={(value) => `${value}${formatMessage({ id: 'app.report.unit' })}`}
              detail={this.state.averageYards.data}
              overview={`
            ${this.state.averageYards.overview}
            ${formatMessage({ id: 'app.report.unit' })}`}
            />
          </Col>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.report.task.averageDistance' })}
              subTitle={subTitle}
              chartMode={chartMode}
              formator={(value) => `${value}${formatMessage({ id: 'app.report.mile' })}`}
              detail={this.state.averageDistance.data}
              overview={`${this.state.averageDistance.overview}
            ${formatMessage({ id: 'app.report.mile' })}`}
            />
          </Col>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.report.task.averageTime' })}
              subTitle={subTitle}
              chartMode={chartMode}
              detail={this.state.averageTimeConsumer.data}
              formator={(value) => transformTime(value * 1000)}
              overview={this.state.averageTimeConsumer.overview}
            />
          </Col>
          <Col {...gridLayout}>
            <CustomChart
              title={formatMessage({ id: 'app.report.task.averageTurning' })}
              subTitle={subTitle}
              chartMode={chartMode}
              formator={(value) => `${value}${formatMessage({ id: 'app.report.times' })}`}
              detail={this.state.averageTurnSize.data}
              overview={`
            ${this.state.averageTurnSize.overview}
            ${formatMessage({ id: 'app.report.times' })}`}
            />
          </Col>

          {/* 充电任务 */}
          {'CHARGE_RUN' === taskTypeControl && (
            <>
              <Col {...gridLayout}>
                <CustomChart
                  title={formatMessage({ id: 'app.report.task.averageChargeTime' })}
                  subTitle={subTitle}
                  chartMode={chartMode}
                  detail={this.state.averageChargerTime.data}
                  formator={(value) => transformTime(value * 1000)}
                  overview={this.state.averageChargerTime.overview}
                />
              </Col>
              <Col {...gridLayout}>
                <CustomChart
                  title={formatMessage({ id: 'app.report.task.averageChargeLevel' })}
                  subTitle={subTitle}
                  chartMode={chartMode}
                  detail={this.state.averageChargerCapacity.data}
                  overview={this.state.averageChargerCapacity.overview}
                />
              </Col>
            </>
          )}
        </Row>

        {/* Modal */}
        <KpiSavedSeedModal
          onOk={this.startComparing}
          visible={showStoredSeedsModal}
          onCancel={this.toggleSeedsModal}
        />

        {/* Modal */}
        <SetSeedNameModal
          onOk={this.storeSearchSeed}
          visible={showSeedNameModal}
          onCancel={this.toggleSeedNameModal}
        />
      </div>
    );
  }
}
export default TaskKPI;
