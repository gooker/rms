import React, { memo, useState } from 'react';
import { Row, Col, Button, Form, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import DatePickerSelector from '../../components/DatePickerSelector';

const formLayout = { labelCol: { span: 9 }, wrapperCol: { span: 14 } };
const NoLabelFormLayout = { wrapperCol: { offset: 10, span: 12 } };

const FilterTaskLoadSearch = (props) => {
  const { search, allTaskTypes } = props;

  const [togglesCode, setTogglesCode] = useState(0);
  const [form] = Form.useForm();

  function submitSearch() {
    form.validateFields().then((values) => {
      const currentValues = { ...values };
      const { timeRange } = currentValues;
      if (!isNull(timeRange)) {
        currentValues.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:00');
        currentValues.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:00');
      }
      delete currentValues.timeRange;
      search && search(currentValues);
    });
  }

  return (
    <div key="a" style={{ margin: '0 10px' }}>
      {togglesCode === 1 ? (
        <>
          <Form form={form}>
            <Row gutter={24}>
              <Form.Item hidden name={'startTime'} />
              <Form.Item hidden name={'endTime'} />
              {/* 日期 */}
              <Col flex="auto">
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
                <Form.Item name={'agvId'} label={<FormattedMessage id="app.agv" />}>
                  <Select
                    mode="tags"
                    style={{ width: '100%' }}
                    maxTagTextLength={5}
                    maxTagCount={4}
                    allowClear
                  />
                </Form.Item>
              </Col>
              <Col>
                <Form.Item
                  name={'taskType'}
                  label={<FormattedMessage id="app.task.type" />}
                  {...formLayout}
                >
                  {/* mode="multiple" */}
                  <Select allowClear style={{ width: 200 }}>
                    {Object.keys(allTaskTypes).map((type) => (
                      <Select.Option key={type} value={type}>
                        {allTaskTypes[type]}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col offset={1}>
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

          <Row>
            <Col span={24} style={{ padding: '10px 0', borderTop: '1px solid #e8e8e8' }}>
              <Button
                type="text"
                onClick={() => {
                  setTogglesCode(0);
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
                setTogglesCode(1);
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

export default connect(({ global }) => ({
  allTaskTypes: global?.allTaskTypes?.LatentLifting || {},
}))(memo(FilterTaskLoadSearch));
