import React, { useState, memo, useEffect } from 'react';
import { Row, Col, Table, Divider } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import { formatMessage, GMT2UserTimeZone, dealResponse, isStrictNull } from '@/utils/util';
import { fetchAGVload } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import {
  taskLineOption,
  durationLineOption,
  actionPieOption,
  actionBarOption,
  generateDurationDataByTime,
  generateNumOrDistanceData,
  generateActionPieData,
  generateActionBarData,
  generateTableData,
  formatNumber,
  MinuteFormat,
} from './components/loadRobotEcharts';
import HealthCarSearchForm from '../HealthRobot/components/HealthCarSearchForm';

import commonStyles from '@/common.module.less';
import style from '../HealthQrcode/qrcode.module.less';

let statusHistoryLine = null; // 状态时长
let taskHistoryLine = null; // 任务时长
let taskNumberHistoryLine = null; // 任务次数
let diatanceHistoryLine = null; // 任务距离
let actionPieHistoryLine = null; // 动作负载-pie
let actionBarHistoryLine = null; // 动作负载-bar

const HealthCar = (props) => {
  const [loadOriginData, setLoadOriginData] = useState({}); // 这个放在这里--接口改变才会变
  const [selectedKeys, setSelectedKeys] = useState([]); //
  const [tableData, setTableData] = useState([]); // table
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
    // 状态时长
    statusHistoryLine = echarts.init(document.getElementById('load_statustimeHistory'));
    taskHistoryLine = echarts.init(document.getElementById('load_tasktimeHistory'));
    taskNumberHistoryLine = echarts.init(document.getElementById('load_taskTimesHistory'));
    diatanceHistoryLine = echarts.init(document.getElementById('load_taskDistanceHistory'));
    // 动作负载
    actionPieHistoryLine = echarts.init(document.getElementById('load_actionPieHistory'));
    actionBarHistoryLine = echarts.init(document.getElementById('load_actionBarHistory'));

    statusHistoryLine.setOption(
      durationLineOption(formatMessage({ id: 'reportCenter.robot.load.statusduration' })),
      true,
    );
    taskHistoryLine.setOption(
      durationLineOption(formatMessage({ id: 'reportCenter.agvload.taskduration' })),
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
    actionPieHistoryLine.setOption(
      actionPieOption(formatMessage({ id: 'reportCenter.robot.load.action' })),
      true,
    );

    actionBarHistoryLine.setOption(
      actionBarOption(formatMessage({ id: 'reportCenter.robot.load.action' })),
      true,
    );

    return () => {
      statusHistoryLine.dispose();
      taskHistoryLine.dispose();
      taskNumberHistoryLine.dispose();
      diatanceHistoryLine.dispose();
      actionPieHistoryLine.dispose();
      actionBarHistoryLine.dispose();
      statusHistoryLine = null;
      taskHistoryLine = null;
      taskNumberHistoryLine = null;
      diatanceHistoryLine = null;
      actionPieHistoryLine = null;
      actionBarHistoryLine = null;
    };
  }

  function refreshChart() {
    if (!statusHistoryLine || !taskHistoryLine || !taskNumberHistoryLine || !actionPieHistoryLine)
      return;
    const sourceData = { ...filterData };

    const statusData = generateDurationDataByTime(sourceData, 'statusAllTime'); // 状态时长
    const taskdurationData = generateDurationDataByTime(sourceData, 'taskAllTime'); // 任务时长
    const taskNumData = generateNumOrDistanceData(sourceData, 'taskTimes');
    const distanceData = generateNumOrDistanceData(sourceData, 'taskDistance');
    const actionPieData = generateActionPieData(sourceData, 'actionLoad'); //动作负载-pie
    const actionBarData = generateActionBarData(sourceData, 'actionLoad'); //动作负载-bar

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

    if (actionPieData) {
      const { series, legend } = actionPieData;
      const newActionPieLine = actionPieHistoryLine.getOption();
      newActionPieLine.series = series;
      newActionPieLine.legend = legend;
      actionPieHistoryLine.setOption(newActionPieLine, true);
    }

    if (actionBarData) {
      const { xAxis, series, legend } = actionBarData;
      const newActionBaryLine = actionBarHistoryLine.getOption();
      newActionBaryLine.xAxis = xAxis;
      newActionBaryLine.series = series;
      newActionBaryLine.legend = legend;
      actionBarHistoryLine.setOption(newActionBaryLine, true);
    }

    // table数据
    const { currentRobotData } = generateTableData(loadOriginData);
    setTableData(currentRobotData);
  }

  // 搜索 调接口
  async function submitSearch(value) {
    const {
      startTime,
      endTime,
      agvSearch: { code: agvSearchTypeValue, type: agvSearchType },
    } = value;
    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      const response = await fetchAGVload({
        startTime,
        endTime,
        agvSearchTypeValue,
        agvSearchType,
      });
      if (!dealResponse(response)) {
        const loadData=response?.AGVLoadData || {};
        setLoadOriginData(loadData);
        setFilterData(loadData);
        setSelectedKeys([]);
      }
    }
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
    selectedRowKeys: selectedKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      let filterData;
      if (selectedRowKeys.length === 0) {
        filterData = { ...loadOriginData };
      } else {
        filterData = filterDataByRobotId(selectedRowKeys);
      }
      setFilterData(filterData);
      setSelectedKeys(selectedRowKeys);
    },
  };
  const columns = [
    {
      title: <FormattedMessage id="app.form.agvId" />,
      dataIndex: 'agvId',
      sorter: (a, b) => a.robotId - b.robotId,
    },
    {
      title: <FormattedMessage id="app.agv.type" />,
      dataIndex: 'robotType',
    },
    {
      title: <FormattedMessage id="reportCenter.agvload.taskduration" />,
      dataIndex: 'taskAllTime',
      sorter: (a, b) => a.taskAllTime - b.taskAllTime,
      render: (text) => {
        return MinuteFormat(text);
      },
    },
    {
      title: '充电耗时',
      dataIndex: 'statusAllTime',
      sorter: (a, b) => a.statusAllTime - b.statusAllTime,
      render: (text) => {
        return MinuteFormat(text);
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
      <div style={{ marginBottom: 10, display: 'flex', flexFlow: 'column wrap' }}>
        <HealthCarSearchForm
          search={submitSearch}
          downloadVisible={true}
          sourceData={loadOriginData}
        />
      </div>

      <div className={style.body}>
        <Row>
          <Col span={12}>
            <div id="load_statustimeHistory" style={{ minHeight: 340 }} />
          </Col>
          <Col span={12}>
            <div id="load_tasktimeHistory" style={{ minHeight: 340 }} />
          </Col>
          <Divider />
          <Col span={12}>
            <div id="load_actionPieHistory" style={{ minHeight: 340 }} />
          </Col>
          <Col span={12}>
            <div id="load_actionBarHistory" style={{ minHeight: 340 }} />
          </Col>
          <Divider />
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
