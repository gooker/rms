import React, { memo } from 'react';
import { Form, Row, Col, Input, DatePicker, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import { convertToUserTimezone } from '@/utils/util';

const { RangePicker } = DatePicker;
const page = {
  currentPage: 1,
  size: 10,
};

const SearchCirculationComponent = (props) => {
  const { onSearch } = props;
  const [formRef] = Form.useForm();

  function search() {
    formRef.validateFields().then((values) => {
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
    <>
      <Form form={formRef}>
        <Row gutter={24}>
          <Col span={6}>
            <Form.Item label={<FormattedMessage id="resource.load.id" />} name={'loadId'}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={<FormattedMessage id="app.vehicle" />} name={'vehicleId'}>
              <Input allowClear />
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item
              label={<FormattedMessage id="resource.load.source.storage" />}
              name={'sourceCode'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              label={<FormattedMessage id="resource.load.target.storage" />}
              name={'targetCode'}
            >
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label={<FormattedMessage id="app.task.id" />} name={'taskId'}>
              <Input allowClear />
            </Form.Item>
          </Col>

          {/* 日期 */}
          <Col span={7}>
            <Form.Item name={'createDate'} label={<FormattedMessage id="resource.load.changeTime" />}>
              <RangePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name={'createdByUser'}
              label={<FormattedMessage id="resource.load.triggeror" />}
            >
              <Input allowClear />
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
                  formRef.resetFields();
                  onSearch({}, page);
                }}
              >
                <ReloadOutlined /> <FormattedMessage id="app.button.reset" />
              </Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </>
  );
};
export default memo(SearchCirculationComponent);
