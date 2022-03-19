import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Button, Select } from 'antd';
import { ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { convertToUserTimezone, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';
const FormItemLayout = { labelCol: { span: 6 }, wrapperCol: { span: 18 } };
const errrorCode=['-1','0','1','2','5','6','7','20'];

const FaulSearchForm = (props) => {
  const { search } = props;

  const [formRef] = Form.useForm();

  function searchSubmit() {
    formRef.validateFields().then((values) => {
      const formValues = {};
      Object.keys(values).forEach((formKey) => {
        if (formKey === 'date') {
          if (!isNull(values?.date?.[0])) {
            formValues.createTimeStart = convertToUserTimezone(values.date[0]).format('YYYY-MM-DD HH:mm:ss');
          }
          if (!isNull(values?.date?.[1])) {
            formValues.createTimeEnd = convertToUserTimezone(values.date[1]).format('YYYY-MM-DD HH:mm:ss');
          }
        } else {
          if (!isNull(values[formKey])) {
            formValues[formKey] = values[formKey];
          }
        }
      });
      search(formValues);
    });
  }


  return (
    <Form form={formRef} {...FormItemLayout}>
      <Row gutter={15}>
        <Col span={8}>
          <Form.Item name={'errorIndex'} label={<FormattedMessage id="chargeManager.fault.code" />}>
            <Select allowClear showSearch>
              {errrorCode.map((v) => (
                <Select.Option key={v} value={v}>
                  {v}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'hardwareId'} label={<FormattedMessage id="chargeManager.fault.hardwareId" />}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'date'} label={<FormattedMessage id="app.common.creationTime" />}>
            <RangePicker format={dateFormat} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col>
          <Button type={'primary'} onClick={searchSubmit}>
            <SearchOutlined /> <FormattedMessage id={'app.button.search'} />
          </Button>
          <Button
            style={{ marginLeft: 15 }}
            onClick={() => {
              formRef.resetFields();
            }}
          >
            <ReloadOutlined /> <FormattedMessage id={'app.button.reset'} />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(FaulSearchForm);
