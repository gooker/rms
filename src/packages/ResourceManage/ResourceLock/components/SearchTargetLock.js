import React from 'react';
import { Form, Button, Input, Row, Col, Select } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const SearchTargetLock = (props) => {
  const { search, verhicleHide, allAdapter } = props;
  const [form] = Form.useForm();

  function onFinish() {
    form.validateFields().then((values) => {
      const params = { ...values };
      search({ ...params });
    });
  }

  function onClear() {
    form.resetFields();
    search({});
  }

  return (
    <Form form={form}>
      <Row style={{ width: '100%' }} gutter={24}>
        {!verhicleHide && (
          <Col span={4}>
            {/* 小车id */}
            <Form.Item name={'vehicleId'} label={formatMessage({ id: 'app.agv.id' })}>
              <Input allowClear />
            </Form.Item>
          </Col>
        )}
        <Col span={4}>
          {/* 小车类型 */}
          <Form.Item name={'vehicleType'} label={formatMessage({ id: 'app.common.type' })}>
            <Input allowClear />
            {/* <Select
              allowClear
              showSearch
              size="small"
              maxTagCount={5}
              mode="multiple"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {allAdapter?.map((element) => (
                <Select.Option key={element.agvType} value={element.agvType}>
                  {element.agvType}
                </Select.Option>
              ))}
            </Select> */}
          </Form.Item>
        </Col>
        {/* 任务id */}
        <Col span={4}>
          <Form.Item name="taskId" label={formatMessage({ id: 'app.task.id' })}>
            <Input allowClear />
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
export default React.memo(SearchTargetLock);
