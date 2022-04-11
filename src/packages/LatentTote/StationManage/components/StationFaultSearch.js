import React, { memo } from 'react';
import { Form, Select, Button, DatePicker, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { convertToUserTimezone, formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { RangePicker } = DatePicker;

const StationFaultSearch = (props) => {
  const { search } = props;

  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      const params = {};
      if (values.createDate) {
        params.timeStart = convertToUserTimezone(values.createDate[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.timeEnd = convertToUserTimezone(values.createDate[1]).format('YYYY-MM-DD HH:mm:ss');
        params.createDate = null;
      }
      search({ ...values, ...params }, true);
    });
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <Row style={{ width: '100%' }} gutter={24}>
        <Col span={24}>
          <Form.Item name={'createDate'} label={formatMessage({ id: 'app.taskDetail.queryTime' })}>
            <RangePicker showTime style={{ width: '100%' }} allowClear />
          </Form.Item>
        </Col>

        <Col span={16}>
          <Form.Item
            name={'errorLevelList'}
            label={formatMessage({ id: 'latentTote.station.errorLevel' })}
          >
            <Select mode="tags" allowClear />
          </Form.Item>
        </Col>

        <Col span={4}>
          <Form.Item>
            <Row gutter={24}>
              <Col>
                <Button type="primary" htmlType="submit">
                  <SearchOutlined /> <FormattedMessage id="app.button.search" />
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(StationFaultSearch);
