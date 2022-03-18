import React, { useEffect, useState, memo } from 'react';
import echarts from 'echarts';
import { Row, Col, Card } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
import { forIn, sortBy } from 'lodash';
import { getDatBysortTime } from './groundQrcodeEcharts';
import { formatMessage, isNull, isStrictNull, GMT2UserTimeZone, dealResponse } from '@/utils/util';
import { fetchCodeHealth } from '@/services/api';
import FilterSearchBydate from '../HealthRobot/components/FilterSearchBydate';
import FilterSearch from '../HealthRobot/components/FilterSearch';
import QrcodeSearchForm from './QrcodeSearchForm';
import {
  codeHistoryLineOption,
  dateHistoryLineOption,
  generateTimeData,
  transformCodeData,
  getOriginalDataBycode,
  commonOption,
} from './groundQrcodeEcharts';
import commonStyles from '@/common.module.less';
import style from '../HealthQrcode/qrcode.module.less';

let codeHistoryLine = null; // 根据码号
let timeHistoryLine = null; // 根据日期

const colums = {
  cellId: formatMessage({ id: 'app.map.cell' }),
  time: formatMessage({ id: 'app.time' }),
};

const QrCodeComponent = (props) => {
  const { codeDomId, dateDomId, chartTitle, codeType } = props;
  const [originData, setOriginData] = useState({}); // 原始数据
  const [keyData, setKeyData] = useState({}); // 所有 {key:value}

  useEffect(() => {
    async function initCodeData() {
      const startTime = GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:00:00');
      const endTime = GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:mm:ss');
      submitSearch({ startTime, endTime });
    }
    initCodeData();
  }, []); // 默认一进来就有数据

  // useEffect(initChart, []);
  useEffect(refreshChart, [originData]);

  function initChart() {
    // 根据码号报表
    codeHistoryLine = echarts.init(document.getElementById(`${codeDomId}`));
    codeHistoryLine.setOption(
      codeHistoryLineOption(
        `${chartTitle}(${formatMessage({
          id: 'reportCenter.way.cellId',
        })})`,
        keyData,
      ),
      true,
    );

    // 根据日期报表
    timeHistoryLine = echarts.init(document.getElementById(`${dateDomId}`));
    timeHistoryLine.setOption(dateHistoryLineOption(chartTitle, keyData), true);

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
    const currentCodeData = transformCodeData(sourceData, keyData);

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

  // 搜索 调接口
  async function submitSearch(value) {
    const { startTime, endTime } = value;
    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      const response = await fetchCodeHealth({ ...value, codeType });
      if (!dealResponse(response)) {
        const { qrCodeData = {}, translate } = response;

        const newQrCodeData = getDatBysortTime(qrCodeData);
        setOriginData(newQrCodeData);
        setKeyData(translate);
      }
    }
  }

  // 先根据cellId 过滤数据
  const filterDataByCellId = (cellIds) => {
    const _data = { ...originData };
    const newData = {};
    Object.entries(_data).forEach(([key, allcellData]) => {
      const _allCellData = [];
      allcellData.forEach((item) => {
        if (cellIds.includes(item.cellId)) {
          _allCellData.push(item);
        }
      });
      newData[key] = _allCellData;
    });
    return newData;
  };

  // 根据时间 过滤数据
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

  // 按照码号搜索
  const qrcodeSearch = (allValues) => {
    // 1.先对allValues筛选 为null就delete  eg:过滤丢码次数>=9的数据
    const newChanged = {};
    let newOriginalData = { ...originData };
    Object.entries(allValues).forEach(([key, v]) => {
      if (!isStrictNull(v)) {
        if (key === 'cellId' && v.length > 0) {
          newOriginalData = filterDataByCellId(v.map((i) => i * 1));
        } else {
          newChanged[key] = v;
        }
      }
    });

    // filter
    const { currentSery, yxisData } = getOriginalDataBycode(newOriginalData, keyData, 'cellId');
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
    codeHistoryLine.setOption(newCodeHistoryLine, true);
  };

  // 按日期二次搜索
  function qrcodeTimeSearch(allValues) {
    let newOriginalData = { ...originData };
    const { endByTime, startByTime, cellId } = allValues;

    if (cellId && cellId.length > 0) {
      newOriginalData = filterDataByCellId(cellId.map((i) => i * 1));
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

  // 下载数据

  function generateEveryType() {
    const typeResult = [];
    Object.entries(originData).forEach(([key, typeData]) => {
      if (!isStrictNull(typeData)) {
        typeData.forEach((record) => {
          let currentTime = {};
          let _record = { ...record };
          currentTime[colums.time] = key;
          currentTime[colums.cellId] = record.cellId;
          forIn(_record, (value, parameter) => {
            if (!isNull(keyData[parameter])) {
              currentTime[keyData[parameter]] = value;
            }
          });
          typeResult.push(currentTime);
        });
      }
    });
    return sortBy(typeResult, 'cellId');
  }
  function exportData() {
    const wb = XLSX.utils.book_new(); /*新建book*/
    const statusWs = XLSX.utils.json_to_sheet(generateEveryType());
    XLSX.utils.book_append_sheet(wb, statusWs, 'common');
    XLSX.writeFile(wb, `${chartTitle}.xlsx`);
  }

  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 10 }}>
        <QrcodeSearchForm search={submitSearch} exportData={exportData} />
      </div>

      <div className={style.body}>
        <Row gutter={16}>
          <Col span={22}>
            {/* 按照码号 */}
            <Card
              actions={
                Object.keys(originData).length > 0 && [
                  <FilterSearch
                    key={'a'}
                    showCellId={true}
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
                  <FilterSearchBydate
                    key={'b'}
                    refreshCharts={qrcodeTimeSearch}
                    showCellId={true}
                  />,
                ]
              }
            >
              <div id={dateDomId} style={{ minHeight: 350 }} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default memo(QrCodeComponent);
