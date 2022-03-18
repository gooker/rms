import React, { useState, memo, useEffect } from 'react';
import { Row, Col, Divider, Card } from 'antd';
import echarts from 'echarts';
import XLSX from 'xlsx';
import moment from 'moment';
import { getDatBysortTime } from '../components/groundQrcodeEcharts';
import { isStrictNull, GMT2UserTimeZone, dealResponse, formatMessage, isNull } from '@/utils/util';
import { fetchTaskLoad } from '@/services/api';
import {
  actionPieOption,
  generateActionPieData,
  actionBarOption,
  generateActionBarData,
} from './components/loadRobotEcharts';
import HealthCarSearchForm from '../HealthRobot/components/HealthCarSearchForm';
import FilterTaskLoadSearch from './components/FilterTaskLoadSearch';

import commonStyles from '@/common.module.less';
import style from '../HealthQrcode/qrcode.module.less';
import { sortBy, forIn } from 'lodash';

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
  const [loadOriginData, setLoadOriginData] = useState({}); // 这个放在这里--接口改变才会变
  const [filterData, setFilterData] = useState({}); //筛选小车得到的数据--默认是源数据

  const [keyAction, setKeyAction] = useState({}); //actionTranslate
  const [keyStation, setKeyStation] = useState({}); //stationTranslate 拣选工作站
  const [keyWork, setKeyWork] = useState({}); //workTranslate 任务作业

  useEffect(() => {
    async function initCodeData() {
      const startTime = GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:00:00');
      const endTime = GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:mm:ss');
      submitSearch({ startTime, endTime, agvSearch: { type: 'AGV_ID', code: [] } });
    }
    initCodeData();
  }, []);
  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [filterData, loadOriginData]);

  function initChart() {
    // 任务动作负载 -pie
    taskActionPieLine = echarts.init(document.getElementById('load_taskActionPie'));
    taskActionPieLine.setOption(actionPieOption('任务动作负载 ', keyAction), true);
    //-bar
    taskActionBarLine = echarts.init(document.getElementById('load_taskActionBar'));
    taskActionBarLine.setOption(actionBarOption('任务动作负载', keyAction), true);

    // 任务作业负载 -pie
    taskWorkPieLine = echarts.init(document.getElementById('load_taskWorkPie'));
    taskWorkPieLine.setOption(actionPieOption('任务作业负载', keyWork), true);
    // -bar
    taskWorkBarLine = echarts.init(document.getElementById('load_taskWorkBar'));
    taskWorkBarLine.setOption(actionBarOption('任务作业负载', keyWork), true);

    // 拣选工作站任务作业负载 -pie
    taskPickworkPieLine = echarts.init(document.getElementById('load_taskPickworkPie'));
    taskPickworkPieLine.setOption(actionPieOption('拣选工作站任务作业负载', keyStation), true);
    // -bar
    taskPickworkBarLine = echarts.init(document.getElementById('load_taskPickworkBar'));
    taskPickworkBarLine.setOption(actionBarOption('拣选工作站任务作业负载', keyStation), true);

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
    const sourceData = { ...filterData };

    const actionPieData = generateActionPieData(sourceData, 'actionLoad', keyAction); //动作负载-pie
    const taskWorkPieData = generateActionPieData(sourceData, 'workLoad', keyWork);
    const taskPickworkPieData = generateActionPieData(
      sourceData,
      'pickingWorkstationWorkload',
      keyStation,
    );

    const actionBarData = generateActionBarData(sourceData, 'actionLoad', keyAction); //动作负载-bar
    const taskWorkBarData = generateActionBarData(sourceData, 'workLoad', keyWork);
    const taskPickworkBarData = generateActionBarData(
      sourceData,
      'pickingWorkstationWorkload',
      keyStation,
    );

    if (actionPieData) {
      const { series, legend } = actionPieData;
      const newActionPieLine = taskActionPieLine.getOption();
      newActionPieLine.series = series;
      newActionPieLine.legend = legend;
      taskActionPieLine.setOption(newActionPieLine, true);
    }
    if (taskWorkPieData) {
      const { series, legend } = taskWorkPieData;
      const newWorkPieLine = taskWorkPieLine.getOption();
      newWorkPieLine.series = series;
      newWorkPieLine.legend = legend;
      taskWorkPieLine.setOption(newWorkPieLine, true);
    }
    if (taskPickworkPieData) {
      const { series, legend } = taskPickworkPieData;
      const newPickPieLine = taskPickworkPieLine.getOption();
      newPickPieLine.series = series;
      newPickPieLine.legend = legend;
      taskPickworkPieLine.setOption(newPickPieLine, true);
    }

    if (actionBarData) {
      const { xAxis, series, legend } = actionBarData;
      const newActionBaryLine = taskActionBarLine.getOption();
      newActionBaryLine.xAxis = xAxis;
      newActionBaryLine.series = series;
      newActionBaryLine.legend = legend;
      taskActionBarLine.setOption(newActionBaryLine, true);
    }

    if (taskWorkBarData) {
      const { xAxis, series, legend } = taskWorkBarData;
      const newtaskWorkBarLine = taskWorkBarLine.getOption();
      newtaskWorkBarLine.xAxis = xAxis;
      newtaskWorkBarLine.series = series;
      newtaskWorkBarLine.legend = legend;
      taskWorkBarLine.setOption(newtaskWorkBarLine, true);
    }
    if (taskPickworkBarData) {
      const { xAxis, series, legend } = taskPickworkBarData;
      const newtaskPickworkBarLine = taskPickworkBarLine.getOption();
      newtaskPickworkBarLine.xAxis = xAxis;
      newtaskPickworkBarLine.series = series;
      newtaskPickworkBarLine.legend = legend;
      taskPickworkBarLine.setOption(newtaskPickworkBarLine, true);
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
      const response = await fetchTaskLoad({
        startTime,
        endTime,
        agvSearchTypeValue,
        agvSearchType,
      });
      if (!dealResponse(response)) {
        let taskLoad = response?.taskLoadData || {};
        const newTaskLoad = getDatBysortTime(taskLoad);
        setLoadOriginData(newTaskLoad);
        setFilterData(newTaskLoad);
        setKeyAction(response?.actionTranslate || {});
        setKeyStation(response?.stationTranslate || {});
        setKeyWork(response?.workTranslate || {});
      }
    }
  }

  // 过滤时间
  const filterDataByTime = (data, startT, endT) => {
    const _data = { ...data };
    const newData = {};
    Object.entries(_data).forEach(([key, allcellData]) => {
      const _allCellData = [...allcellData];
      if (moment(key).isBetween(moment(startT), moment(endT))) {
        newData[key] = _allCellData;
      }
    });
    return newData;
  };

  /*
   *@searchValues 搜索条件数据
   *@param  在接口返回的数据中参数名
   * */
  const filterDataByParam = (searchValues, param) => {
    const _data = { ...loadOriginData };
    const newData = {};
    Object.entries(_data).forEach(([key, allcellData]) => {
      const _allCellData = [];
      allcellData.forEach((item) => {
        if (Array.isArray(searchValues)) {
          if (searchValues.includes(item[param])) {
            _allCellData.push(item);
          }
        } else {
          if (searchValues === item[param]) {
            _allCellData.push(item);
          }
        }
      });
      newData[key] = _allCellData;
    });
    return newData;
  };

  // 二次-search
  function onDatefilterChange(allValues) {
    let newOriginalData = { ...loadOriginData };
    if (Object.keys(loadOriginData).length === 0) return;
    const { endTime, startTime, agvId, taskType = [] } = allValues;

    //TODO:要改
    if (agvId?.length > 0) {
      newOriginalData = filterDataByParam(agvId, 'agvId');
    }

    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      newOriginalData = filterDataByTime(newOriginalData, startTime, endTime);
    }

    // 根据任务类型
    if (taskType && taskType.length > 0) {
      newOriginalData = filterDataByParam(taskType, 'taskType');
    }

    setFilterData(newOriginalData);
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
    XLSX.utils.book_append_sheet(wb, action, '任务动作负载');
    XLSX.utils.book_append_sheet(wb, work, '任务作业负载');
    XLSX.utils.book_append_sheet(wb, pickStation, '拣选工作站任务作业负载');

    XLSX.writeFile(wb, `${formatMessage({ id: 'menu.reportCenter.loadReport.taskLoad' })}.xlsx`);
  }

  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 10 }}>
        <HealthCarSearchForm
          search={submitSearch}
          type="taskload"
          downloadVisible={true}
          exportData={exportData}
        />
      </div>

      <div className={style.body}>
        <Card actions={[<FilterTaskLoadSearch key={'2'} search={onDatefilterChange} />]}>
          <Row>
            <Col span={12}>
              <div id="load_taskActionPie" style={{ minHeight: 340 }} />
            </Col>
            <Col span={12}>
              <div id="load_taskActionBar" style={{ minHeight: 340 }}></div>
            </Col>
            <Divider />
            <Col span={12}>
              <div id="load_taskWorkPie" style={{ minHeight: 340 }} />
            </Col>
            <Col span={12}>
              <div id="load_taskWorkBar" style={{ minHeight: 340 }}></div>
            </Col>
            <Divider />
            <Col span={12}>
              <div id="load_taskPickworkPie" style={{ minHeight: 340 }} />
            </Col>
            <Col span={12}>
              <div id="load_taskPickworkBar" style={{ minHeight: 340 }}></div>
            </Col>
          </Row>
        </Card>
      </div>
    </div>
  );
};
export default memo(TaskLoadComponent);
