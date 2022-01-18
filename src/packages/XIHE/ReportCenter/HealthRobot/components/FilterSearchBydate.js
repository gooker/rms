import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import TimePickerSelector from '../../components/timePicker';

const formLayout = { labelCol: { span: 9 }, wrapperCol: { span: 14 } };

const FilterSearchBytime = (props) => {
  const { onValuesChange } = props;

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
    <div style={{ position: 'relative' }}>
      {togglesDate === 1 ? (
        <>
          <Form form={formDate} onValuesChange={onValuesChange} {...formLayout}>
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
                  <TimePickerSelector defaultType={'hour'}  /> 
                  {/* disabledChangeType={true} */}
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
