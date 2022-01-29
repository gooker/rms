import React, { useEffect, useState, memo } from 'react';
import echarts from 'echarts';
import { Row, Col, Card } from 'antd';
import moment from 'moment';
import { formatMessage, isNull, isStrictNull } from '@/utils/util';
import FilterSearch from './components/FilterSearch';
import FilterSearchBydate from './components/FilterSearchBydate';
import {
  dateHistoryLineOption,
  codeHistoryLineOption,
  generateTimeData,
  transformCodeData,
  getOriginalDataBycode,
} from './components/RobotHealthEcharts';

let codeHistoryLine = null; // 根据码号
let timeHistoryLine = null; // 根据日期

let commonOption = null;

const ScanCodeComponent = (props) => {
  const { originData } = props;

  const [searchKey, setSearchKey] = useState([]); // 根据码号的数据--二次搜索

  useEffect(initChart, []);

  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [originData]);

  function initChart() {
    // 根据码号报表
    codeHistoryLine = echarts.init(document.getElementById('ScancodeByIdHistory'));
    codeHistoryLine.setOption(
      codeHistoryLineOption(formatMessage({ id: 'reportCenter.robot.scancode' })),
      true,
    );

    // 根据日期报表
    timeHistoryLine = echarts.init(document.getElementById('ScancodeBydateHistory'));
    timeHistoryLine.setOption(
      dateHistoryLineOption(formatMessage({ id: 'reportCenter.robot.scancode' })),
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

    const currenTimeData = generateTimeData(sourceData);
    const currentCodeData = transformCodeData(sourceData);

    if (currentCodeData) {
      const { yAxis, series, legend } = currentCodeData;
      const newCodeHistoryLine = codeHistoryLine.getOption();
      newCodeHistoryLine.yAxis = yAxis;
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
    // 拿到原始数据的 所有参数 所有根据小车的参数求和
    const getOriginalData = getOriginalDataBycode(originData);
    commonOption = getOriginalData.commonOption;
    setSearchKey(getOriginalData.legendData || []);
  }

  const filterDataByCellId = (ids) => {
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
          // 先根据cellId 过滤数据
          newOriginalData = filterDataByCellId(v.map((i) => i * 1));
        } else {
          if (v !== 0) {
            newChanged[key] = v;
          }
        }
      }
    });

    // filter
    const { currentSery, yxisData, legendData } = getOriginalDataBycode(newOriginalData);
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
    Object.entries(newSourceData).forEach((key) => {
      series.push({
        ...commonOption,
        data: key[1],
        name: key[0],
        type: 'bar',
      });
    });
    const newCodeHistoryLine = codeHistoryLine.getOption();
    newCodeHistoryLine.series = series;
    newCodeHistoryLine.yAxis[0].data = yxisData;
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
      newOriginalData = filterDataByCellId(robotIds.map((i) => i * 1));
    }

    if (!isStrictNull(startByTime) && !isStrictNull(endByTime)) {
      // 先根据时间过滤
      newOriginalData = filterDataByTime(newOriginalData, startByTime, endByTime);
    }

    const currenTimeData = generateTimeData(newOriginalData);
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
        {/* 按照码号 */}
        <Card
          actions={
            searchKey.length > 0 && [
              <FilterSearch key={'a'} searchKey={searchKey} onValuesChange={onValuesChange} />,
            ]
          }
        >
          <div id="ScancodeByIdHistory" style={{ minHeight: 350 }} />
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
          <div id="ScancodeBydateHistory" style={{ minHeight: 350 }} />
        </Card>
      </Col>
    </Row>
  );
};
export default memo(ScanCodeComponent);
