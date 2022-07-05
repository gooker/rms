import React, { memo, useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, message, Row, Select } from 'antd';
import {
  convertToUserTimezone,
  dealResponse,
  formatMessage,
  isNull,
  isStrictNull,
} from '@/utils/util';
import { fetchAllVehicleList } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import { ExportOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';

const FaultListSearchForm = (props) => {
  const { search } = props;

  const [formRef] = Form.useForm();
  const [vehicleList, setVehicleList] = useState([]);

  useEffect(() => {
    async function getVehicleList() {
      const response = await fetchAllVehicleList();
      if (!dealResponse(response)) {
        setVehicleList(response);
      }
    }
    getVehicleList();
  }, []);

  function searchFaultList() {
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

  function exportFault() {
    const formValue = formRef.getFieldsValue();
    if (isStrictNull(formValue.taskId) && isStrictNull(formValue.step)) {
      message.warn(formatMessage({ id: 'app.faultInfo.require.taskId' }));
      return;
    }
    searchFaultList();
  }

  return (
    <Form form={formRef}>
      <Row gutter={15}>
        <Col span={8}>
          <Form.Item name={'vehicleId'} label={formatMessage({ id: 'vehicle.id' })}>
            <Select allowClear showSearch>
              {vehicleList.map(({ vehicleId }) => (
                <Select.Option key={vehicleId} value={vehicleId}>
                  {vehicleId}
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
          <Button type={'primary'} onClick={searchFaultList}>
            <SearchOutlined /> <FormattedMessage id={'app.button.search'} />
          </Button>
          <Button
            style={{ marginLeft: 15 }}
            onClick={() => {
              formRef.resetFields();
              search({});
            }}
          >
            <ReloadOutlined /> <FormattedMessage id={'app.button.reset'} />
          </Button>
          <Button style={{ marginLeft: 15 }} onClick={exportFault}>
            <ExportOutlined /> <FormattedMessage id={'app.button.download'} />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(FaultListSearchForm);
