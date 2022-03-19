import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Button, Select } from 'antd';
import { dealResponse, formatMessage, convertToUserTimezone, isNull } from '@/utils/util';
import { fetchAgvList } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import { ExportOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';

const FaultListSearchForm = (props) => {
  const { agvType, search, faults } = props;

  const [formRef] = Form.useForm();
  const [agvList, setAgvList] = useState([]);

  useEffect(() => {
    async function getAgvList() {
      const response = await fetchAgvList(
        agvType,
        false,
        null,
        formatMessage({ id: 'app.message.fetchAgvListFail' }),
      );
      if (!dealResponse(response)) {
        setAgvList(response);
      }
    }
    getAgvList();
  }, []);

  function fetchFaultList() {
    formRef.validateFields().then((values) => {
      const formValues = {};
      Object.keys(values).forEach((formKey) => {
        if (formKey === 'date') {
          if (!isNull(values?.date?.[0])) {
            formValues.createTimeStart = convertToUserTimezone(values.date[0]).format(
              'YYYY-MM-DD HH:mm:ss',
            );
          }
          if (!isNull(values?.date?.[1])) {
            formValues.createTimeEnd = convertToUserTimezone(values.date[1]).format(
              'YYYY-MM-DD HH:mm:ss',
            );
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
    <Form form={formRef}>
      <Row gutter={15}>
        <Col span={8}>
          <Form.Item name={'agvId'} label={formatMessage({ id: 'app.form.agvId' })}>
            <Select allowClear showSearch>
              {agvList.map(({ robotId }) => (
                <Select.Option key={robotId} value={robotId}>
                  {robotId}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'errorCode'} label={formatMessage({ id: 'app.fault.code' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'step'} label={formatMessage({ id: 'app.fault.step' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'taskId'} label={formatMessage({ id: 'app.task.id' })}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name={'date'} label={formatMessage({ id: 'app.fault.firstReport' })}>
            <RangePicker format={dateFormat} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Button type={'primary'} onClick={fetchFaultList}>
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
          <Button style={{ marginLeft: 15 }}>
            <ExportOutlined /> <FormattedMessage id={'app.button.export'} />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(FaultListSearchForm);
