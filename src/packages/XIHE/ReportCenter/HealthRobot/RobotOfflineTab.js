import React, { useEffect, useState, memo } from 'react';
import echarts from 'echarts';
import { Row, Col, Form, Input, Select, Card, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import moment from 'moment';
import { formatMessage, isNull, isStrictNull } from '@/utils/utils';
import TimePickerSelector from '../components/timePicker';
import {
  offlineHistoryLineOption,
  generatOfflineDataByTime,
  generatOfflineDataByRobot,
  getOriginalDataByRobotId,
} from './components/RobotOfflineEchart';

const formLayout = { labelCol: { span: 9 }, wrapperCol: { span: 14 } };

let codeHistoryLine = null; // 根据小车id
let timeHistoryLine = null; // 根据日期

let commonOption = null;

const RobotOfflineComponent = (props) => {
  const { originData } = props;
  const [form] = Form.useForm();
  const [formDate] = Form.useForm();

  const [searchKey, setSearchKey] = useState([]); // 根据小车id的数据--二次搜索

  const [togglesDate, setTogglesDate] = useState(0);

  useEffect(initChart, []);

  // 源数据变化触发显重新拉取数据 二次搜索
  useEffect(refreshChart, [originData]);

  function initChart() {
    console.log('进来');
    // 根据小车id报表
    codeHistoryLine = echarts.init(document.getElementById('offlineByIRobotIdHistory'));
    codeHistoryLine.setOption(
      offlineHistoryLineOption(
        `${formatMessage({ id: 'reportCenter.robot.offline' })}(${formatMessage({
          id: 'reportCenter.way.robot',
        })})`,
      ),
      true,
    );

    // 根据日期报表
    timeHistoryLine = echarts.init(document.getElementById('offlineByIdateHistory'));
    timeHistoryLine.setOption(
      offlineHistoryLineOption(
        `${formatMessage({ id: 'reportCenter.robot.offline' })}(${formatMessage({
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
        type: key[0] === 'offlinetime' ? 'line' : 'bar',
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
          actions={[
            <div key="a" style={{ position: 'relative' }}>
              <Form form={form} onValuesChange={onValuesChange} {...formLayout}>
                <Row>
                  {searchKey.length > 0 ? (
                    <>
                      {searchKey.map((key) => {
                        return (
                          <Col span={4} key={key}>
                            <Form.Item
                              name={key}
                              label={formatMessage({
                                id: `reportCenter.robot.offline.${key}`,
                              })}
                              rules={[
                                {
                                  pattern: new RegExp(/^[1-9]\d*$/, 'g'),
                                  message: '请输入正整数',
                                },
                              ]}
                            >
                              <Input allowClear />
                            </Form.Item>
                          </Col>
                        );
                        // }
                      })}

                      <Col span={4}>
                        <Form.Item name={'robotIds'} label={<FormattedMessage id="app.agv" />}>
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            maxTagTextLength={5}
                            maxTagCount={4}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                    </>
                  ) : (
                    ' '
                  )}
                </Row>
              </Form>
            </div>,
          ]}
        >
          <div id="offlineByIRobotIdHistory" style={{ minHeight: 350 }} />
        </Card>
      </Col>
      <Col span={22}>
        {/* 按照日期 */}
        <Card
          actions={[
            <div key="b" style={{ position: 'relative' }}>
              {searchKey.length > 0 && togglesDate === 1 ? (
                <>
                  <Form form={formDate} onValuesChange={onDatefilterChange} {...formLayout}>
                    <Row>
                      <Form.Item hidden name={'startByTime'} />
                      <Form.Item hidden name={'endByTime'} />
                      <Col span={6}>
                        <Form.Item name={'robotIds'} label={<FormattedMessage id="app.agv" />}>
                          <Select
                            mode="tags"
                            style={{ width: '100%' }}
                            maxTagTextLength={5}
                            maxTagCount={4}
                            allowClear
                          />
                        </Form.Item>
                      </Col>
                      <Col span={18}>
                        <Form.Item
                          {...formLayout}
                          name={'rangeNum'}
                          label={<FormattedMessage id="app.form.dateRange" />}
                          getValueFromEvent={(value) => {
                            const { setFieldsValue } = formDate;
                            setFieldsValue({
                              startByTime: value.startTime,
                              endByTime: value.endTime,
                              rangeNum: value.timeDate,
                            });
                            return value.timeDate;
                          }}
                        >
                          <TimePickerSelector />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Form>
                  <Row>
                    <Col span={24} style={{ padding: '10px 0', borderTop: '1px solid #e8e8e8' }}>
                      <Button
                        type="text"
                        onClick={() => {
                          setTogglesDate(0);
                        }}
                      >
                        <UpOutlined />
                        {'收起'}
                      </Button>
                    </Col>
                  </Row>
                </>
              ) : searchKey.length > 0 ? (
                <Row>
                  <Col span={24}>
                    <Button
                      type="text"
                      style={{ padding: '10px 0' }}
                      onClick={() => {
                        setTogglesDate(1);
                      }}
                    >
                      <DownOutlined />
                      {'展开'}
                    </Button>
                  </Col>
                </Row>
              ) : (
                ''
              )}
            </div>,
          ]}
        >
          <div id="offlineByIdateHistory" style={{ minHeight: 350 }} />
        </Card>
      </Col>
    </Row>
  );
};
export default memo(RobotOfflineComponent);
