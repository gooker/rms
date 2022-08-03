import React, { memo, useEffect, useState } from 'react';
import { Button, Col, DatePicker, Form, Input, Row, Table } from 'antd';
import { convertToUserTimezone, dealResponse, formatMessage, getFormLayout, isStrictNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchEStopLogs } from '@/services/XIHEService';
import { SearchOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const { formItemLayout } = getFormLayout(6, 18);

const EStopLog = () => {
  const [formRef] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [estopLogs, setEStopLogs] = useState([]);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1, total: 0 });

  useEffect(() => {
    getEStopLogs();
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="app.common.code" />,
      dataIndex: 'id',
      align: 'center',
      render: (_, record) => record?.code,
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'logType',
      align: 'center',
      render: (type) => formatMessage({ id: `monitor.estop.logType.${type}` }),
    },
    {
      title: <FormattedMessage id="app.common.operator" />,
      align: 'center',
      dataIndex: 'operator',
    },
    {
      title: <FormattedMessage id="app.common.operationTime" />,
      align: 'center',
      dataIndex: 'logTime',
      render: (text, record) => convertToUserTimezone(record.logTime).format('YYYY-MM-DD HH:mm:ss'),
    },
  ];

  function getEStopLogs() {
    formRef.validateFields().then(async (value) => {
      const { code, operator, timeRange } = value;
      setLoading(true);
      const param = {
        size: pagination.pageSize,
        current: pagination.current || 1,
        code: !isStrictNull(code) ? code : null,
        operator: !isStrictNull(operator) ? operator : null,
      };
      if (Array.isArray(timeRange)) {
        param.startTime = timeRange[0].format('YYYY-MM-DD HH:mm:ss');
        param.endTime = timeRange[1].format('YYYY-MM-DD HH:mm:ss');
      }
      const response = await fetchEStopLogs(param);
      if (!dealResponse(response)) {
        const { list, page } = response;
        const newPagination = { ...pagination };
        newPagination.pageSize = page.size;
        newPagination.current = page.currentPage;
        newPagination.total = page.totalElements;
        setEStopLogs(list);
        setPagination(newPagination);
      }
      setLoading(false);
    });
  }

  function handleTableChange(pagination) {
    setPagination(pagination);
  }

  return (
    <div style={{ height: '100%' }}>
      <Form size={'small'} form={formRef} {...formItemLayout}>
        <Row gutter={10}>
          <Col span={12}>
            <Form.Item name={'timeRange'} label={formatMessage({ id: 'app.form.dateRange' })}>
              <RangePicker
                allowClear
                showTime={{ format: 'HH:mm:ss' }}
                format='YYYY-MM-DD HH:mm:ss'
                placeholder={[
                  formatMessage({ id: 'app.common.startTime' }),
                  formatMessage({ id: 'app.common.endTime' }),
                ]}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={'operator'} label={formatMessage({ id: 'app.common.operator' })}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={'code'} label={formatMessage({ id: 'app.common.code' })}>
              <Input allowClear />
            </Form.Item>
          </Col>
          <Col span={12} style={{ paddingLeft: 18 }}>
            <Button type="primary" onClick={getEStopLogs}>
              <SearchOutlined /> <FormattedMessage id="app.button.search" />
            </Button>
          </Col>
        </Row>
      </Form>
      <Table
        bordered
        size={'small'}
        dataSource={estopLogs}
        columns={columns}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ ...pagination }}
        onChange={handleTableChange}
      />
    </div>
  );
};
export default memo(EStopLog);
