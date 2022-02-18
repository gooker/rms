import React, { useState, memo, useEffect } from 'react';
import { Row, Col, Table, Divider } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import { formatMessage } from '@/utils/util';
import { getTaskLoadData } from './components/mockTaskLockData';
import { actionPieOption, generateActionPieData } from './components/loadRobotEcharts';
import HealthCarSearchForm from '../HealthRobot/components/HealthCarSearchForm';

import commonStyles from '@/common.module.less';
import style from '../HealthQrcode/qrcode.module.less';

let taskActionPieLine = null; // 任务动作负载-pie
let taskWorkPieLine = null; // 任务作业负载-pie
let taskPickworkPieLine = null; // 拣选工作站任务作业负载-pie

const HealthCar = (props) => {
  const [loadOriginData, setLoadOriginData] = useState({}); // 这个放在这里--接口改变才会变
  const [filterData, setFilterData] = useState({}); //筛选小车得到的数据--默认是源数据

  useEffect(initChart, []);
  useEffect(submitSearch, []);
  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [filterData, loadOriginData]);

  function initChart() {
    // 任务动作负载 -pie
    taskActionPieLine = echarts.init(document.getElementById('load_taskActionPie'));
    taskActionPieLine.setOption(actionPieOption('任务动作负载'), true);

    // 任务作业负载 -pie
    taskWorkPieLine = echarts.init(document.getElementById('load_taskWorkPie'));
    taskWorkPieLine.setOption(actionPieOption('任务作业负载'), true);

    // 拣选工作站任务作业负载 -pie
    taskPickworkPieLine = echarts.init(document.getElementById('load_taskPickworkPie'));
    taskPickworkPieLine.setOption(actionPieOption('拣选工作站任务作业负载'), true);

    return () => {
      taskActionPieLine.dispose();
      taskWorkPieLine.dispose();
      taskPickworkPieLine.dispose();
      taskActionPieLine = null;
      taskWorkPieLine = null;
      taskPickworkPieLine = null;
    };
  }

  function refreshChart() {
    if (!taskPickworkPieLine || !taskWorkPieLine || !taskActionPieLine) return;
    const sourceData = { ...filterData };
    if (Object.keys(sourceData).length === 0) return;

    const actionPieData = generateActionPieData(sourceData, 'actionLoad'); //动作负载-pie
    const taskWorkPieData = generateActionPieData(sourceData, 'workLoad');
    const taskPickworkPieData = generateActionPieData(sourceData, 'pickingWorkstationWorkload');

    if (actionPieData) {
      const { series } = actionPieData;
      const newActionPieLine = taskActionPieLine.getOption();
      newActionPieLine.series = series;
      taskActionPieLine.setOption(newActionPieLine, true);
    }
    // if (taskWorkPieData) {
    //   const { series } = taskWorkPieData;
    //   const newWorkPieLine = taskWorkPieLine.getOption();
    //   newWorkPieLine.series = series;
    //   taskActionPieLine.setOption(newWorkPieLine, true);
    // }
    // if (taskPickworkPieData) {
    //   const { series } = taskPickworkPieData;
    //   const newActionPieLine = taskPickworkPieLine.getOption();
    //   newActionPieLine.series = series;
    //   taskActionPieLine.setOption(newActionPieLine, true);
    // }

    // if (taskWorkPieData) {
    //   const { xAxis, series } = actionBarData;
    //   const newActionBaryLine = actionBarHistoryLine.getOption();
    //   newActionBaryLine.xAxis = xAxis;
    //   newActionBaryLine.series = series;
    //   actionBarHistoryLine.setOption(newActionBaryLine, true);
    // }
  }

  // 搜索 调接口
  function submitSearch(value) {
    // TODO 调接口
    setLoadOriginData(getTaskLoadData());
    setFilterData(getTaskLoadData());
  }

  // 根据小车id过滤数据
  const filterDataByRobotId = (ids) => {
    const _data = { ...loadOriginData };
    const newData = {};
    Object.entries(_data).forEach(([key, allcellData]) => {
      const _allCellData = [];
      allcellData.forEach((item) => {
        if (ids.includes(item.robotId)) {
          _allCellData.push(item);
        }
      });
      newData[key] = _allCellData;
    });
    return newData;
  };
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      let filterData;
      if (selectedRowKeys.length === 0) {
        filterData = { ...loadOriginData };
      } else {
        filterData = filterDataByRobotId(selectedRowKeys);
      }
      setFilterData(filterData);
    },
  };

  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 10 }}>
        <HealthCarSearchForm search={submitSearch} type="taskload" />
      </div>

      <div className={style.body}>
        <Row>
          <Col span={12}>
            <div id="load_taskActionPie" style={{ minHeight: 340 }} />
          </Col>
          <Divider />
          <Col span={12}>
            <div id="load_taskWorkPie" style={{ minHeight: 340 }} />
          </Col>
          <Divider />
          <Col span={12}>
            <div id="load_taskPickworkPie" style={{ minHeight: 340 }} />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default memo(HealthCar);
