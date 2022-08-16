import React, { memo } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const TaskSearch = (props) => {
  const { allTaskTypes, form, span = 8, onSearch, children } = props;

  function search() {
    form.validateFields().then((values) => {
      onSearch(values);
    });
  }

  function renderVehicleTaskTypeOption() {
    return Object.keys(allTaskTypes).map((type) => (
      <Select.Option key={type} value={type}>
        {allTaskTypes[type]}
      </Select.Option>
    ));
  }

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={span}>
          <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item name={'taskStatus'} label={formatMessage({ id: 'app.task.state' })}>
            <Select allowClear>
              <Select.Option value={'New'}>
                <FormattedMessage id={'app.task.state.New'} />
              </Select.Option>
              <Select.Option value={'Executing'}>
                <FormattedMessage id={'app.task.state.Executing'} />
              </Select.Option>
              <Select.Option value={'Wait'}>
                <FormattedMessage id={'app.task.state.Wait'} />
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>

        <Col span={span}>
          <Form.Item name={'taskName'} label={formatMessage({ id: 'app.task.name' })}>
            <Select
              allowClear
              showSearch
              optionFilterProp='children'
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
            >
              {renderVehicleTaskTypeOption()}
            </Select>
          </Form.Item>
        </Col>

        {/* 额外的字段 */}
        {React.isValidElement(children) ? (
          <Col span={span}>{children}</Col>
        ) : (
          children.map((child, index) => (
            <Col key={index} span={child.props?.span ?? span}>
              {child}
            </Col>
          ))
        )}

        <Form.Item>
          <Button type="primary" onClick={search}>
            <SearchOutlined /> <FormattedMessage id="app.button.search" />
          </Button>
          <Button
            style={{ marginLeft: 24 }}
            onClick={() => {
              form.resetFields();
              onSearch({}, true);
            }}
          >
            <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
          </Button>
        </Form.Item>
      </Row>
    </Form>
  );
};
export default connect(({ global }) => ({
  allTaskTypes: global.allTaskTypes,
}))(memo(TaskSearch));
