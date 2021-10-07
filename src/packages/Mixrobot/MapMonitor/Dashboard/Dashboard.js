import React, { PureComponent } from 'react';
import { message } from 'antd';
import { find, throttle } from 'lodash';
import intl from 'react-intl-universal';
import Dictionary from '@/utils/Dictionary';
import { AppCode, AGVType } from '@/config/config';
import { GMT2UserTimeZone, getDpr } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import initDashboard from './ECharts';
import MixRobotExhibitionService from './MixRobotExhibitionService';
import { fetchSystemParamFormData } from '@/services/api';
import {
  agvStateColor,
  getAgvStatusMap,
  getAgvPowerStateMap,
  agvPowerStateColor,
  LineChartsAxisColor,
} from './option';
import Style from './dashboard.module.less';

const PieInnerFontSize = 14;
const PieInnerTitleTop = '40%';
const PieInnerValueTop = '46%';

export default class Dashboard extends PureComponent {
  constructor(props) {
    super(props);

    // 新建两个对象用于并发请求
    this.promises = [];
    this.promisesType = [];

    this.AGVTypeName = {
      [AppCode.LatentLifting]: intl.formatMessage({ id: 'app.exhibition.agv.latent' }),
      [AppCode.Tote]: intl.formatMessage({ id: 'app.exhibition.agv.tote' }),
      [AppCode.ForkLifting]: intl.formatMessage({ id: 'app.exhibition.agv.fork' }),
    };

    this.state = {
      pod: 0,
      workStation: 0,
      charger: 0,
      store: 0,
      kPILabelfontSize: 12,
      kPIValuefontSize: 12,
      kpiHeight: 70,
    };
  }

  async componentDidMount() {
    this.setState({
      kPILabelfontSize: 15 * getDpr(),
      kPIValuefontSize: 20 * getDpr(),
      kpiHeight: 60 * getDpr(),
    });

    this.MixRobotExhibitionService = new MixRobotExhibitionService();
    // 获取参数列表数据
    let rateMinuteSpan = 5; // 秒
    const systemParamData = await fetchSystemParamFormData();
    const exhibition = find(systemParamData, { name: '显示' });
    if (exhibition) {
      const { tabContent } = exhibition;
      const exhibitionConfig = find(tabContent, { groupName: '显示设置' });
      if (exhibitionConfig) {
        const { group } = exhibitionConfig;
        const rateMinuteSpanItem = find(group, { key: 'rateMinuteSpan' });
        if (rateMinuteSpanItem) {
          rateMinuteSpan = rateMinuteSpanItem.defaultValue;
        }
      }
    }

    // 初始化图表
    this.charts = initDashboard(this.state.showLevel);
    this.updateDimensions();

    // 立即刷新一次
    await this.refreshDashboard();

    // 每隔 {{ rateMinuteSpan }} 秒刷新一次图表
    this.refreshInterval = setInterval(this.refreshDashboard, parseInt(rateMinuteSpan, 10) * 1000);

    // 绑定 DashBoard节点的 Resize 事件
    this.dashboardResizeObserver = new ResizeObserver(throttle(this.updateDimensions), 200);
    this.dashboardResizeObserver.observe(document.getElementById('monitorDashboard'));
    this.dashboardResizeObserver.observe(document.body);
  }

  componentWillUnmount() {
    clearInterval(this.refreshInterval);
    this.promises = [];

    // 销毁图表实例
    this.charts.taskStatePie.dispose();
    this.charts.taskTrendLine.dispose();
    this.charts.carStatePie.dispose();
    this.charts.carBatteryStatePie.dispose();

    // 销毁Observer
    if (this.dashboardResizeObserver) {
      this.dashboardResizeObserver.disconnect();
      this.dashboardResizeObserver = null;
    }
  }

  updateDimensions = () => {
    this.charts.taskStatePie.resize();
    this.charts.taskTrendLine.resize();
    this.charts.carStatePie.resize();
    this.charts.carBatteryStatePie.resize();

    this.setState({
      kPILabelfontSize: 15 * getDpr(),
      kPIValuefontSize: 20 * getDpr(),
    });
  };

