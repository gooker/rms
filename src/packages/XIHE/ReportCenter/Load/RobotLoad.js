import React, { useState, memo, useEffect } from 'react';
import { Row, Col, Table } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import { formatMessage } from '@/utils/util';
import { getloadRobotdata } from './components/mockLoadData';
import {
  taskLineOption,
  durationLineOption,
  generateDurationDataByTime,
  generateNumOrDistanceData,
  generateTableData,
  formatNumber,
} from './components/loadRobotEcharts';
import HealthCarSearchForm from '../HealthRobot/components/HealthCarSearchForm';

import commonStyles from '@/common.module.less';
import style from '../HealthQrcode/qrcode.module.less';

let statusHistoryLine = null; // 状态时长
let taskHistoryLine = null; // 任务时长
let taskNumberHistoryLine = null; // 任务次数
let diatanceHistoryLine = null; // 任务距离

const HealthCar = (props) => {
  const [loadOriginData, setLoadOriginData] = useState({}); // 这个放在这里--接口改变才会变
  const [tableData, setTableData] = useState([]); // table
  const [filterData, setFilterData] = useState({}); //筛选小车得到的数据--默认是源数据

  useEffect(initChart, []);
  useEffect(submitSearch, []);
  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [filterData, loadOriginData]);

  function initChart() {
    // 状态时长
    statusHistoryLine = echarts.init(document.getElementById('load_statustimeHistory'));
    taskHistoryLine = echarts.init(document.getElementById('load_tasktimeHistory'));
    taskNumberHistoryLine = echarts.init(document.getElementById('load_taskTimesHistory'));
    diatanceHistoryLine = echarts.init(document.getElementById('load_taskDistanceHistory'));

    statusHistoryLine.setOption(
      durationLineOption(formatMessage({ id: 'reportCenter.robot.load.statusduration' })),
      true,
    );
    taskHistoryLine.setOption(
      durationLineOption(formatMessage({ id: 'reportCenter.robot.load.taskduration' })),
      true,
    );
    taskNumberHistoryLine.setOption(
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
      taskNumberHistoryLine.dispose();
      diatanceHistoryLine.dispose();
      statusHistoryLine = null;
      taskHistoryLine = null;
      taskNumberHistoryLine = null;
      diatanceHistoryLine = null;
    };
  }

  function refreshChart() {
    if (!statusHistoryLine || !taskHistoryLine || !taskNumberHistoryLine) return;
    const sourceData = { ...filterData };
    if (Object.keys(sourceData).length === 0) return;

    const statusData = generateDurationDataByTime(sourceData, 'statusallTime');
    const taskdurationData = generateDurationDataByTime(sourceData, 'taskallTime');
    const taskNumData = generateNumOrDistanceData(sourceData, 'taskTimes');
    const distanceData = generateNumOrDistanceData(sourceData, 'taskDistance');

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

    if (taskNumData) {
      const { xAxis, series } = taskNumData;
      const newTaskNumHistoryLine = taskNumberHistoryLine.getOption();
      newTaskNumHistoryLine.xAxis = xAxis;
      newTaskNumHistoryLine.series = series;
      taskNumberHistoryLine.setOption(newTaskNumHistoryLine, true);
    }
    if (distanceData) {
      const { xAxis, series } = distanceData;
      const newDistanceHistoryLine = diatanceHistoryLine.getOption();
      newDistanceHistoryLine.xAxis = xAxis;
      newDistanceHistoryLine.series = series;
      diatanceHistoryLine.setOption(newDistanceHistoryLine, true);
    }

    // table数据
    const { currentRobotData } = generateTableData(loadOriginData);
    setTableData(currentRobotData);
  }

  // 搜索 调接口
  function submitSearch(value) {
    // TODO 调接口
    setLoadOriginData(getloadRobotdata());
    setFilterData(getloadRobotdata());
  }

  // 124
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
      console.log(filterData);
      setFilterData(filterData);
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  const columns = [
    {
      title: '车辆ID',
      dataIndex: 'robotId',
      sorter: (a, b) => a.robotId - b.robotId,
    },
    {
      title: '车辆类型',
      dataIndex: 'robotType',
    },
    {
      title: '任务时长',
      dataIndex: 'taskallTime',
      sorter: (a, b) => a.taskallTime - b.taskallTime,
      render: (text) => {
        let d = moment.duration(text, 'minutes');
        return Math.floor(d.asDays()) + '天' + d.hours() + '时' + d.minutes() + '分';
      },
    },
    {
      title: '充电耗时',
      dataIndex: 'statusallTime', //
      sorter: (a, b) => a.statusallTime - b.statusallTime,
      render: (text) => {
        let d = moment.duration(text, 'minutes');
        return Math.floor(d.asDays()) + '天' + d.hours() + '时' + d.minutes() + '分';
      },
    },
    {
      title: '行走距离',
      dataIndex: 'taskDistance',
      sorter: (a, b) => a.taskDistance - b.taskDistance,
      render: (text) => {
        return formatNumber(text) + '米';
      },
    },
  ];

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
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={tableData}
              rowKey={'robotId'}
              pagination={false}
              scroll={{ y: 300 }}
            />
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default memo(HealthCar);
