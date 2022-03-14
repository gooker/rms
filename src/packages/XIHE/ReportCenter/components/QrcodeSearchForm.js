import React, { memo, useEffect } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { isNull } from '@/utils/util';
import DatePickerSelector from './DatePickerSelector';

const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };

const LogSearchForm = (props) => {
  const { search } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    function init() {}
    init();
  }, []);

  function submitSearch() {
    form.validateFields().then((values) => {
      const currentValues = { ...values };
      const { timeRange } = currentValues;
      if (!isNull(timeRange)) {
        currentValues.startTime = timeRange[0].format('YYYY-MM-DD HH:00:00');
        currentValues.endTime = timeRange[1].format('YYYY-MM-DD HH:00:00');
      }
      delete currentValues.timeRange;
      search(currentValues);
    });
  }

  return (
    <Form form={form}>
      <Form.Item hidden name={'startTime'} />
      <Form.Item hidden name={'endTime'} />
      <Form.Item hidden name={'type'} />
      <Row gutter={24}>
        <Col>
          <Form.Item
            label={<FormattedMessage id="app.form.dateRange" />}
            name="timeRange"
            getValueFromEvent={(value) => {
              return value;
            }}
          >
            <DatePickerSelector />
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
        {/* <Col>
          <Form.Item {...NoLabelFormLayout}>
            <Row justify="end">
              <Button>
                <FormattedMessage id="app.button.save" />
              </Button>
            </Row>
          </Form.Item>
        </Col> */}
      </Row>
    </Form>
  );
};
export default memo(LogSearchForm);
