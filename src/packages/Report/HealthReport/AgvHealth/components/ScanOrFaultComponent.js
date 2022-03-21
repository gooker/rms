import React, { useEffect, memo } from 'react';
import { Row, Col } from 'antd';
import echarts from 'echarts';
import {
  codeHistoryLineOption,
  dateHistoryLineOption,
  generateTimeData,
  transformCodeData,
  noDataGragraphic,
} from '@/packages/Report/components/GroundQrcodeEcharts';

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



  return (
    <>
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
    </>
  );
};
export default memo(ScanOrFaultComponent);
