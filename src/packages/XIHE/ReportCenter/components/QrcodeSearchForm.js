import React, { memo, useEffect } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import TimePickerSelector from './timePicker';

const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };

const LogSearchForm = (props) => {
  const { search, data } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    function init() {}
    init();
  }, []);

  function submitSearch() {
    form.validateFields().then((values) => {
      search(values);
    });
  }

  return (
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
            <Select mode="tags" style={{ width: '100%' }} maxTagTextLength={5} maxTagCount={4} />
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
  );
};
export default memo(LogSearchForm);
