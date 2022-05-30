import React, { memo, useEffect, useState } from 'react';
import { Col, Row } from 'antd';
import echarts from 'echarts';
import { noDataGragraphic } from '@/packages/Report/components/GroundQrcodeEcharts';
import { generatOfflineDataByVehicle, generatOfflineDataByTime, offlineHistoryLineOption } from './VehicleOfflineEchart';
import FilterSearch from '@/packages/Report/components/FilterSearch';
import { filterDataByParam } from '@/packages/Report/components/reportUtil';
import { formatMessage } from '@/utils/util';

let codeHistoryLine = null; // 根据码号
let timeHistoryLine = null; // 根据日期

const OfflineOrStatusErrorComponent = (props) => {
  const {
    codeDomId,
    dateDomId,
    chartTitle,
    chartSubTitle,
    originData,
    keyData,
    activeTab,
    originIds,
  } = props;
  const [timeType, setTimeType] = useState('hour');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    setSelectedIds(originIds);
  }, [originIds]);

  useEffect(refreshChart, [originData, keyData, activeTab, timeType, selectedIds]);

  function initChart() {
    // 根据码号报表
    codeHistoryLine = echarts.init(document.getElementById(`${codeDomId}`));
    codeHistoryLine.setOption(
      offlineHistoryLineOption(`${chartTitle}(${chartSubTitle})`, keyData),
      true,
    );

    // 根据日期报表
    timeHistoryLine = echarts.init(document.getElementById(`${dateDomId}`));
    timeHistoryLine.setOption(
      offlineHistoryLineOption(
        `${chartTitle}(${formatMessage({
          id: 'reportCenter.way.date',
        })})`,
        keyData,
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
    initChart();
    if (!codeHistoryLine || !timeHistoryLine) return;
    let sourceData = { ...originData };

    sourceData = filterDataByParam(sourceData, selectedIds, 'vehicleId');

    const currenTimeData = generatOfflineDataByTime(sourceData, keyData, timeType);
    const currentCodeData = generatOfflineDataByVehicle(sourceData, keyData, 'vehicleId');

    if (currentCodeData) {
      const { xAxis, series, legend } = currentCodeData;
      const newCodeHistoryLine = codeHistoryLine.getOption();
      newCodeHistoryLine.xAxis = xAxis;
      newCodeHistoryLine.series = series;
      newCodeHistoryLine.legend = legend;
      codeHistoryLine.setOption(
        { ...newCodeHistoryLine, ...noDataGragraphic(series.length) },
        true,
      );
    }

    if (currenTimeData) {
      const { xAxis, series, legend } = currenTimeData;
      const newTimeHistoryLine = timeHistoryLine.getOption();
      newTimeHistoryLine.xAxis = xAxis;
      newTimeHistoryLine.series = series;
      newTimeHistoryLine.legend = legend;
      timeHistoryLine.setOption(
        { ...newTimeHistoryLine, ...noDataGragraphic(series.length) },
        true,
      );
    }
  }

  function filterDateOnChange(values) {
    const { timeType, selectedIds } = values;
    setSelectedIds(selectedIds);
    setTimeType(timeType);
  }

  return (
    <div style={{ margin: '20px 0' }}>
      <FilterSearch showCellId={false} data={originData} filterSearch={filterDateOnChange} />
      <Row gutter={16}>
        <Col span={24}>
          {/* 按照码号 */}
          <div id={codeDomId} style={{ minHeight: 350 }} />
        </Col>
        <Col span={24} style={{ marginTop: 10 }}>
          {/* 按照日期 */}
          <div id={dateDomId} style={{ minHeight: 350 }} />
        </Col>
      </Row>
    </div>
  );
};
export default memo(OfflineOrStatusErrorComponent);
