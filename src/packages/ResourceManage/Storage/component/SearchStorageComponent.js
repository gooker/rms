/* TODO: I18N */
import React, { memo } from 'react';
import { Form, Row, Col, Select, Button, Input, DatePicker } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { getFormLayout, convertToUserTimezone } from '@/utils/util';
import { allStorageType } from './storage';
const { formItemLayout } = getFormLayout(5, 18);

const { RangePicker } = DatePicker;
const page = {
  currentPage: 1,
  size: 10,
};
const SearchStorageComponent = (props) => {
  const { onSearch } = props;

  const [form] = Form.useForm();

  function search() {
    form.validateFields().then((values) => {
      const params = {};
      if (values.createDate) {
        params.createTimeStart = convertToUserTimezone(values.createDate[0]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.createTimeEnd = convertToUserTimezone(values.createDate[1]).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        params.createDate = null;
      }
      onSearch({ ...values, ...params }, page);
    });
  }

  return (
    <Form form={form}>
      <Row gutter={24}>
        <Col span={10}>
          <Form.Item label={<FormattedMessage id="app.common.type" />} name="storageType">
            <Select allowClear style={{ width: '100%' }}>
              {allStorageType?.map(({ label, code }) => (
                <Select.Option key={code} value={code}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col span={10}>
          <Form.Item name={'storageTempCode'} label={'储位模版编码'}>
            <Input />
          </Form.Item>
        </Col>

        {/* 日期 */}
        <Col span={10}>
          <Form.Item name={'createDate'} label={<FormattedMessage id="app.form.dateRange" />}>
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
        </Col>

        <Col>
          <Form.Item>
            <Button type="primary" onClick={search}>
              <SearchOutlined /> <FormattedMessage id="app.button.search" />
            </Button>
            <Button
              style={{ marginLeft: 24 }}
              onClick={() => {
                form.resetFields();
                onSearch({}, page);
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
export default memo(SearchStorageComponent);