  collectReqPromise = () => {
    // @权限控制: 创建刷新数据的接口请求器 --> 只拉取有权限的AGV数据
    const grantedAPP = JSON.parse(window.localStorage.getItem('grantedAPP')) ?? [];
    const grantedAPPKey = grantedAPP.map(({ name }) => name);
    this.promises = [];
    this.promisesType = [];

    // 潜伏车: latent-lifting
    if (grantedAPPKey.includes('latent-lifting')) {
      this.promisesType.push(AGVType.LatentLifting);
      this.promises.push(this.MixRobotExhibitionService.refreshLatentLiftCharts());
    }

    // 料箱车: tote-wcs-gui
    if (grantedAPPKey.includes('tote-wcs-gui')) {
      this.promisesType.push(AGVType.Tote);
      this.promises.push(this.MixRobotExhibitionService.refreshToteCharts());
    }

    // 叉车: forklift
    // if (grantedAPPKey.includes('forklift')) {
    // this.promisesType.push(Config.AGVType.ForkLifting);
    //   this.promises.push(this.MixRobotExhibitionService.refreshForkLiftCharts());
    // }

    // 分拣车: sorter
    // if (grantedAPPKey.includes('sorter')) {
    // this.promisesType.push(Config.AGVType.sorter);
    //   this.promises.push(this.MixRobotExhibitionService.refreshSorterCharts());
    // }
  };

  refreshDashboard = async () => {
    this.collectReqPromise();
    try {
      // 获取消息
      const response = await Promise.all(this.promises);
      // 生成任务状态渲染数据
      const allTaskTypeMap = {};
      this.promisesType.forEach((type, index) => {
        allTaskTypeMap[type] = response[index].taskTypeMap;
      });
      const taskStateChartData = this.generateTaskStateData(allTaskTypeMap);
      // 生成任务历史渲染数据
      const taskTrendChartData = this.generateTaskTrendData(response);
      // 生成车辆状态渲染数据
      const carStatePieData = this.generateCarStateData(response);
      // 生成车辆电量状态渲染数据
      const carBatteryStatePieData = this.generateCarBatteryStateData(response);
      // 生成总览渲染数据(货架、工作站、充电桩、存储区)
      this.generateKpiOVData(response);

      // 刷新图表
      const { taskStatePie, taskTrendLine, carStatePie, carBatteryStatePie } = this.charts;

      /// / 刷新任务状态
      const taskStatePieOption = taskStatePie.getOption();
      taskStatePieOption.yAxis = taskStateChartData.yAxis;
      taskStatePieOption.series = taskStateChartData.series;
      taskStatePie.setOption(taskStatePieOption, true);

      /// / 刷新任务历史
      const taskTrendLineOption = taskTrendLine.getOption();
      taskTrendLineOption.xAxis = taskTrendChartData.xAxis;
      taskTrendLineOption.series = taskTrendChartData.series;
      taskTrendLine.setOption(taskTrendLineOption, true);

      /// / 刷新车辆状态
      const carStatePieOption = carStatePie.getOption();
      carStatePieOption.series[0].data = carStatePieData;
      carStatePieOption.graphic = [
        {
          type: 'text',
          left: 'center',
          top: PieInnerTitleTop,
          style: {
            text: intl.formatMessage({ id: 'app.exhibition.agv.total' }),
            fill: '#F1F1F1',
            fontSize: PieInnerFontSize * getDpr(),
            textAlign: 'center',
            textVerticalAlign: 'center',
          },
        },
        {
          type: 'text',
          left: 'center',
          top: PieInnerValueTop,
          style: {
            text: `${carStatePieData.reduce(
              (pre, next) => pre + next.value,
              0,
            )}${intl.formatMessage({
              id: 'app.exhibition.agv.unit',
            })}`,
            fill: 'orange',
            fontSize: PieInnerFontSize * getDpr(),
            fontWeight: 600,
            textAlign: 'center',
            textVerticalAlign: 'center',
          },
        },
      ];
      carStatePie.setOption(carStatePieOption, true);

      /// / 刷新车辆电量
      const carBatteryStatePieOption = carBatteryStatePie.getOption();
      carBatteryStatePieOption.series[0].data = carBatteryStatePieData;
      carBatteryStatePieOption.graphic = [
        {
          type: 'text',
          left: 'center',
          top: PieInnerTitleTop,
          style: {
            text: intl.formatMessage({ id: 'app.exhibition.agv.online' }),
            fill: '#F1F1F1',
            fontSize: PieInnerFontSize * getDpr(),
            textAlign: 'center',
            textVerticalAlign: 'center',
          },
        },
        {
          type: 'text',
          left: 'center',
          top: PieInnerValueTop,
          style: {
            text: `${carBatteryStatePieData.reduce(
              (pre, next) => pre + next.value,
              0,
            )}${intl.formatMessage({ id: 'app.exhibition.agv.unit' })}`,
            fill: 'orange',
            fontSize: PieInnerFontSize * getDpr(),
            fontWeight: 600,
            textAlign: 'center',
            textVerticalAlign: 'center',
          },
        },
      ];
      carBatteryStatePie.setOption(carBatteryStatePieOption, true);
    } catch (error) {
      message.error(intl.formatMessage({ id: 'app.exhibition.tip.fetchDataFail' }));
    }
  };

