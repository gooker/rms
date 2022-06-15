/* TODO: I18N */
import React, { memo } from 'react';
import { Form, Row, Col, Select, Input, DatePicker, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from '@/components/FormattedMessage';
import commonStyles from '@/common.module.less';
import { convertToUserTimezone } from '@/utils/util';

const { RangePicker } = DatePicker;
const page = {
  currentPage: 1,
  size: 10,
};

const SearchLoadComponent = (props) => {
  const { allLoadSpec, onSearch } = props;
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
        <Row className={commonStyles.tableToolLeft}>
          <Col span={4}>
            <Form.Item label={'ID'} name={'loadId'}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item label={'载具规格'} name="loadSpecificationCode">
              <Select allowClear style={{ width: '100%' }}>
                {allLoadSpec?.map(({ code, name }) => (
                  <Select.Option key={code} value={code}>
                    {name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          {/* 日期 */}
          <Col span={8}>
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
export default memo(SearchLoadComponent);
