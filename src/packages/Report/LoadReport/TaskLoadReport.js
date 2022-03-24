import React, { useState, memo, useEffect } from 'react';
import { Row, Col, Divider, Spin } from 'antd';
import echarts from 'echarts';
import XLSX from 'xlsx';
import moment from 'moment';
import {
  isStrictNull,
  convertToUserTimezone,
  dealResponse,
  formatMessage,
  isNull,
} from '@/utils/util';
import { fetchTaskLoad } from '@/services/api';
import { sortBy, forIn } from 'lodash';
import FilterSearch from '@/packages/Report/components/FilterSearch';
import { filterDataByParam } from '@/packages/Report/components/reportUtil';
import {
  getDatBysortTime,
  noDataGragraphic,
  getAllCellId,
} from '../components/GroundQrcodeEcharts';
import {
  actionPieOption,
  generateActionPieData,
  actionBarOption,
  generateActionBarData,
} from './components/loadRobotEcharts';
import HealthCarSearchForm from '../components/HealthCarSearchForm';
import commonStyles from '@/common.module.less';
import style from '../report.module.less';

const colums = {
  time: formatMessage({ id: 'app.time' }),
  robotType: formatMessage({ id: 'app.agv.type' }),
};

let taskActionPieLine = null; // 任务动作负载-pie
let taskWorkPieLine = null; // 任务作业负载-pie
let taskPickworkPieLine = null; // 拣选工作站任务作业负载-pie

let taskActionBarLine = null; // 任务动作负载-bar(日期x轴)
let taskWorkBarLine = null;
let taskPickworkBarLine = null;

