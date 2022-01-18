import React, { useState, memo, useEffect } from 'react';
import { Row, Col, Table } from 'antd';
import echarts from 'echarts';
import { formatMessage } from '@/utils/utils';
import { getloadRobotdata } from './components/mockLoadData';
import {
  taskLineOption,
  durationLineOption,
  generateDurationDataByTime,
} from './components/loadRobotEcharts';
import HealthCarSearchForm from '../HealthRobot/components/HealthCarSearchForm';

import commonStyles from '@/common.module.less';
import style from '../HealthQrcode/qrcode.module.less';

let statusHistoryLine = null; // 状态时长
let taskHistoryLine = null; // 任务时长
let timeHistoryLine = null; // 任务次数
let diatanceHistoryLine = null; // 任务距离

const HealthCar = (props) => {
  const [loadOriginData, setLoadOriginData] = useState({}); // 原始数据
  useEffect(initChart, []);
  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [loadOriginData]);

  function initChart() {
    // 状态时长
    statusHistoryLine = echarts.init(document.getElementById('load_statustimeHistory'));
    taskHistoryLine = echarts.init(document.getElementById('load_tasktimeHistory'));
    timeHistoryLine = echarts.init(document.getElementById('load_taskTimesHistory'));
    diatanceHistoryLine = echarts.init(document.getElementById('load_taskDistanceHistory'));

    statusHistoryLine.setOption(
      durationLineOption(formatMessage({ id: 'reportCenter.robot.load.statusduration' })),
      true,
    );
    taskHistoryLine.setOption(
      durationLineOption(formatMessage({ id: 'reportCenter.robot.load.taskduration' })),
      true,
    );
    timeHistoryLine.setOption(
      taskLineOption(formatMessage({ id: 'reportCenter.robot.load.taskNumber' })),
      true,
    );
    diatanceHistoryLine.setOption(
      taskLineOption(formatMessage({ id: 'reportCenter.robot.load.taskDistance' })),
      true,
    );

    return () => {
      statusHistoryLine.dispose();
      taskHistoryLine.dispose();
      timeHistoryLine.dispose();
      diatanceHistoryLine.dispose();
      statusHistoryLine = null;
      taskHistoryLine = null;
      timeHistoryLine = null;
      diatanceHistoryLine = null;
    };
  }

  function refreshChart() {
    if (!statusHistoryLine || !taskHistoryLine) return;
    const sourceData = { ...loadOriginData };
    if (Object.keys(sourceData).length === 0) return;

    const statusData = generateDurationDataByTime(sourceData, 'statusallTime');
    const taskdurationData = generateDurationDataByTime(sourceData, 'taskallTime');

    if (statusData) {
      const { radiusAxis, series, legend } = statusData;
      const newStatusHistoryLine = statusHistoryLine.getOption();
      newStatusHistoryLine.radiusAxis = radiusAxis;
      newStatusHistoryLine.series = series;
      newStatusHistoryLine.legend = legend;
      statusHistoryLine.setOption(newStatusHistoryLine, true);
    }

    if (taskdurationData) {
      const { radiusAxis, series, legend } = taskdurationData;
      const newTaskdurationHistoryLine = taskHistoryLine.getOption();
      newTaskdurationHistoryLine.radiusAxis = radiusAxis;
      newTaskdurationHistoryLine.series = series;
      newTaskdurationHistoryLine.legend = legend;
      taskHistoryLine.setOption(newTaskdurationHistoryLine, true);
    }
  }

  // 搜索 调接口
  function submitSearch(value) {
    // TODO 调接口
    setLoadOriginData(getloadRobotdata());
  }

  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 10 }}>
        <HealthCarSearchForm search={submitSearch} />
      </div>

      <div className={style.body}>
        <Row>
          <Col span={12}>
            <div id="load_statustimeHistory" style={{ minHeight: 340 }} />
          </Col>
          <Col span={12}>
            <div id="load_tasktimeHistory" style={{ minHeight: 340 }} />
          </Col>
          <Col span={12}>
            <div id="load_taskTimesHistory" style={{ minHeight: 340 }} />
          </Col>
          <Col span={12}>
            <div id="load_taskDistanceHistory" style={{ minHeight: 340 }} />
          </Col>
        </Row>
        <Row gutter={[26, 16]}>
          <Col span={24}>
            <Table />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default memo(HealthCar);
