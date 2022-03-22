import React, { useEffect, useState, memo } from 'react';
import echarts from 'echarts';
import { Row, Col, Divider, Spin } from 'antd';
import moment from 'moment';
import XLSX from 'xlsx';
import { forIn, sortBy } from 'lodash';
import { getDatBysortTime } from './GroundQrcodeEcharts';
import {
  formatMessage,
  isNull,
  isStrictNull,
  convertToUserTimezone,
  dealResponse,
} from '@/utils/util';
import { fetchCodeHealth } from '@/services/api';
import FilterSearch from './FilterSearch';
import QrcodeSearchForm from './QrcodeSearchForm';
import {
  codeHistoryLineOption,
  dateHistoryLineOption,
  generateTimeData,
  transformCodeData,
  noDataGragraphic,
  getAllCellId,
} from './GroundQrcodeEcharts';
import { filterDataByParam } from './reportUtil';
import commonStyles from '@/common.module.less';
import style from '../report.module.less';

let codeHistoryLine = null; // 根据码号
let timeHistoryLine = null; // 根据日期

const colums = {
  cellId: formatMessage({ id: 'app.map.cell' }),
  time: formatMessage({ id: 'app.time' }),
};

const QrCodeComponent = (props) => {
  const { codeDomId, dateDomId, chartTitle, codeType } = props;
  const [loading, setLoading] = useState(false);
  const [originData, setOriginData] = useState({}); // 原始数据
  const [keyData, setKeyData] = useState({}); // 所有 {key:value}

  const [timeType, setTimeType] = useState('hour');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    async function initCodeData() {
      const defaultHour = moment().subtract(1, 'hours');
      const startTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:00:00');
      const endTime = convertToUserTimezone(defaultHour).format('YYYY-MM-DD HH:59:59');
      submitSearch({ startTime, endTime });
    }
    initCodeData();
  }, []); // 默认一进来就有数据

  useEffect(refreshChart, [originData, timeType, selectedIds]);

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
    let sourceData = { ...originData };

    sourceData = filterDataByParam(sourceData, selectedIds, 'cellId');

    const currenTimeData = generateTimeData(sourceData, keyData, timeType); // 按日期
    const currentCodeData = transformCodeData(sourceData, keyData); // 按码号

    if (currentCodeData) {
      const { yAxis, series, legend } = currentCodeData;
      const newCodeHistoryLine = codeHistoryLine.getOption();

      newCodeHistoryLine.yAxis = yAxis;
      newCodeHistoryLine.series = series;
      newCodeHistoryLine.legend = legend;
      codeHistoryLine.setOption(
        {
          ...newCodeHistoryLine,
          ...noDataGragraphic(series.length),
        },
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

  // 搜索 调接口
  async function submitSearch(value) {
    const { startTime, endTime } = value;
    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      setLoading(true);
      const response = await fetchCodeHealth({ ...value, codeType });
      if (!dealResponse(response)) {
        const { qrCodeData = {}, translate } = response;

        const newQrCodeData = getDatBysortTime(qrCodeData);
        setSelectedIds(getAllCellId(newQrCodeData, 'cellId'));
        setKeyData(translate);
        setOriginData(newQrCodeData);
      }
      setLoading(false);
    }
  }

  function filterDateOnChange(values) {
    const { timeType, selectedIds } = values;
    setSelectedIds(selectedIds);
    setTimeType(timeType);
  }

  // 下载数据
  function generateEveryType() {
    const typeResult = [];
    Object.entries(originData).forEach(([key, typeData]) => {
      if (!isStrictNull(typeData)) {
        const currentTypeData = sortBy(typeData, 'cellId');
        currentTypeData.forEach((record) => {
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
    return typeResult;
  }
  function exportData() {
    const wb = XLSX.utils.book_new(); /*新建book*/
    const statusWs = XLSX.utils.json_to_sheet(generateEveryType());
    XLSX.utils.book_append_sheet(wb, statusWs, 'common');
    XLSX.writeFile(wb, `${chartTitle}.xlsx`);
  }

  return (
    <div className={commonStyles.commonPageStyle} style={{ padding: 12 }}>
      <QrcodeSearchForm search={submitSearch} exportData={exportData} />
      <Spin spinning={loading}>
        <div className={style.body}>
          <FilterSearch showCellId={true} data={originData} filterSearch={filterDateOnChange} />
          <Row gutter={16}>
            <Col span={24}>
              {/* 按照码号 */}
              <div id={codeDomId} style={{ minHeight: 350 }} />
            </Col>
            <Divider />
            <Col span={24} style={{ marginTop: 10 }}>
              {/* 按照日期 */}
              <div id={dateDomId} style={{ minHeight: 350 }} />
            </Col>
          </Row>
        </div>
      </Spin>
    </div>
  );
};
export default memo(QrCodeComponent);
