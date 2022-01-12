import React, { useEffect, useState, memo, useRef, forwardRef, useImperativeHandle } from 'react';
import echarts from 'echarts';
import { Row, Col, Form, Input, Select, Card, Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import moment from 'moment';
import { formatMessage, isNull, isStrictNull } from '@/utils/utils';
import TimePickerSelector from '../components/timePicker';
import {
  dateHistoryLineOption,
  codeHistoryLineOption,
  generateTimeData,
  transformCodeData,
  getOriginalDataBycode,
} from './components/scanRobotEcharts';

const formLayout = { labelCol: { span: 9 }, wrapperCol: { span: 14 } };

let codeHistoryLine = null; // 根据码号
let timeHistoryLine = null; // 根据日期

let commonOption = null;

const ScanCodeComponent = (props, ref) => {
  const { originData } = props;
  const [form] = Form.useForm();
  const [formDate] = Form.useForm();

  const [searchKey, setSearchKey] = useState([]); // 根据码号的数据--二次搜索

  const [togglesDate, setTogglesDate] = useState(0);

  const Ref = useRef();
  useImperativeHandle(ref, () => ({
    clearForm: () => {
      console.log('1111');
      form.resetFields();
      formDate.resetFields();
    },
  }));

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
    // 拿到原始数据的 所有参数 所有根据cellId的参数求和
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
    <Row gutter={16} ref={Ref}>
      <Col span={22}>
        {/* 按照码号 */}
        <Card
          actions={[
            <div key="a" style={{ position: 'relative' }}>
              <Form form={form} onValuesChange={onValuesChange} {...formLayout}>
                <Row>
                  {searchKey.length > 0 ? (
                    <>
                      {searchKey.map((key) => {
                        return (
                          <Col span={6} key={key}>
                            <Form.Item
                              name={key}
                              label={formatMessage({
                                id: `reportCenter.qrcodehealth.${key}`,
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
                    </>
                  ) : (
                    ' '
                  )}
                </Row>
              </Form>
            </div>,
          ]}
        >
          <div id="ScancodeByIdHistory" style={{ minHeight: 350 }} />
        </Card>
      </Col>
      <Col span={24}>
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
                          <TimePickerSelector defaultType={'hour'} disabledChangeType={true} />
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
          <div id="ScancodeBydateHistory" style={{ minHeight: 350 }} />
        </Card>
      </Col>
    </Row>
  );
};
export default forwardRef(ScanCodeComponent);
