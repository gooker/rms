import React from 'react';
import { Form, Button, Input, Row, Col, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatMessage, convertToUserTimezone } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { RangePicker } = DatePicker;

const TargetLockSearch = (props) => {
  const { search, resetValues } = props;
  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      const params = { ...values };
      if (values.createDate && values.createDate[0] && values.createDate[1]) {
        params.createTimeStart = convertToUserTimezone(values.createDate[0], 1).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.createTimeEnd = convertToUserTimezone(values.createDate[1], 1).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.createDate = null;
        delete params.createDate;
      }
      search({ ...params });
    });
  }

  function onClear() {
    form.resetFields();
    resetValues();
  }

  return (
    <Form form={form}>
      <Row style={{ width: '100%' }} gutter={24}>
        <Col span={4}>
          {/* 小车id */}
          <Form.Item name={'agvId'} label={formatMessage({ id: 'app.agv.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        {/* 任务id */}
        <Col span={4}>
          <Form.Item name="taskId" label={formatMessage({ id: 'app.task.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        {/* 查询日期 */}
        <Col span={8}>
          <Form.Item name={'createDate'} label={formatMessage({ id: 'app.taskDetail.firstTime' })}>
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Row gutter={24}>
              <Col>
                <Button type="primary" onClick={onFinish}>
                  <SearchOutlined /> <FormattedMessage id="app.button.search" />
                </Button>
              </Col>
              <Col>
                <Button onClick={onClear}>
                  <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default React.memo(TargetLockSearch);