  generateTaskStateData = (allTaskType) => {
    const yAxis = {
      type: 'category',
      axisLine: {
        show: false,
        lineStyle: {
          color: '#142A3B',
          opacity: 0,
        },
      },
      axisLabel: {
        color: 'rgba(204, 204, 204, 0.7)',
        fontSize: 14 * getDpr(),
        fontWeight: 'bolder',
        fontFamily: 'Microsoft YaHei',
        inside: true,
        margin: 30,
      },
      data: [],
    };
    const series = [
      {
        name: intl.formatMessage({ id: 'app.exhibition.taskState.new' }),
        type: 'bar',
        stack: intl.formatMessage({ id: 'app.exhibition.agv.total' }),
        itemStyle: {
          color: 'rgba(1,141,246,0.7)',
        },
        data: [],
        barMaxWidth: 60, // 该配置对于该坐标系中的所有柱状图有效
      },
      {
        name: intl.formatMessage({ id: 'app.exhibition.taskState.excuting' }),
        type: 'bar',
        stack: intl.formatMessage({ id: 'app.exhibition.agv.total' }),
        itemStyle: {
          color: 'rgba(47,137,73,0.7)',
        },
        data: [],
      },
      {
        name: intl.formatMessage({ id: 'app.exhibition.taskState.fail' }),
        type: 'bar',
        stack: intl.formatMessage({ id: 'app.exhibition.agv.total' }),
        itemStyle: {
          color: 'rgba(186,47,53,0.7)',
        },
        data: [],
      },
    ];
    const SeriesDataLabelConfig = {
      color: 'orange',
      position: 'insideRight',
      fontSize: 13 * getDpr(),
      fontWeight: 'bold',
    };
    Object.keys(allTaskType).forEach((category) => {
      const categoryTasks = allTaskType[category];
      Object.keys(categoryTasks).forEach((taskType) => {
        // yAxis
        const taskTypeName = intl.formatMessage({
          id: Dictionary('agvTaskType', taskType),
        });
        yAxis.data.push(`${this.AGVTypeName[category]}: ${taskTypeName}`);

        // Series
        const taskStates = categoryTasks[taskType]; // New, Executing, Error
        const NEW = taskStates.New ?? 0;
        series[0].data.push({
          name: intl.formatMessage({ id: 'app.exhibition.taskState.new' }),
          value: NEW,
          label: {
            show: NEW !== 0,
            ...SeriesDataLabelConfig,
          },
        });

        const EXECUTING = taskStates.Executing ?? 0;
        series[1].data.push({
          name: intl.formatMessage({ id: 'app.exhibition.taskState.excuting' }),
          value: EXECUTING,
          label: {
            show: EXECUTING !== 0,
            ...SeriesDataLabelConfig,
          },
        });

        const ERROR = taskStates.Error ?? 0;
        series[2].data.push({
          name: intl.formatMessage({ id: 'app.exhibition.taskState.fail' }),
          value: ERROR,
          label: {
            show: ERROR !== 0,
            ...SeriesDataLabelConfig,
          },
        });
      });
    });
    return { yAxis, series };
  };

  generateTaskTrendData = (response) => {
    const result = {};
    response.forEach((category, index) => {
      const currentAgvType = this.promisesType[index];
      const { taskNumberMap } = category;
      const timeKey = Object.keys(taskNumberMap).sort();
      timeKey.forEach((dateTime) => {
        const localDateTime = GMT2UserTimeZone(`${dateTime}:00:00`).format('YYYY-MM-DD HH:mm');
        const time = localDateTime.split(' ')[1];
        if (!result[time]) {
          result[time] = {};
        }
        const dateTimeTasks = taskNumberMap[dateTime];
        Object.keys(dateTimeTasks).forEach((taskType) => {
          const _taskType = `${this.AGVTypeName[currentAgvType]}:${taskType}`;
          if (!result[time][_taskType]) {
            result[time][_taskType] = 0;
          }
          const value = result[time][_taskType];
          result[time][_taskType] = value + dateTimeTasks[taskType];
        });
      });
    });
    const xAxisData = Object.keys(result).sort();
    const xAxis = {
      type: 'category',
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
      data: xAxisData,
    };
    const series = [];
    xAxisData.forEach((item, index) => {
      const dateTimeTasksOV = result[item]; // {潜伏: REST_UNDER_POD: 40, 潜伏: CHARGE_RUN: 40}
      Object.keys(dateTimeTasksOV).forEach((taskTypeWithAgvType) => {
        const [agvType, taskType] = taskTypeWithAgvType.split(':');
        const taskTypeName = intl.formatMessage({
          id: Dictionary('agvTaskType', taskType),
        });
        const seriesItemName = `${agvType}: ${taskTypeName}`;
        let seriesItem = find(series, { name: seriesItemName });
        if (!seriesItem) {
          seriesItem = {
            name: seriesItemName,
            type: 'line',
            symbolSize: 8 * getDpr(),
            symbol: 'circle',
            lineStyle: {
              width: 3,
            },
            data: [],
          };
          series.push(seriesItem);
        }
        seriesItem.data[index] = dateTimeTasksOV[taskTypeWithAgvType];
      });
    });
    return { xAxis, series };
  };

