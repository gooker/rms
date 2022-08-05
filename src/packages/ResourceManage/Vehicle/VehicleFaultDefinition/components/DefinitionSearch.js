import React, { memo } from 'react';
import { Form, Input, Row, Col, Button, Select } from 'antd';
import { connect } from '@/utils/RmsDva';
import { formatMessage } from '@/utils/util';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

const FaultDefinitionSearch = (props) => {
  const { onSearch, allAdaptors } = props;
  const [form] = Form.useForm();
  function currentSearch() {
    form.validateFields().then((values) => {
      onSearch({ ...values });
    });
  }
  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={8}>
          <Form.Item label={formatMessage({ id: 'app.fault.name' })} name="errorName">
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={formatMessage({ id: 'app.fault.code' })} name="errorCode">
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={formatMessage({ id: 'app.fault.level' })} name="level">
            <Select allowClear>
              <Select.Option key="INFO" value="INFO">
                INFO
              </Select.Option>
              <Select.Option key="WARN" value="WARN">
                WARN
              </Select.Option>
              <Select.Option key="ERROR" value="ERROR">
                ERROR
              </Select.Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label={<FormattedMessage id={'app.vehicleType'} />} name="vehicleType">
            <Select allowClear>
              {Object.values(allAdaptors).map(({ adapterType }) => {
                const { code, name, vehicleTypes } = adapterType;
                return (
                  <Select.OptGroup key={code} label={name}>
                    {vehicleTypes.map((item, index) => (
                      <Select.Option key={index} value={`${item.code}`}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                );
              })}
            </Select>
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
export default connect(({ global }) => ({
  allAdaptors: global.allAdaptors,
}))(memo(FaultDefinitionSearch));
