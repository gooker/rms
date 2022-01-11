import React, { useEffect, useState, memo } from 'react';
import echarts from 'echarts';
import { Row, Col, Form, Button, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import TimePickerSelector from '../components/timePicker';
import {
  codeHistoryLineOption,
  dateHistoryLineOption,
  generateTimeData,
  transformCodeData,
} from '../components/groundQrcodeEcharts';
import { getQrcodedata } from '../components/mockData';
import commonStyles from '@/common.module.less';
import style from './qrcode.module.less';

// const formLayout = { labelCol: { span: 8 }, wrapperCol: { span: 14 } };
const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };

let codeHistoryLine = null; // 根据码号
let timeHistoryLine = null; // 根据日期

const GroundQrcode = (props) => {
  const [form] = Form.useForm();

  const [codeData, setCodeData] = useState({}); // 根据码号的数据
  const [timeData, setTimeData] = useState({}); // 根据日期的数据

  useEffect(initChart, []);

  // 数据变化触发显重新拉取数据
  useEffect(refreshChart, [codeData, timeData]);

  function initChart() {
    // 根据码号报表
    codeHistoryLine = echarts.init(document.getElementById('groundCodeByCellIdHistory'));
    codeHistoryLine.setOption(codeHistoryLineOption(), true);

    // 根据日期报表
    timeHistoryLine = echarts.init(document.getElementById('groundCodeBydateHistory'));
    timeHistoryLine.setOption(dateHistoryLineOption(), true);

    return () => {
      codeHistoryLine.dispose();
      codeHistoryLine = null;

      timeHistoryLine.dispose();
      timeHistoryLine = null;
    };
  }

  function refreshChart() {
    if (!codeHistoryLine || !timeHistoryLine) return;

    const sourceData = getQrcodedata();

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

  function submitSearch() {
    form.validateFields().then((value) => {
      console.log(value);
    });
  }
  return (
    <div className={commonStyles.commonPageStyle}>
      <div style={{ marginBottom: 20 }}>
        <Form form={form}>
          <Form.Item hidden name={'startTime'} />
          <Form.Item hidden name={'endTime'} />
          <Form.Item hidden name={'type'} />
          <Row gutter={24}>
            {/* 日期 */}
            <Col>
              <Form.Item
                name={'timeNum'}
                label={<FormattedMessage id="app.form.dateRange" />}
                getValueFromEvent={(value) => {
                  const { setFieldsValue } = form;
                  setFieldsValue({
                    startTime: value.startTime,
                    endTime: value.endTime,
                    type: value.dateType,
                    timeNum: value.timeDate,
                  });
                  return value.timeDate;
                }}
              >
                <TimePickerSelector />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item name={'codes'} label={<FormattedMessage id="app.common.code" />}>
                <Select
                  mode="tags"
                  style={{ width: '100%' }}
                  maxTagTextLength={5}
                  maxTagCount={4}
                />
              </Form.Item>
            </Col>

            <Col>
              <Form.Item {...NoLabelFormLayout}>
                <Row justify="end">
                  <Button type="primary" onClick={submitSearch}>
                    <FormattedMessage id="app.button.search" />
                  </Button>
                </Row>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>

      <div
        className={style.body}
        // style={{
        //   height: `calc(100% - 110px - 24px)`,
        // }}
      >
        {/* 按照码号 */}
        <div id="groundCodeByCellIdHistory" style={{ minHeight: 350 }} />
        {/* 按照日期 */}

        <div id="groundCodeBydateHistory" style={{ minHeight: 350, marginTop: 30 }} />
      </div>
    </div>
  );
};
export default memo(GroundQrcode);