  generateKpiOVData = (response) => {
    const { currentMap } = this.props;
    // 这里的货架是潜伏货架
    let pod = 0;
    let workStation = 0;
    let charger = 0;
    let store = 0;
    const latentIndex = this.promisesType.indexOf(AGVType.LatentLifting);
    if (latentIndex !== -1) {
      pod = response[latentIndex].podNumber;
    }

    if (currentMap && currentMap.logicAreaList) {
      currentMap.logicAreaList.forEach(
        ({ chargerList = [], storeCellIds = [], workstationList = [] }) => {
          store += storeCellIds.length;
          charger += chargerList.length;
          workStation += workstationList.length;
        },
      );
    }
    this.setState({ pod, workStation, charger, store });
  };

  generateCarStateData = (response) => {
    const AgvStatusMap = getAgvStatusMap();
    const agvState = {
      Offline: 0,
      Connecting: 0,
      StandBy: 0,
      Working: 0,
      Charging: 0,
      Error: 0,
    };
    const result = [];
    response.forEach((category) => {
      const { agvStatusMap } = category;
      Object.keys(agvStatusMap).forEach((state) => {
        const value = agvState[state];
        agvState[state] = value + agvStatusMap[state];
      });
    });
    Object.keys(agvState).forEach((state) => {
      const stateName = AgvStatusMap[state];
      result.push({
        name: stateName,
        value: agvState[state],
        itemStyle: { color: agvStateColor[state] },
      });
    });
    return result;
  };

  generateCarBatteryStateData = (response) => {
    const agvState = {
      full: 0,
      good: 0,
      normal: 0,
      low: 0,
      danger: 0,
    };
    const AgvPowerStateMap = getAgvPowerStateMap();
    const result = [];
    response.forEach((category) => {
      const { monitorOverallAgvPower } = category;
      Object.keys(monitorOverallAgvPower).forEach((state) => {
        if (state === 'total') return;
        const value = agvState[state];
        agvState[state] = value + monitorOverallAgvPower[state];
      });
    });
    Object.keys(agvState).forEach((state) => {
      const stateName = AgvPowerStateMap[state];
      result.push({
        name: stateName,
        value: agvState[state],
        itemStyle: { color: agvPowerStateColor[state] },
      });
    });
    return result;
  };

  render() {
    const { pod, charger, workStation, store } = this.state;
    const { kPILabelfontSize, kPIValuefontSize, kpiHeight } = this.state;
    const KPILabelStyle = {
      color: 'rgb(189, 189, 189)',
      fontSize: `${kPILabelfontSize}px`,
    };
    const NumTextStyle = {
      color: '#8BC34A',
      fontWeight: 'bold',
      fontSize: `${kPIValuefontSize}px`,
    };
    return (
      <div
        id="monitorDashboard"
        className={Style.exhibition}
        style={{ height: '100%', width: '100%' }}
      >
        {/* 任务实时状态 */}
        <div id="taskStatePie" style={{ flex: 1 }} />
        {/* 任务历史 */}
        <div id="taskTrendLine" style={{ flex: 1 }} />
        {/* 总览 */}
        <div className={Style.KPI} style={{ height: kpiHeight }}>
          <div className={Style.KPIColItem}>
            <span style={KPILabelStyle}>
              <FormattedMessage id="app.exhibition.overview.pod" />
            </span>
            <span className="num-text" style={{ ...NumTextStyle }}>
              {pod}
            </span>
          </div>
          <div className={Style.KPIColItem}>
            <span style={KPILabelStyle}>
              <FormattedMessage id="app.exhibition.overview.charger" />
            </span>
            <span className="num-text" style={{ ...NumTextStyle }}>
              {charger}
            </span>
          </div>
          <div className={Style.KPIColItem}>
            <span style={KPILabelStyle}>
              <FormattedMessage id="app.exhibition.overview.workStation" />
            </span>
            <span className="num-text" style={{ ...NumTextStyle }}>
              {workStation}
            </span>
          </div>
          <div className={Style.KPIColItem}>
            <span style={KPILabelStyle}>
              <FormattedMessage id="app.exhibition.overview.store" />
            </span>
            <span className="num-text" style={{ ...NumTextStyle }}>
              {store}
            </span>
          </div>
        </div>
        {/* 小车状态 & 小车电量状态 */}
        <div style={{ display: 'flex', flex: 1 }}>
          <div id="carStatePie" style={{ width: '52%', height: '100%' }} />
          <div id="carBatteryStatePie" style={{ width: '48%', height: '100%' }} />
        </div>
      </div>
    );
  }
}
