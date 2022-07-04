import React, { memo } from 'react';
import { Form, Input, Row, Col, Button } from 'antd';
import { formatMessage } from '@/utils/util';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

const FaultDefinitionSearch = (props) => {
  const { onSearch, data } = props;
  const [form] = Form.useForm();
  function currentSearch() {
    form.validateFields().then((values) => {
      onSearch(data, { ...values });
    });
  }
  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item label={formatMessage({ id: 'app.fault.name' })} name="errorName">
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={formatMessage({ id: 'app.fault.code' })} name="errorCode">
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label={formatMessage({ id: 'app.fault.level' })} name="level">
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button type="primary" onClick={currentSearch}>
              <SearchOutlined /> <FormattedMessage id="app.button.search" />
            </Button>
            <Button
              style={{ marginLeft: 15 }}
              onClick={() => {
                form.resetFields();
                onSearch({});
              }}
            >
              <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(FaultDefinitionSearch);
