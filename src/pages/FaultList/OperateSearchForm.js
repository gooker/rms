import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Form, Input, DatePicker, Button, Select } from 'antd';
import { ExportOutlined, ReloadOutlined, SearchOutlined } from '@ant-design/icons';
import { dealResponse, convertToUserTimezone, isNull, formatMessage } from '@/utils/util';
import { fetchAppModules } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import { saveAs } from 'file-saver';
import { Parser } from 'json2csv';

const { RangePicker } = DatePicker;
const dateFormat = 'YYYY-MM-DD HH:mm';

const LogSearchForm = (props) => {
  const { search, data } = props;

  const [formRef] = Form.useForm();
  const [allModules, setAllModules] = useState([]);

  useEffect(() => {
    async function getAppModules() {
      const response = await fetchAppModules();
      if (!dealResponse(response)) {
        setAllModules(response);
      }
    }
    getAppModules();
  }, []);

  function searchSubmit() {
    formRef.validateFields().then((values) => {
      const formValues = {};
      Object.keys(values).forEach((formKey) => {
        if (formKey === 'date') {
          if (!isNull(values?.date?.[0])) {
            formValues.startTime = convertToUserTimezone(values.date[0]).format(
              'YYYY-MM-DD HH:mm:ss',
            );
          }
          if (!isNull(values?.date?.[1])) {
            formValues.endTime = convertToUserTimezone(values.date[1]).format(
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

  function exportLogs() {
    const fields = [
      {
        label: formatMessage({ id: 'operation.log.trackId' }),
        value: 'trackId',
      },
      {
        label: formatMessage({ id: 'sso.user' }),
        value: 'username',
      },
      {
        label: formatMessage({ id: 'app.activity.modelName' }),
        value: 'module',
      },
      {
        label: formatMessage({ id: 'operation.log.requestURl' }),
        value: 'url',
      },
      {
        label: formatMessage({ id: 'operation.log.requestMethod' }),
        value: 'type',
      },
      {
        label: formatMessage({ id: 'operation.log.requestParam' }),
        value: 'requestTx',
      },
      {
        label: formatMessage({ id: 'operation.log.requestTime' }),
        value: 'time',
      },
      {
        label: formatMessage({ id: 'app.common.status' }),
        value: 'status',
      },
      {
        label: formatMessage({ id: 'operation.log.requestResponse' }),
        value: 'responseTx',
      },
      {
        label: formatMessage({ id: 'app.vehicle.ip' }),
        value: 'ip',
      },
      {
        label: formatMessage({ id: 'operation.log.userAgent' }),
        value: 'brower',
      },
      {
        label: formatMessage({ id: 'app.common.creationTime' }),
        value: 'createtime',
        render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
      },
    ];

    const parser = new Parser({ fields });
    const currentData = parser.parse(data);
    const blob = new Blob([`\uFEFF${currentData}`], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, `${formatMessage({ id: 'app.optLog.exportFileName' })}.csv`);
  }

  return (
    <Form form={formRef}>
      <Row gutter={24}>
        <Col span={6}>
          <Form.Item name={'module'} label={<FormattedMessage id="app.activity.modelName" />}>
            <Select allowClear showSearch>
              {allModules.map((v) => (
                <Select.Option key={v} value={v}>
                  {v}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'username'} label={<FormattedMessage id="sso.user" />}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'status'} label={<FormattedMessage id="app.common.status" />}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'url'} label={<FormattedMessage id="operation.log.requestURl" />}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'date'} label={<FormattedMessage id="app.common.creationTime" />}>
            <RangePicker format={dateFormat} style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item name={'trackId'} label={<FormattedMessage id="operation.log.trackId" />}>
            <Input allowClear />
          </Form.Item>
        </Col>
        <Col span={12}>
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
          <Button style={{ marginLeft: 15 }} onClick={exportLogs} disabled={data.length === 0}>
            <ExportOutlined /> <FormattedMessage id={'app.button.export'} />
          </Button>
        </Col>
      </Row>
    </Form>
  );
};
export default memo(LogSearchForm);
