import React from 'react';
import { Form, Select, Button, DatePicker, Input, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { FormattedMessage, formatMessage } from '@/components/Lang';
import dictionary from '@/utils/Dictionary';
import { dateFormat } from '@/utils/Utils';

const { RangePicker } = DatePicker;
const { Option } = Select;

const TaskSearch = (props) => {
  const { search, agvList } = props;

  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      const params = {};
      if (values.createDate) {
        params.createTimeStart = dateFormat(values.createDate[0], 1).format('YYYY-MM-DD HH:mm:ss');
        params.createTimeEnd = dateFormat(values.createDate[1], 1).format('YYYY-MM-DD HH:mm:ss');
        params.createDate = null;
      }
      search({ ...values, ...params });
    });
  }

  function renderAgvTaskTypeOption() {
    const toteAgvTaskType = dictionary('agvTaskType', 'all');
    const options = [];
    for (const key in toteAgvTaskType) {
      if (toteAgvTaskType.hasOwnProperty(key)) {
        const element = toteAgvTaskType[key];
        options.push(<Select.Option value={key}>{formatMessage({ id: element })}</Select.Option>);
      }
    }
    return options;
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
          <Form.Item name={'taskStatus'} label={formatMessage({ id: 'app.task.status' })}>
            <Select mode="multiple" allowClear>
              <Option key="New" value="New">
                <FormattedMessage id="app.activity.TaskNew" />
              </Option>
              <Option key="Executing" value="Executing">
                <FormattedMessage id="app.activity.TaskExecuting" />
              </Option>
              <Option key="Finished" value="Finished">
                <FormattedMessage id="app.activity.TaskFinished" />
              </Option>
              <Option key="Error" value="Error">
                <FormattedMessage id="app.activity.TaskError" />
              </Option>
              <Option key="Cancel" value="Cancel">
                <FormattedMessage id="app.activity.TaskCancel" />
              </Option>
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
