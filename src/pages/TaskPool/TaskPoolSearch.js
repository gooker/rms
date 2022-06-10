import React from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Select } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { convertToUserTimezone, formatMessage } from '@/utils/util';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TaskSearch = (props) => {
  const { search, vehicleList } = props;

  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      const params = {};
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
      search({ ...values, ...params });
    });
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <Row style={{ width: '100%' }} gutter={24}>
        <Col span={6}>
          {/* 小车id */}
          <Form.Item name={'vehicleId'} label={formatMessage({ id: 'vehicle.id' })}>
            <Select allowClear showSearch>
              {vehicleList.map((vehicleId) => (
                <Option key={vehicleId} value={vehicleId}>
                  {vehicleId}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        {/* 料箱码 */}
        <Col md={6} sm={24}>
          <Form.Item name="toteCode" label={formatMessage({ id: 'app.taskPool.code' })}>
            <Input allowClear />
          </Form.Item>
        </Col>

        {/* 料箱池任务id */}
        <Col span={6}>
          <Form.Item name={'totePoolTaskId'} label={formatMessage({ id: 'app.task.poolId' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        {/* 任务状态 */}
        <Col span={6}>
          <Form.Item name={'taskActionStatus'} label={formatMessage({ id: 'app.task.state' })}>
            <Select mode="multiple" maxTagCount={2} allowClear>
              <Select.Option key="New" value="NEW">
                <FormattedMessage id="app.activity.TaskNew" />
              </Select.Option>
              <Select.Option key="Executing" value="EXECUTING">
                <FormattedMessage id="app.activity.TaskExecuting" />
              </Select.Option>
              <Select.Option key="Finished" value="FINISHED">
                <FormattedMessage id="app.activity.TaskFinished" />
              </Select.Option>

              <Select.Option key="Cancel" value="CANCELLED">
                <FormattedMessage id="app.activity.TaskCancel" />
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ width: '100%' }} gutter={24}>
        {/* 查询日期 */}
        <Col span={6}>
          <Form.Item name={'createDate'} label={formatMessage({ id: 'app.taskDetail.queryTime' })}>
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        {/* 客户任务id */}
        <Col span={6}>
          <Form.Item name={'customId'} label={formatMessage({ id: 'app.task.customId' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Row gutter={24}>
              <Col>
                <Button type="primary" htmlType="submit">
                  <SearchOutlined /> <FormattedMessage id="app.button.search" />
                </Button>
              </Col>
              <Col>
                <Button htmlType="reset">
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
export default React.memo(TaskSearch);
