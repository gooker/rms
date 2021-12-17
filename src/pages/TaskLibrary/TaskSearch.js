import React, { memo } from 'react';
import { Form, Select, Button, DatePicker, Input, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { GMT2UserTimeZone, formatMessage } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';
import FormattedMessage from '@/components/FormattedMessage';

const { RangePicker } = DatePicker;
const { Option } = Select;
const TaskStatus = Dictionary('taskStatus');

const TaskSearch = (props) => {
  const { search, agvList, allTaskTypes } = props;

  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      const params = {};
      if (values.createDate) {
        params.createTimeStart = GMT2UserTimeZone(values.createDate[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.createTimeEnd = GMT2UserTimeZone(values.createDate[1]).format('YYYY-MM-DD HH:mm:ss');
        params.createDate = null;
      }
      search({ ...values, ...params }, true);
    });
  }

  function renderAgvTaskTypeOption() {
    return Object.keys(allTaskTypes).map((type) => (
      <Option key={type} value={type}>
        {allTaskTypes[type]}
      </Option>
    ));
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <Row style={{ width: '100%' }} gutter={24}>
        <Col span={8}>
          <Form.Item name={'agvId'} label={formatMessage({ id: 'app.agv.id' })}>
            <Select allowClear showSearch>
              {agvList.map((agvId) => (
                <Option key={agvId} value={agvId}>
                  {agvId}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'taskStatus'} label={formatMessage({ id: 'app.task.state' })}>
            <Select mode="multiple" allowClear>
              {Object.keys(TaskStatus).map((item) => (
                <Option key={item} value={item}>
                  <FormattedMessage id={TaskStatus[item]} />
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row style={{ width: '100%' }} gutter={24}>
        <Col span={8}>
          <Form.Item name={'createDate'} label={formatMessage({ id: 'app.taskDetail.queryTime' })}>
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'agvTaskType'} label={formatMessage({ id: 'app.task.type' })}>
            <Select mode="multiple" allowClear>
              {renderAgvTaskTypeOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item>
            <Row gutter={24}>
              <Col>
                <Button type="primary" htmlType="submit">
                  <SearchOutlined /> <FormattedMessage id="app.button.search" />
                </Button>
              </Col>
              <Col>
                <Button
                  htmlType="reset"
                  onClick={() => {
                    search({}, true);
                  }}
                >
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
export default memo(TaskSearch);
