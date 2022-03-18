import React, { useState, memo, useEffect } from 'react';
import { Row, Col, Divider, Card } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import { isStrictNull, GMT2UserTimeZone, dealResponse } from '@/utils/util';
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

let taskActionPieLine = null; // 任务动作负载-pie
let taskWorkPieLine = null; // 任务作业负载-pie
let taskPickworkPieLine = null; // 拣选工作站任务作业负载-pie

let taskActionBarLine = null; // 任务动作负载-bar(日期x轴)
let taskWorkBarLine = null;
let taskPickworkBarLine = null;

const HealthTask = (props) => {
  const [loadOriginData, setLoadOriginData] = useState({}); // 这个放在这里--接口改变才会变
  const [filterData, setFilterData] = useState({}); //筛选小车得到的数据--默认是源数据

  useEffect(initChart, []);
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
    taskActionPieLine.setOption(actionPieOption('任务动作负载 '), true);
    //-bar
    taskActionBarLine = echarts.init(document.getElementById('load_taskActionBar'));
    taskActionBarLine.setOption(actionBarOption('任务动作负载'), true);

    // 任务作业负载 -pie
    taskWorkPieLine = echarts.init(document.getElementById('load_taskWorkPie'));
    taskWorkPieLine.setOption(actionPieOption('任务作业负载'), true);
    // -bar
    taskWorkBarLine = echarts.init(document.getElementById('load_taskWorkBar'));
    taskWorkBarLine.setOption(actionBarOption('任务作业负载'), true);

    // 拣选工作站任务作业负载 -pie
    taskPickworkPieLine = echarts.init(document.getElementById('load_taskPickworkPie'));
    taskPickworkPieLine.setOption(actionPieOption('拣选工作站任务作业负载'), true);
    // -bar
    taskPickworkBarLine = echarts.init(document.getElementById('load_taskPickworkBar'));
    taskPickworkBarLine.setOption(actionBarOption('拣选工作站任务作业负载'), true);

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
    if (!taskPickworkPieLine || !taskWorkPieLine || !taskActionPieLine || !taskActionBarLine)
      return;
    const sourceData = { ...filterData };

    const actionPieData = generateActionPieData(sourceData, 'actionLoad'); //动作负载-pie
    const taskWorkPieData = generateActionPieData(sourceData, 'workLoad');
    const taskPickworkPieData = generateActionPieData(sourceData, 'pickingWorkstationWorkload');

    const actionBarData = generateActionBarData(sourceData, 'actionLoad'); //动作负载-bar
    const taskWorkBarData = generateActionBarData(sourceData, 'workLoad');
    const taskPickworkBarData = generateActionBarData(sourceData, 'pickingWorkstationWorkload');

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
        const taskLoad=response?.taskLoadData || {}
        setLoadOriginData(taskLoad);
        setFilterData(taskLoad);
      }
    }
  }

  // 二次-search
  function onDatefilterChange(allValues) {
    let newOriginalData = { ...loadOriginData };
    if (Object.keys(loadOriginData).length === 0) return;
    const { endTime, startTime, robot, agvTaskType = [] } = allValues;

    if (robot && robot?.code.length > 0) {
      newOriginalData = filterDataByParam(
        robot?.code.map((item) => item * 1),
        'robotId',
      );
    }

    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      // 先根据时间过滤
      newOriginalData = filterDataByTime(newOriginalData, startTime, endTime);
    }

    // 根据任务类型
    if (agvTaskType && agvTaskType.length > 0) {
      newOriginalData = filterDataByParam(agvTaskType, 'taskType');
    }

    setFilterData(newOriginalData);
  }

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

  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 10 }}>
        <HealthCarSearchForm search={submitSearch} type="taskload" downloadVisible={true} />
      </div>

      <div className={style.body}>
        <Card actions={[<FilterTaskLoadSearch key={'2'} searchChange={onDatefilterChange} />]}>
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
export default memo(HealthTask);
