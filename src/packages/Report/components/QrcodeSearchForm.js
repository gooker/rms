import React, { memo } from 'react';
import { Row, Col, Form, Button, Select } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { isNull } from '@/utils/util';
import DatePickerSelector from './DatePickerSelector';

const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };

const QrcodeSearchComponent = (props) => {
  const { search, exportData } = props;

  const [form] = Form.useForm();

  function submitSearch() {
    form
      .validateFields()
      .then((values) => {
        const currentValues = { ...values };
        const { timeRange } = currentValues;
        if (!isNull(timeRange)) {
          currentValues.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss');
          currentValues.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss');
        }
        delete currentValues.timeRange;
        search(currentValues);
      })
      .catch(() => {});
  }

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col flex="auto">
          <Form.Item
            label={<FormattedMessage id="app.form.dateRange" />}
            name="timeRange"
            rules={[
              {
                required: true,
                message: <FormattedMessage id="reportCenter.time.required" />,
              },
            ]}
            getValueFromEvent={(value) => {
              return value;
            }}
          >
            <DatePickerSelector />
          </Form.Item>
        </Col>

        <Col span={6}>
          <Form.Item name={'code'} label={<FormattedMessage id="app.common.code" />}>
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
        <Col>
          <Form.Item {...NoLabelFormLayout}>
            <Row justify="end">
              <Button onClick={exportData}>
                <FormattedMessage id="reportCenter.sourceData.download" />
              </Button>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(QrcodeSearchComponent);
