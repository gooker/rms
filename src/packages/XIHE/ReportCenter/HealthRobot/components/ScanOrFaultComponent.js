import React, { useEffect, memo } from 'react';
import { Row, Col, Card } from 'antd';
import echarts from 'echarts';
import moment from 'moment';
import { isNull, isStrictNull } from '@/utils/util';
import FilterSearchBydate from './FilterSearchBydate';
import FilterSearch from './FilterSearch';
import {
  codeHistoryLineOption,
  dateHistoryLineOption,
  generateTimeData,
  transformCodeData,
  getOriginalDataBycode,
  commonOption,
} from '../../components/groundQrcodeEcharts';

let codeHistoryLine = null; // 根据码号
let timeHistoryLine = null; // 根据日期

const ScanOrFaultComponent = (props) => {
  const { codeDomId, dateDomId, chartTitle, chartSubTitle, originData, keyData, activeTab } = props;

  useEffect(refreshChart, [originData, keyData, activeTab]);

  function initChart() {
    // 根据码号报表
    codeHistoryLine = echarts.init(document.getElementById(`${codeDomId}`));
    codeHistoryLine.setOption(
      codeHistoryLineOption(`${chartTitle}(${chartSubTitle})`, keyData),
      true,
    );

    // 根据日期报表
    timeHistoryLine = echarts.init(document.getElementById(`${dateDomId}`));
    timeHistoryLine.setOption(dateHistoryLineOption(`${chartTitle}`, keyData), true);

    return () => {
      codeHistoryLine.dispose();
      codeHistoryLine = null;

      timeHistoryLine.dispose();
      timeHistoryLine = null;
    };
  }

  function refreshChart() {
    initChart();
    if (!codeHistoryLine || !timeHistoryLine) return;
    const sourceData = { ...originData };

    const currenTimeData = generateTimeData(sourceData, keyData);
    const currentCodeData = transformCodeData(sourceData, keyData, 'agvId');

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
  }

  // 先根据agvId 过滤数据
  const filterDataById = (Ids) => {
    const _data = { ...originData };
    const newData = {};
    Object.entries(_data).forEach(([key, allIdData]) => {
      const _allIdData = [];
      allIdData.forEach((item) => {
        if (Ids.includes(item.agvId)) {
          _allIdData.push(item);
        }
      });
      newData[key] = _allIdData;
    });
    return newData;
  };

  // 根据时间 过滤数据
  const filterDataByTime = (data, startT, endT) => {
    const _data = { ...data };
    const newData = {};
    Object.entries(_data).forEach(([key, allIdData]) => {
      if (moment(key).isBetween(moment(startT), moment(endT))) {
        newData[key] = [...allIdData];
      }
    });
    return newData;
  };

  // 按照码号搜索
  const qrcodeSearch = (allValues) => {
    // 1.先对allValues筛选 为null就delete  eg:过滤丢码次数>=9的数据
    const newChanged = {};
    let newOriginalData = { ...originData };
    Object.entries(allValues).forEach(([key, v]) => {
      if (!isStrictNull(v)) {
        if (key === 'agvId' && v.length > 0) {
          newOriginalData = filterDataById(v.map((i) => i * 1));
        } else {
          newChanged[key] = v;
        }
      }
    });

    // filter
    const { currentSery, yxisData } = getOriginalDataBycode(newOriginalData, keyData, 'agvId');
    const newSourceData = {};
    Object.entries(currentSery).forEach(([key, typeData]) => {
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
    codeHistoryLine.setOption(newCodeHistoryLine, true);
  };

  // 按日期二次搜索
  function qrcodeTimeSearch(allValues) {
    let newOriginalData = { ...originData };
    const { endByTime, startByTime, agvId } = allValues;

    if (agvId?.length > 0) {
      newOriginalData = filterDataById(agvId.map((i) => i * 1));
    }

    if (!isStrictNull(startByTime) && !isStrictNull(endByTime)) {
      newOriginalData = filterDataByTime(newOriginalData, startByTime, endByTime);
    }

    const currenTimeData = generateTimeData(newOriginalData, keyData);
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
    <>
      <Row gutter={16}>
        <Col span={22}>
          {/* 按照码号 */}
          <Card
            actions={
              Object.keys(originData).length > 0 && [
                <FilterSearch
                  key={'a'}
                  showAgvId={true}
                  searchKey={keyData}
                  qrcodeSearch={qrcodeSearch}
                />,
              ]
            }
          >
            <div id={codeDomId} style={{ minHeight: 350 }} />
          </Card>
        </Col>
        <Col span={22} style={{ marginTop: 10 }}>
          {/* 按照日期 */}
          <Card
            actions={
              Object.keys(originData).length > 0 && [
                <FilterSearchBydate key={'b'} refreshCharts={qrcodeTimeSearch} showAgvId={true} />,
              ]
            }
          >
            <div id={dateDomId} style={{ minHeight: 350 }} />
          </Card>
        </Col>
      </Row>
    </>
  );
};
export default memo(ScanOrFaultComponent);