const TaskLoadComponent = (props) => {
  const [loading, setLoading] = useState(false);
  const [loadOriginData, setLoadOriginData] = useState({}); // 这个放在这里--接口改变才会变

  const [timeType, setTimeType] = useState('hour');
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState([]);

  const [keyAction, setKeyAction] = useState({}); //actionTranslate
  const [keyStation, setKeyStation] = useState({}); //stationTranslate 拣选工作站
  const [keyWork, setKeyWork] = useState({}); //workTranslate 任务作业

  useEffect(() => {
    async function initCodeData() {
      const defaultHour = moment().subtract(1, 'hours');
      const startTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:00:00');
      const endTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:59:59');
      submitSearch({ startTime, endTime, agvSearch: { type: 'AGV_ID', code: [] } });
    }
    initCodeData();
  }, []);
  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [loadOriginData, timeType, selectedIds, selectedTaskIds]);

  function initChart() {
    // 任务动作负载 -pie

    taskActionPieLine = echarts.init(document.getElementById('load_taskActionPie'));

    taskActionPieLine.setOption(
      actionPieOption(formatMessage({ id: 'reportCenter.taskload.action' }), keyAction),
      true,
    );
    //-bar
    taskActionBarLine = echarts.init(document.getElementById('load_taskActionBar'));
    taskActionBarLine.setOption(
      actionBarOption(formatMessage({ id: 'reportCenter.taskload.action' }), keyAction),
      true,
    );

    // 任务作业负载 -pie
    taskWorkPieLine = echarts.init(document.getElementById('load_taskWorkPie'));
    taskWorkPieLine.setOption(
      actionPieOption(formatMessage({ id: 'reportCenter.taskload.workload' }), keyWork),
      true,
    );
    // -bar
    taskWorkBarLine = echarts.init(document.getElementById('load_taskWorkBar'));
    taskWorkBarLine.setOption(
      actionBarOption(formatMessage({ id: 'reportCenter.taskload.workload' }), keyWork),
      true,
    );

    // 拣选工作站任务作业负载 -pie
    taskPickworkPieLine = echarts.init(document.getElementById('load_taskPickworkPie'));
    taskPickworkPieLine.setOption(
      actionPieOption(
        formatMessage({ id: 'reportCenter.taskload.pickingWorkstation' }),
        keyStation,
      ),
      true,
    );
    // -bar
    taskPickworkBarLine = echarts.init(document.getElementById('load_taskPickworkBar'));
    taskPickworkBarLine.setOption(
      actionBarOption(
        formatMessage({ id: 'reportCenter.taskload.pickingWorkstation' }),
        keyStation,
      ),
      true,
    );

    return () => {
      taskActionPieLine.dispose();
      taskWorkPieLine.dispose();
      taskPickworkPieLine.dispose();

      taskActionBarLine.dispose();
      taskWorkBarLine.dispose();
      taskPickworkBarLine.dispose();
      taskActionPieLine = null;
      taskWorkPieLine = null;
      taskPickworkPieLine = null;
      taskActionBarLine = null;
      taskWorkBarLine = null;
      taskPickworkBarLine = null;
    };
  }

  function refreshChart() {
    initChart();
    if (!taskPickworkPieLine || !taskWorkPieLine || !taskActionPieLine || !taskActionBarLine)
      return;

    let sourceData = { ...loadOriginData };
    sourceData = filterDataByParam(sourceData, selectedIds, 'agvId');
    sourceData = filterDataByParam(sourceData, selectedTaskIds, 'agvTaskType');

    const actionPieData = generateActionPieData(sourceData, 'actionLoad', keyAction); //动作负载-pie
    const taskWorkPieData = generateActionPieData(sourceData, 'workLoad', keyWork);
    const taskPickworkPieData = generateActionPieData(
      sourceData,
      'pickingWorkstationWorkload',
      keyStation,
    );

    const actionBarData = generateActionBarData(sourceData, 'actionLoad', keyAction, timeType); //动作负载-bar
    const taskWorkBarData = generateActionBarData(sourceData, 'workLoad', keyWork, timeType);
    const taskPickworkBarData = generateActionBarData(
      sourceData,
      'pickingWorkstationWorkload',
      keyStation,
      timeType,
    );

    if (actionPieData) {
      const { series, legend } = actionPieData;
      const newActionPieLine = taskActionPieLine.getOption();
      newActionPieLine.series = series;
      newActionPieLine.legend = legend;
      taskActionPieLine.setOption(
        { ...newActionPieLine, ...noDataGragraphic(series[0]?.data?.length) },
        true,
      );
    }
    if (taskWorkPieData) {
      const { series, legend } = taskWorkPieData;
      const newWorkPieLine = taskWorkPieLine.getOption();
      newWorkPieLine.series = series;
      newWorkPieLine.legend = legend;
      taskWorkPieLine.setOption(
        { ...newWorkPieLine, ...noDataGragraphic(series[0]?.data?.length) },
        true,
      );
    }
    if (taskPickworkPieData) {
      const { series, legend } = taskPickworkPieData;
      const newPickPieLine = taskPickworkPieLine.getOption();
      newPickPieLine.series = series;
      newPickPieLine.legend = legend;
      taskPickworkPieLine.setOption(
        { ...newPickPieLine, ...noDataGragraphic(series[0]?.data?.length) },
        true,
      );
    }

    if (actionBarData) {
      const { xAxis, series, legend } = actionBarData;
      const newActionBaryLine = taskActionBarLine.getOption();
      newActionBaryLine.xAxis = xAxis;
      newActionBaryLine.series = series;
      newActionBaryLine.legend = legend;
      taskActionBarLine.setOption(
        { ...newActionBaryLine, ...noDataGragraphic(series.length) },
        true,
      );
    }

    if (taskWorkBarData) {
      const { xAxis, series, legend } = taskWorkBarData;
      const newtaskWorkBarLine = taskWorkBarLine.getOption();
      newtaskWorkBarLine.xAxis = xAxis;
      newtaskWorkBarLine.series = series;
      newtaskWorkBarLine.legend = legend;
      taskWorkBarLine.setOption(
        { ...newtaskWorkBarLine, ...noDataGragraphic(series.length) },
        true,
      );
    }
    if (taskPickworkBarData) {
      const { xAxis, series, legend } = taskPickworkBarData;
      const newtaskPickworkBarLine = taskPickworkBarLine.getOption();
      newtaskPickworkBarLine.xAxis = xAxis;
      newtaskPickworkBarLine.series = series;
      newtaskPickworkBarLine.legend = legend;
      taskPickworkBarLine.setOption(
        { ...newtaskPickworkBarLine, ...noDataGragraphic(series.length) },
        true,
      );
    }
  }

  // 搜索
  async function submitSearch(value) {
    const {
      startTime,
      endTime,
      agvSearch: { code: agvSearchTypeValue, type: agvSearchType },
    } = value;
    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      setLoading(true);

      const response = await fetchTaskLoad({
        startTime,
        endTime,
        agvSearchTypeValue,
        agvSearchType,
      });
      if (!dealResponse(response)) {
        let taskLoad = response?.taskLoadData || {};
        const newTaskLoad = getDatBysortTime(taskLoad);

        setSelectedIds(getAllCellId(newTaskLoad, 'agvId'));
        setSelectedTaskIds(getAllCellId(newTaskLoad, 'agvTaskType'));
        setKeyAction(response?.actionTranslate || {});
        setKeyStation(response?.stationTranslate || {});
        setKeyWork(response?.workTranslate || {});

        setLoadOriginData(newTaskLoad);
      }
      setLoading(false);
    }
  }

  // 二次-filter
  function filterDateOnChange(values) {
    const { timeType, selectedIds, taskType } = values;
    setSelectedIds(selectedIds);
    setSelectedTaskIds(taskType);
    setTimeType(timeType);
  }

  function generateEveryType(allData, type, keyData) {
    const typeResult = [];
    Object.entries(allData).forEach(([key, typeData]) => {
      if (!isStrictNull(typeData)) {
        const currentTypeData = sortBy(typeData, 'agvId');
        currentTypeData.forEach((record) => {
          let currentTime = {};
          let _record = {};
          currentTime[colums.time] = key;
          currentTime.agvId = record.agvId;
          currentTime.agvTaskType = record.agvTaskType;
          currentTime[colums.robotType] = record.robotType;
          if (!isNull(type)) {
            _record = { ...record[type] };
          }
          forIn(_record, (value, parameter) => {
            currentTime[keyData[parameter]] = value;
          });
          typeResult.push(currentTime);
        });
      }
    });
    return typeResult;
  }

  // 下载
  function exportData() {
    const wb = XLSX.utils.book_new();
    const action = XLSX.utils.json_to_sheet(
      generateEveryType(loadOriginData, 'actionLoad', keyAction),
    );
    const work = XLSX.utils.json_to_sheet(generateEveryType(loadOriginData, 'workLoad', keyWork));
    const pickStation = XLSX.utils.json_to_sheet(
      generateEveryType(loadOriginData, 'pickingWorkstationWorkload', keyStation),
    );
    XLSX.utils.book_append_sheet(wb, action, formatMessage({ id: 'reportCenter.taskload.action' }));
    XLSX.utils.book_append_sheet(wb, work, formatMessage({ id: 'reportCenter.taskload.workload' }));
    XLSX.utils.book_append_sheet(
      wb,
      pickStation,
      formatMessage({ id: 'reportCenter.taskload.pickingWorkstation' }),
    );

    XLSX.writeFile(wb, `${formatMessage({ id: 'menu.loadReport.taskLoad' })}.xlsx`);
  }

  return (
    <div className={commonStyles.commonPageStyle}>
      <HealthCarSearchForm
        search={submitSearch}
        type="taskload"
        downloadVisible={true}
        exportData={exportData}
      />

      <div className={style.body}>
        <Spin spinning={loading}>
          <FilterSearch
            showCellId={false}
            showTask={true}
            data={loadOriginData}
            filterSearch={filterDateOnChange}
          />
          <Row style={{ marginTop: 20 }}>
            <Col span={12}>
              <div id="load_taskActionPie" style={{ minHeight: 340 }} />
            </Col>
            <Col span={12}>
              <div id="load_taskActionBar" style={{ minHeight: 340 }} />
            </Col>
            <Divider />
            <Col span={12}>
              <div id="load_taskWorkPie" style={{ minHeight: 340 }} />
            </Col>
            <Col span={12}>
              <div id="load_taskWorkBar" style={{ minHeight: 340 }} />
            </Col>
            <Divider />
            <Col span={12}>
              <div id="load_taskPickworkPie" style={{ minHeight: 340 }} />
            </Col>
            <Col span={12}>
              <div id="load_taskPickworkBar" style={{ minHeight: 340 }} />
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};
export default memo(TaskLoadComponent);
