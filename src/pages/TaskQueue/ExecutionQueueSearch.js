import React from 'react';
import { Form, Select, Button, Input, Row, Col } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { formatMessage } from '@/utils/utils';
import Dictionary from '@/utils/Dictionary';

const { Option } = Select;

const TaskSearch = (props) => {
  const { search } = props;

  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      const params = {};
      search({ ...values, ...params });
    });
  }

  function renderAgvTaskTypeOption() {
    const toteAgvTaskType = Dictionary('agvTaskType');
    const options = [];
    for (const key in toteAgvTaskType) {
      if (toteAgvTaskType.hasOwnProperty(key)) {
        const element = toteAgvTaskType[key];
        options.push(
          <Option key={key} value={key}>
            {formatMessage({ id: element })}
          </Option>,
        );
      }
    }
    return options;
  }

  return (
    <Form form={form} onFinish={onFinish}>
      <Row style={{ width: '100%' }} gutter={24}>
        <Col span={5}>
          <Form.Item name={'agvId'} label={formatMessage({ id: 'app.agv.id' })}>
            {/* <Select allowClear showSearch></Select> */}
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={5}>
          <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={7}>
          <Form.Item name={'agvTaskType'} label={formatMessage({ id: 'app.task.type' })}>
            <Select mode="multiple" allowClear>
              {renderAgvTaskTypeOption()}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
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
