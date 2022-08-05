import React, { memo } from 'react';
import { Button, Form, Input, Row, DatePicker } from 'antd';
import { Col } from 'antd';
import { convertToUserTimezone, formatMessage, isStrictNull } from '@/utils/util';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';
const FaultSearch = (props) => {
  const { form, gutter, span, onSearch, children } = props;

  function search() {
    form.validateFields().then((values) => {
      const params = { ...values };
      if (!isStrictNull(values?.date?.[0])) {
        params.createTimeStart = convertToUserTimezone(values.createDate[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.createTimeEnd = convertToUserTimezone(values.createDate[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.date = null;
      }
      onSearch(params);
    });
  }

  return (
    <Form form={form}>
      <Row gutter={gutter}>
        <Col span={span}>
          <Form.Item name={'errorCode'} label={formatMessage({ id: 'app.fault.code' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={span}>
          <Form.Item name={'date'} label={<FormattedMessage id="app.common.creationTime" />}>
            <RangePicker format={dateFormat} style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        {/* 额外的字段 */}

        {React.isValidElement(children) && children ? (
          <Col span={span}>{children}</Col>
        ) : (
          children?.map((child, index) => (
            <Col key={index} span={span}>
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
export default memo(FaultSearch);
