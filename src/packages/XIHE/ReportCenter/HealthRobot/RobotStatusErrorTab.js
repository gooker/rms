import React, { useEffect, useState, memo } from 'react';
import echarts from 'echarts';
import { Row, Col, Card } from 'antd';
import moment from 'moment';
import { formatMessage, isNull, isStrictNull } from '@/utils/utils';
import FilterSearch from './components/FilterSearch';
import FilterSearchBydate from './components/FilterSearchBydate';
import {
  offlineHistoryLineOption,
  generatOfflineDataByTime,
  generatOfflineDataByRobot,
  getOriginalDataByRobotId,
} from './components/RobotOfflineEchart';

let codeHistoryLine = null; // 根据小车id
let timeHistoryLine = null; // 根据日期

let commonOption = null;

const RoboStatusErrorComponent = (props) => {
  const { originData } = props;

  const [searchKey, setSearchKey] = useState([]); // 根据小车id的数据--二次搜索

  useEffect(initChart, []);

  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [originData]);

  function initChart() {
    // 根据小车id报表
    codeHistoryLine = echarts.init(document.getElementById('offlineByIRobotIdHistory'));
    codeHistoryLine.setOption(
      offlineHistoryLineOption(
        `${formatMessage({ id: 'reportCenter.robot.error' })}(${formatMessage({
          id: 'reportCenter.way.robot',
        })})`,
      ),
      true,
    );

    // 根据日期报表
    timeHistoryLine = echarts.init(document.getElementById('offlineByIdateHistory'));
    timeHistoryLine.setOption(
      offlineHistoryLineOption(
        `${formatMessage({ id: 'reportCenter.robot.error' })}(${formatMessage({
          id: 'reportCenter.way.date',
        })})`,
      ),
      true,
    );

    return () => {
      codeHistoryLine.dispose();
      codeHistoryLine = null;

      timeHistoryLine.dispose();
      timeHistoryLine = null;
    };
  }

  function refreshChart() {
    if (!codeHistoryLine || !timeHistoryLine) return;
    const sourceData = { ...originData };
    if (Object.keys(sourceData).length === 0) return;

    const currenTimeData = generatOfflineDataByTime(sourceData);
    const currentCodeData = generatOfflineDataByRobot(sourceData);

    if (currentCodeData) {
      const { xAxis, series, legend } = currentCodeData;
      const newCodeHistoryLine = codeHistoryLine.getOption();
      newCodeHistoryLine.xAxis = xAxis;
      newCodeHistoryLine.series = series;
      newCodeHistoryLine.legend = legend;
      codeHistoryLine.setOption(newCodeHistoryLine, true);
    }

    if (currenTimeData) {
      const { xAxis, series, legend } = currenTimeData;
      const newTimeHistoryLine = timeHistoryLine.getOption();
      newTimeHistoryLine.xAxis = xAxis;
      newTimeHistoryLine.series = series;
      newTimeHistoryLine.legend = legend;
      timeHistoryLine.setOption(newTimeHistoryLine, true);
    }

    const getOriginalData = getOriginalDataByRobotId(originData);
    commonOption = getOriginalData.commonOption;
    setSearchKey(getOriginalData.legendData || []); // 图列 可以用来搜索
  }

  const filterDataById = (ids) => {
    const _data = { ...originData };
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

  const onValuesChange = (changedValues, allValues) => {
    // 1.先对allValues筛选 为null就delete  eg:过滤丢码次数>=9的数据
    const newChanged = {};
    let newOriginalData = { ...originData };
    Object.entries(allValues).forEach(([key, v]) => {
      if (!isStrictNull(v)) {
        if (key === 'robotIds' && v.length > 0) {
          // 先根据robotIds 过滤数据
          newOriginalData = filterDataById(v.map((i) => i * 1));
        } else {
          if (v !== 0) {
            newChanged[key] = v;
          }
        }
      }
    });

    // filter
    const { currentSery, xAxisData, legendData } = getOriginalDataByRobotId(newOriginalData);
    const sumCellSourceData = { ...currentSery };
    const newSourceData = {};
    Object.entries(sumCellSourceData).forEach(([key, typeData]) => {
      let newKeydata = [];
      if (!isNull(typeData)) {
        typeData.forEach((record) => {
          if (record < newChanged[key]) {
            newKeydata.push(0);
          } else {
            newKeydata.push(record);
          }
        });
      }
      newSourceData[key] = newKeydata;
    });

    const series = [];
    Object.entries(newSourceData).forEach((key, index) => {
      series.push({
        ...commonOption,
        data: key[1],
        name: key[0],
        yAxisIndex: index,
        type: key[0] === 'errortime' ? 'line' : 'bar',
      });
    });
    const newCodeHistoryLine = codeHistoryLine.getOption();
    newCodeHistoryLine.series = series;
    newCodeHistoryLine.xAxis[0].data = xAxisData;
    newCodeHistoryLine.legend[0].data = legendData;
    codeHistoryLine.setOption(newCodeHistoryLine, true);
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

  function onDatefilterChange(changedValues, allValues) {
    let newOriginalData = { ...originData };
    if (Object.keys(originData).length === 0) return;
    const { endByTime, startByTime, robotIds } = allValues;

    if (robotIds && robotIds.length > 0) {
      newOriginalData = filterDataById(robotIds.map((i) => i * 1));
    }

    if (!isStrictNull(startByTime) && !isStrictNull(endByTime)) {
      // 先根据时间过滤
      newOriginalData = filterDataByTime(newOriginalData, startByTime, endByTime);
    }

    const currenTimeData = generatOfflineDataByTime(newOriginalData);
    if (currenTimeData) {
      const { xAxis, series, legend } = currenTimeData;
      const newTimeHistoryLine = timeHistoryLine.getOption();
      newTimeHistoryLine.xAxis = xAxis;
      newTimeHistoryLine.series = series;
      newTimeHistoryLine.legend = legend;
      timeHistoryLine.setOption(newTimeHistoryLine, true);
    }
  }

  return (
    <Row gutter={16}>
      <Col span={22}>
        {/* 按照小车id */}
        <Card
          actions={
            searchKey.length > 0 && [
              <FilterSearch
                key={'a'}
                prefix={'reportCenter.robot.offline'}
                searchKey={searchKey}
                onValuesChange={onValuesChange}
              />,
            ]
          }
        >
          <div id="offlineByIRobotIdHistory" style={{ minHeight: 350 }} />
        </Card>
      </Col>
      <Col span={22} style={{ marginTop: 10 }}>
        {/* 按照日期 */}
        <Card
          actions={
            searchKey.length > 0 && [
              <FilterSearchBydate key={'b'} onValuesChange={onDatefilterChange} />,
            ]
          }
        >
          <div id="offlineByIdateHistory" style={{ minHeight: 350 }} />
        </Card>
      </Col>
    </Row>
  );
};
export default memo(RoboStatusErrorComponent);
