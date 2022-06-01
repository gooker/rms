import React, { memo, useEffect, useState } from 'react';
import { Col, Divider, Row, Spin, Table } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import XLSX from 'xlsx';
import { forIn, sortBy } from 'lodash';
import { getAllCellId, getDatBysortTime, noDataGragraphic } from '../components/GroundQrcodeEcharts';
import { convertToUserTimezone, dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import { fetchVehicleload } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import FilterSearch from '@/packages/Report/components/FilterSearch';
import { filterDataByParam } from '@/packages/Report/components/reportUtil';
import {
  actionBarOption,
  actionPieOption,
  durationLineOption,
  formatNumber,
  generateActionBarData,
  generateActionPieData,
  generateDurationDataByTime,
  generateNumOrDistanceData,
  generateTableData,
  MinuteFormat,
  taskLineOption,
} from './components/loadVehicleEcharts';
import HealthCarSearchForm from '../components/HealthCarSearchForm';
import commonStyles from '@/common.module.less';
import style from '../report.module.less';

const colums = {
  time: formatMessage({ id: 'app.time' }),
  vehicleType: formatMessage({ id: 'app.vehicleType' }),
};

const taskTypes = {
  EMPTY_RUN: '空跑',
  CHARGE_RUN: '充电',
  REST_UNDER_POD: '回休息区',
  CARRY_POD_TO_CELL: '搬运货架',
  CARRY_POD_TO_STATION: '工作站任务',
  SUPER_CARRY_POD_TO_CELL: '高级搬运任务',
  HEARVY_CARRY_POD_TO_STORE: '重车回存储区',
  CUSTOM_TASK: '自定义任务',
  FROCK_CARRY_TO_CELL: '工装车搬运',
  HEARVY_CARRY_POD_TO_STATION: '重车去工作站',
  ROLLER_CARRY_TO_CELL: '滚筒搬运',
  RUN_TO_SAFETY_AREA: '异常车去安全区',
};

let statusHistoryLine = null; // 状态时长
let taskHistoryLine = null; // 任务时长
let taskNumberHistoryLine = null; // 任务次数
let diatanceHistoryLine = null; // 任务距离
let actionPieHistoryLine = null; // 动作负载-pie
let actionBarHistoryLine = null; // 动作负载-bar

const HealthCar = (props) => {
  const [loading, setLoading] = useState(false);
  const [loadOriginData, setLoadOriginData] = useState({}); // 这个放在这里--接口改变才会变

  const [timeType, setTimeType] = useState('hour');
  const [selectedIds, setSelectedIds] = useState([]);

  const [selectedKeys, setSelectedKeys] = useState([]); //
  const [tableData, setTableData] = useState([]); // table
  const [filterData, setFilterData] = useState({}); //筛选小车得到的数据--默认是源数据

  const [keyAction, setKeyAction] = useState({}); // actionTranslate
  const [keyStatus, setKeyStatus] = useState({}); //status
  const [keyTask, setKeyTask] = useState({}); //task
  const [keyTimes, setTimes] = useState({}); //任务次数
  const [keyDisatance, setKeyDisatance] = useState({}); //任务距离

  useEffect(() => {
    async function initCodeData() {
      const defaultHour = moment().subtract(1, 'hours');
      const startTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:00:00');
      const endTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:59:59');
      submitSearch({ startTime, endTime, vehicleSearch: { type: 'Vehicle_ID', code: [] } });
    }
    initCodeData();
  }, []);
  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [filterData, loadOriginData, timeType, selectedIds]);

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
      durationLineOption(
        formatMessage({ id: 'reportCenter.vehicle.load.statusduration' }),
        keyStatus,
      ),
      true,
    );
    taskHistoryLine.setOption(
      durationLineOption(formatMessage({ id: 'reportCenter.vehicleload.taskduration' }), keyTask),
      true,
    );
    taskNumberHistoryLine.setOption(
      taskLineOption(formatMessage({ id: 'reportCenter.vehicleload.taskNumber' }), keyTimes),
      true,
    );
    diatanceHistoryLine.setOption(
      taskLineOption(formatMessage({ id: 'reportCenter.vehicleload.taskDistance' }), keyDisatance),
      true,
    );
    actionPieHistoryLine.setOption(
      actionPieOption(formatMessage({ id: 'reportCenter.vehicle.load.action' }), keyAction),
      true,
    );

    actionBarHistoryLine.setOption(
      actionBarOption(formatMessage({ id: 'reportCenter.vehicle.load.action' }), keyAction),
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
    initChart();
    if (!statusHistoryLine || !taskHistoryLine || !taskNumberHistoryLine || !actionPieHistoryLine)
      return;

    let sourceData = { ...filterData };
    sourceData = filterDataByParam(sourceData, selectedIds, 'vehicleId');

    const statusData = generateDurationDataByTime(
      sourceData,
      'statusAllTime',
      keyStatus,
      true,
      timeType,
    ); // 状态时长
    const taskdurationData = generateDurationDataByTime(
      sourceData,
      'taskAllTime',
      keyTask,
      false,
      timeType,
    ); // 任务时长
    const taskNumData = generateNumOrDistanceData(sourceData, 'taskTimes', keyTimes, timeType);
    const distanceData = generateNumOrDistanceData(
      sourceData,
      'taskDistance',
      keyDisatance,
      timeType,
    );
    const actionPieData = generateActionPieData(sourceData, 'actionLoad', keyAction); //动作负载-pie
    const actionBarData = generateActionBarData(sourceData, 'actionLoad', keyAction, timeType); //动作负载-bar

    if (statusData) {
      const { radiusAxis, series, legend } = statusData;
      const newStatusHistoryLine = statusHistoryLine.getOption();
      newStatusHistoryLine.radiusAxis = radiusAxis;
      newStatusHistoryLine.series = series;
      newStatusHistoryLine.legend = legend;

      newStatusHistoryLine.angleAxis[0].show = series.length;
      newStatusHistoryLine.radiusAxis.show = series.length;
      statusHistoryLine.setOption(
        { ...newStatusHistoryLine, ...noDataGragraphic(series.length) },
        true,
      );
    }

    if (taskdurationData) {
      const { radiusAxis, series, legend } = taskdurationData;
      const newTaskdurationHistoryLine = taskHistoryLine.getOption();
      newTaskdurationHistoryLine.radiusAxis = radiusAxis;
      newTaskdurationHistoryLine.series = series;
      newTaskdurationHistoryLine.legend = legend;

      newTaskdurationHistoryLine.angleAxis[0].show = series.length;
      newTaskdurationHistoryLine.radiusAxis.show = series.length;

      taskHistoryLine.setOption(
        { ...newTaskdurationHistoryLine, ...noDataGragraphic(series.length) },
        true,
      );
    }

    if (taskNumData) {
      const { xAxis, series } = taskNumData;
      const newTaskNumHistoryLine = taskNumberHistoryLine.getOption();
      newTaskNumHistoryLine.xAxis = xAxis;
      newTaskNumHistoryLine.series = series;
      taskNumberHistoryLine.setOption(
        { ...newTaskNumHistoryLine, ...noDataGragraphic(series.length) },
        true,
      );
    }
    if (distanceData) {
      const { xAxis, series } = distanceData;
      const newDistanceHistoryLine = diatanceHistoryLine.getOption();
      newDistanceHistoryLine.xAxis = xAxis;
      newDistanceHistoryLine.series = series;
      diatanceHistoryLine.setOption(
        { ...newDistanceHistoryLine, ...noDataGragraphic(series.length) },
        true,
      );
    }

    if (actionPieData) {
      const { series, legend } = actionPieData;
      const newActionPieLine = actionPieHistoryLine.getOption();
      newActionPieLine.series = series;
      newActionPieLine.legend = legend;
      actionPieHistoryLine.setOption(
        { ...newActionPieLine, ...noDataGragraphic(series[0]?.data?.length) },
        true,
      );
    }

    if (actionBarData) {
      const { xAxis, series, legend } = actionBarData;
      const newActionBaryLine = actionBarHistoryLine.getOption();
      newActionBaryLine.xAxis = xAxis;
      newActionBaryLine.series = series;
      newActionBaryLine.legend = legend;
      actionBarHistoryLine.setOption(
        { ...newActionBaryLine, ...noDataGragraphic(series.length) },
        true,
      );
    }

    // table数据
    const { currentVehicleData } = generateTableData(loadOriginData, selectedIds);
    setTableData(currentVehicleData);
  }

  function generateStatus(allStatus) {
    const statusMap = {};
    allStatus.map((item) => {
      statusMap[item] = formatMessage({ id: `app.activity.${item}` });
    });
    return statusMap;
  }

  function getAllTaskType(newLoadData) {
    const taskTypeKeys = new Set();
    Object.values(newLoadData).forEach((record) => {
      record?.forEach((item) => {
        forIn(item?.taskAllTime, (value, key) => {
          taskTypeKeys.add(key);
        });
      });
    });

    const newTaskTypeMap = {};
    [...taskTypeKeys]?.map((key) => {
      newTaskTypeMap[key] = taskTypes[key];
    });

    return newTaskTypeMap;
  }

  // 搜索 调接口
  async function submitSearch(value) {
    const {
      startTime,
      endTime,
      vehicleSearch: { code: vehicleSearchTypeValue, type: vehicleSearchType },
    } = value;
    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      setLoading(true);

      const response = await fetchVehicleload({
        startTime,
        endTime,
        vehicleSearchTypeValue,
        vehicleSearchType,
      });
      if (!dealResponse(response)) {
        let loadData = response?.VehicleLoadData || {};
        const newLoadData = getDatBysortTime(loadData);

        setKeyAction(response?.translate || {});
        setKeyStatus(generateStatus(response?.status));
        setKeyTask(getAllTaskType(newLoadData));

        setTimes({
          taskNumber: formatMessage({ id: 'reportCenter.vehicleload.taskNumber' }),
        });

        setKeyDisatance({
          taskDistance: formatMessage({ id: 'reportCenter.vehicleload.taskDistance' }),
        });

        setSelectedIds(getAllCellId(newLoadData, 'vehicleId'));
        setLoadOriginData(newLoadData);
        setFilterData(newLoadData);
        setSelectedKeys([]);
      }

      setLoading(false);
    }
  }

  // 下载
  function generateEveryType(allData, type, keyData) {
    const typeResult = [];
    Object.keys(allData).forEach((key) => {
      const typeData = allData[key];
      if (!isStrictNull(typeData)) {
        const currentTypeData = sortBy(typeData, 'vehicleId');
        currentTypeData.forEach((record) => {
          let currentTime = {};
          let _record = {};
          currentTime[colums.time] = key;
          currentTime.vehicleId = record.vehicleId;
          currentTime[colums.vehicleType] = record.vehicleType;
          if (!isNull(type)) {
            _record = { ...record[type] };
          }
          forIn(_record, (value, parameter) => {
            const _param = keyData[parameter] ?? parameter;
            currentTime[_param] = value;
          });
          typeResult.push(currentTime);
        });
      }
    });
    return typeResult;
  }

  function exportData() {
    const wb = XLSX.utils.book_new(); /*新建book*/
    const statusWs = XLSX.utils.json_to_sheet(
      generateEveryType(loadOriginData, 'statusAllTime', keyStatus),
    );
    const taskWs = XLSX.utils.json_to_sheet(
      generateEveryType(loadOriginData, 'taskAllTime', keyTask),
    );
    const actionWs = XLSX.utils.json_to_sheet(
      generateEveryType(loadOriginData, 'actionLoad', keyAction),
    );
    const taskNumWs = XLSX.utils.json_to_sheet(
      generateEveryType(loadOriginData, 'taskTimes', keyTimes),
    );
    const taskDistanceWs = XLSX.utils.json_to_sheet(
      generateEveryType(loadOriginData, 'taskDistance', keyDisatance),
    );
    XLSX.utils.book_append_sheet(
      wb,
      statusWs,
      formatMessage({ id: 'reportCenter.vehicle.load.statusduration' }),
    );
    XLSX.utils.book_append_sheet(
      wb,
      taskWs,
      formatMessage({ id: 'reportCenter.vehicleload.taskduration' }),
    );
    XLSX.utils.book_append_sheet(
      wb,
      actionWs,
      formatMessage({ id: 'reportCenter.vehicle.load.action' }),
    );
    XLSX.utils.book_append_sheet(
      wb,
      taskNumWs,
      formatMessage({ id: 'reportCenter.vehicleload.taskNumber' }),
    );
    XLSX.utils.book_append_sheet(
      wb,
      taskDistanceWs,
      formatMessage({ id: 'reportCenter.vehicleload.taskDistance' }),
    );
    XLSX.writeFile(wb, `${formatMessage({ id: 'menu.loadReport.vehicleLoad' })}.xlsx`);
  }

  // 124
  const filterDataByVehicleId = (ids) => {
    const _data = { ...loadOriginData };
    const newData = {};
    Object.entries(_data).forEach(([key, allcellData]) => {
      const _allCellData = [];
      allcellData.forEach((item) => {
        if (ids.includes(item.vehicleId)) {
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
        filterData = filterDataByVehicleId(selectedRowKeys);
      }
      setFilterData(filterData);
      setSelectedKeys(selectedRowKeys);
    },
  };
  const columns = [
    {
      title: <FormattedMessage id='vehicle.id' />,
      dataIndex: 'vehicleId',
      sorter: (a, b) => a.vehicleId - b.vehicleId,
    },
    {
      title: <FormattedMessage id='app.vehicleType' />,
      dataIndex: 'vehicleType',
    },
    {
      title: <FormattedMessage id="reportCenter.vehicleload.taskduration" />,
      dataIndex: 'taskAllTime',
      sorter: (a, b) => a.taskAllTime - b.taskAllTime,
      render: (text) => {
        return MinuteFormat(text);
      },
    },
    {
      title: <FormattedMessage id="reportCenter.vehicleload.chargingtime" />,
      dataIndex: 'statusAllTime',
      sorter: (a, b) => a.statusAllTime - b.statusAllTime,
      render: (text) => {
        return MinuteFormat(text);
      },
    },
    {
      title: <FormattedMessage id="reportCenter.vehicleload.walkingdistance" />,
      dataIndex: 'taskDistance',
      sorter: (a, b) => a.taskDistance - b.taskDistance,
      render: (text) => {
        return text ? formatNumber(text) + formatMessage({ id: 'app.report.mile' }) : '-';
      },
    },
  ];

  function filterDateOnChange(values) {
    const { timeType, selectedIds } = values;
    setSelectedIds(selectedIds);
    setTimeType(timeType);
  }

  return (
    <div className={commonStyles.commonPageStyle}>
      <HealthCarSearchForm
        search={submitSearch}
        downloadVisible={true}
        sourceData={loadOriginData}
        exportData={exportData}
      />

      <div className={style.body}>
        <Spin spinning={loading}>
          <FilterSearch
            showCellId={false}
            data={loadOriginData}
            filterSearch={filterDateOnChange}
          />
          <Row style={{ padding: 15 }}>
            <Col span={12}>
              <div id="load_statustimeHistory" style={{ minHeight: 340 }} />
            </Col>
            <Col span={12}>
              <div id="load_tasktimeHistory" style={{ minHeight: 340 }} />
            </Col>
            <Divider />
            <Col span={12}>
              <div id="load_actionPieHistory" style={{ minHeight: 380 }} />
            </Col>
            <Col span={12}>
              <div id="load_actionBarHistory" style={{ minHeight: 390 }} />
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
                rowKey={'vehicleId'}
                pagination={false}
                scroll={{ y: 300 }}
              />
            </Col>
          </Row>
        </Spin>
      </div>
    </div>
  );
};
export default memo(HealthCar);
