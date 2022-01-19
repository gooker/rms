import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Select, DatePicker } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import TimePickerSelector from '../../components/timePicker';

const formLayout = { labelCol: { span: 6 }, wrapperCol: { span: 14 } };
const { RangePicker } = DatePicker;
let _name = null;

const FilterSearchBytime = (props) => {
  const { onValuesChange, name } = props;
  _name = name || 'robotIds';

  const [formDate] = Form.useForm();
  const [togglesDate, setTogglesDate] = useState(0);

  useEffect(() => {
    function init() {}
    init();
  }, []);

  // function clearForm() {
  //   formDate.resetFields();
  // }

  return (
    <div>
      {togglesDate === 1 ? (
        <>
          <Form form={formDate} onValuesChange={onValuesChange} {...formLayout}>
            <Form.Item hidden name={'startByTime'} />
            <Form.Item hidden name={'endByTime'} />
            <Row>
              <Col flex="auto">
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
                  <TimePickerSelector defaultType={'hour'} />
                  {/* disabledChangeType={true} */}
                </Form.Item>
              </Col>

              {/* <Col flex="auto">
                <Form.Item
                  name="timeRange"
                  getValueFromEvent={(value) => {
                    const { setFieldsValue } = formDate;
                    setFieldsValue({
                      startByTime: value[0].format('YYYY-MM-DD HH:00:00'),
                      endByTime: value[1].format('YYYY-MM-DD HH:00:00'),
                    });
                    return value;
                  }}
                >
                  <RangePicker
                    style={{ width: '335px' }}
                    showTime={{ format: 'HH' }}
                    format="YYYY-MM-DD HH:00:00"
                  />
                </Form.Item>
              </Col> */}
              <Col span={6}>
                <Form.Item name={_name} label={<FormattedMessage id="app.agv" />}>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    maxTagTextLength={5}
                    maxTagCount={4}
                    allowClear
                  />
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
                <FormattedMessage id="app.reportCenter.packUp" />
              </Button>
            </Col>
          </Row>
        </>
      ) : (
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
              <FormattedMessage id="app.reportCenter.expand" />
            </Button>
          </Col>
        </Row>
      )}
    </div>
  );
};
export default memo(FilterSearchBytime);
