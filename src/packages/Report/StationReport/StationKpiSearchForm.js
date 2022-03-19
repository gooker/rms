import React, { memo } from 'react';
import { Button, DatePicker, Row, Col, Select, Form } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { ReloadOutlined, EyeOutlined } from '@ant-design/icons';

const StationKpiSearchForm = (props) => {
  const {
    regionList,
    historyLoading,
    realTimeLoading,
    refreshHistoryCharts,
    refreshRealTimeCharts,
  } = props;

  const [formRef] = Form.useForm();

  async function getRequestBody() {
    const { regionId, targetRegionId, dateTime } = formRef.validateFields();
    return {
      regionId,
      targetRegionId,
      date: dateTime?.format('YYYY-MM-DD 00:00:00'),
    };
  }

  return (
    <Form form={formRef}>
      <Row gutter={10}>
        <Col>
          <Form.Item
            name={'regionId'}
            label={<FormattedMessage id={'app.regionReport.startRegion'} />}
          >
            <Select
              showSearch
              style={{ width: 200 }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {regionList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.siteName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col>
          <Form.Item
            name={'targetRegionId'}
            label={<FormattedMessage id={'app.regionReport.targetRegion'} />}
          >
            <Select
              showSearch
              style={{ width: 200 }}
              filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {regionList.map((item) => (
                <Select.Option key={item.id} value={item.id}>
                  {item.siteName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item name={'dateTime'} label={<FormattedMessage id={'app.regionReport.date'} />}>
            <DatePicker />
          </Form.Item>
        </Col>
        <Col>
          <Button
            type={'primary'}
            onClick={() => {
              refreshHistoryCharts(getRequestBody());
            }}
            loading={historyLoading}
          >
            <EyeOutlined /> <FormattedMessage id={'app.button.check'} />
          </Button>
          <Button
            onClick={() => {
              refreshRealTimeCharts(getRequestBody());
            }}
            loading={realTimeLoading}
            style={{ marginLeft: 20 }}
          >
            <ReloadOutlined /> <FormattedMessage id={'app.regionReport.refreshRealtime'} />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(StationKpiSearchForm);
