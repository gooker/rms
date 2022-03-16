import React, { useEffect, useState, memo } from 'react';
import echarts from 'echarts';
import { Row, Col, Form, Card } from 'antd';
import moment from 'moment';
import { formatMessage, isNull, isStrictNull,GMT2UserTimeZone,dealResponse } from '@/utils/util';
import { fetchCodeHealth } from '@/services/api';
import FilterSearchBydate from '../HealthRobot/components/FilterSearchBydate';
import FilterSearch from '../HealthRobot/components/FilterSearch';
import QrcodeSearchForm from '../components/QrcodeSearchForm';
import {
  codeHistoryLineOption,
  dateHistoryLineOption,
  generateTimeData,
  transformCodeData,
  getOriginalDataBycode,
} from '../components/groundQrcodeEcharts';
import commonStyles from '@/common.module.less';
import style from './qrcode.module.less';

let codeHistoryLine = null; // 根据码号
let timeHistoryLine = null; // 根据日期

let commonOption = null;

const GroundQrcode = (props) => {
  const [form] = Form.useForm();
  const [formDate] = Form.useForm();
  const [originData, setOriginData] = useState({}); // 原始数据

  const [searchKey, setSearchKey] = useState([]); // 根据码号的数据--二次搜索

  useEffect(initChart, []);
  useEffect(() => {
    async function initCodeData() {
      const startTime = GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:00:00');
      const endTime = GMT2UserTimeZone(moment()).format('YYYY-MM-DD HH:mm:ss');
      submitSearch({ startTime, endTime });
    }
    initCodeData();
  }, []); // 默认一进来就有数据
  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [originData]);

  function initChart() {
    // 根据码号报表
    codeHistoryLine = echarts.init(document.getElementById('toteCodeByCellIdHistory'));
    codeHistoryLine.setOption(
      codeHistoryLineOption(formatMessage({ id: 'reportCenter.qrcodehealth.tote' })),
      true,
    );

    // 根据日期报表
    timeHistoryLine = echarts.init(document.getElementById('toteCodeBydateHistory'));
    timeHistoryLine.setOption(
      dateHistoryLineOption(formatMessage({ id: 'reportCenter.qrcodehealth.tote' })),
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
  }

  // 搜索 调接口
  async function submitSearch(value) {
    const { startTime, endTime } = value;
    if (!isStrictNull(startTime) && !isStrictNull(endTime)) {
      const response = await fetchCodeHealth({ ...value, codeType: 'BIN' });
      if (!dealResponse(response)) {
        const originalData = getOriginalDataBycode(response); //拿到原始数据的 所有参数 所有根据cellId的参数求和
        commonOption = originalData.commonOption;
        setSearchKey(originalData.legendData || []);
        setOriginData(response);
        form.resetFields();
        formDate.resetFields();
      }
    }
  }

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

  const onValuesChange = (changedValues, allValues) => {
    // 1.先对allValues筛选 为null就delete  eg:过滤丢码次数>=9的数据
    const newChanged = {};
    let newOriginalData = { ...originData };
    Object.entries(allValues).forEach(([key, v]) => {
      if (!isStrictNull(v)) {
        if (key === 'cellId' && v.length > 0) {
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

  function onDatefilterChange(allValues) {
    let newOriginalData = { ...originData };
    if (Object.keys(originData).length === 0) return;
    const { endByTime, startByTime, cellId } = allValues;

    if (cellId && cellId.length > 0) {
      newOriginalData = filterDataByCellId(cellId.map((i) => i * 1));
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
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 10 }}>
        <QrcodeSearchForm search={submitSearch} sourceData={originData} name={formatMessage({id:'reportCenter.qrcodehealth.tote'})}/>
      </div>

      <div className={style.body}>
        <Row gutter={16}>
          <Col span={22}>
            {/* 按照码号 */}
            <Card
              actions={
                searchKey.length > 0 && [
                  <FilterSearch
                    key={'a'}
                    prefix={'reportCenter.qrcodehealth'}
                    type={'cellId'}
                    searchKey={searchKey}
                    onValuesChange={onValuesChange}
                  />,
                ]
              }
            >
              <div id="toteCodeByCellIdHistory" style={{ minHeight: 350 }} />
            </Card>
          </Col>
          <Col span={22} style={{ marginTop: 10 }}>
            {/* 按照日期 */}
            <Card
              actions={
                searchKey.length > 0 && [
                  <FilterSearchBydate
                    key={'b'}
                    refreshCharts={onDatefilterChange}
                    type={'cellId'}
                  />,
                ]
              }
            >
              <div id="toteCodeBydateHistory" style={{ minHeight: 350 }} />
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default memo(GroundQrcode);
