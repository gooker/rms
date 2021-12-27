import React, { memo, useEffect, useState } from 'react';
import { Row, Col, Progress, Form, Button, Select, Divider, Table, message } from 'antd';
import TablePageWrapper from '@/components/TablePageWrapper';
import { dateFormat, dealResponse, formatMessage } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import RmsConfirm from '@/components/RmsConfirm';
import { AGVState, Colors, LogFileTypes } from '@/config/consts';
import {
  fetchAgvLog,
  fetchAgvList,
  startCreatingLog,
  forceResetLogGeneration,
  downloadLogFromSFTP,
} from '@/services/api';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import commonStyles from '@/common.module.less';

const StatusLabelStyle = { marginLeft: 15, fontSize: 15, fontWeight: 600 };

const LogDownLoadComponent = (props) => {
  const { agvType } = props;

  const [formRef] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1, total: 0 });

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const [agvList, setAgvList] = useState([]);
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    getAgvList();
    fetchFileList();
  }, []);

  const columns = [
    {
      title: formatMessage({ id: 'app.logDownload.fileName' }),
      dataIndex: 'downLoadLogName',
      align: 'center',
      width: 150,
    },
    {
      title: formatMessage({ id: 'app.form.agvId' }),
      dataIndex: 'robotId',
      align: 'center',
      width: 150,
    },
    {
      title: formatMessage({ id: 'app.common.status' }),
      dataIndex: 'fileStatus',
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (text === '0') {
          return (
            <span style={{ color: Colors.green, ...StatusLabelStyle }}>
              <FormattedMessage id={'app.logDownload.generated'} />
            </span>
          );
        } else if (text === '1') {
          return (
            <span>
              <Progress type="circle" percent={parseInt(record.fileProgress, 10)} width={50} />
              <span style={{ color: Colors.yellow, ...StatusLabelStyle }}>
                <FormattedMessage id={'app.logDownload.inGenerating'} />
              </span>
            </span>
          );
        } else if (text === '2') {
          return (
            <span style={{ color: Colors.red, ...StatusLabelStyle }}>
              <FormattedMessage id={'app.common.failed'} />
            </span>
          );
        }
      },
    },
    {
      title: formatMessage({ id: 'app.common.createTime' }),
      align: 'center',
      dataIndex: 'createTime',
      width: 150,
      render: (text) => {
        if (text) {
          return dateFormat(text).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
    {
      title: formatMessage({ id: 'app.common.operation' }),
      align: 'center',
      width: 150,
      render: (text, record) => {
        if (record.fileStatus === '0') {
          return (
            <Button
              type={'link'}
              onClick={() => {
                downloadLog(record);
              }}
            >
              <FormattedMessage id="app.log.download" />
            </Button>
          );
        } else if (record.fileStatus === '1') {
          return (
            <Button
              type={'link'}
              onClick={() => {
                forceReset(record);
              }}
            >
              <FormattedMessage id="app.button.forceReset" />
            </Button>
          );
        }
      },
    },
  ];

  function handleTableChange({ current, pageSize }) {
    setPagination({ ...pagination, current, pageSize });
    fetchFileList({ current, size: pageSize });
  }

  async function getAgvList() {
    const response = await fetchAgvList(agvType);
    if (!dealResponse(response)) {
      setAgvList(response);
    }
  }

  async function fetchFileList(inputParam) {
    setLoading(true);
    setSelectedRowKeys([]);
    setSelectedRow([]);

    // 如果没有外来参数就使用默认参数
    const requestParam = inputParam
      ? inputParam
      : { current: pagination.current, size: pagination.pageSize };

    const fileListRes = await fetchAgvLog(agvType, { ...requestParam, fileTaskTypes: 'DOWNLOAD' });
    if (!dealResponse(fileListRes)) {
      const { list, page } = fileListRes;
      setFileList(list);
      setPagination({ current: page.currentPage, pageSize: page.size, total: page.totalElements });
    }
    setLoading(false);
  }

  async function startGeneratingLog() {
    setCreateLoading(true);
    try {
      const values = await formRef.validateFields();
      const response = await startCreatingLog(agvType, values);
      if (
        !dealResponse(
          response,
          true,
          formatMessage({ id: 'app.message.operateFailed' }),
          formatMessage({ id: 'app.message.operateFailed' }),
        )
      ) {
        fetchFileList();
      }
    } catch (e) {
      console.log(e);
    }
    setCreateLoading(false);
  }

  function forceReset(record) {
    RmsConfirm({
      content: formatMessage({ id: 'app.logDownload.forceResetConfirm' }),
      onOk: async () => {
        const response = await forceResetLogGeneration(agvType, {
          ...record,
          fileStatus: 2,
        });
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          fetchFileList();
        } else {
          message.error(formatMessage({ id: 'app.message.operateFailed' }));
        }
      },
    });
  }

  async function downloadLog(record) {
    const response = await downloadLogFromSFTP(agvType, record);
    dealResponse(
      response,
      true,
      formatMessage({ id: 'app.message.operateSuccess' }),
      formatMessage({ id: 'app.message.operateFailed' }),
    );
  }

  function onRowSelectionChange(selectedRowKeys, selectRow) {
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRow(selectRow);
  }

  function renderAgvOptions() {
    return agvList.map((agv) => (
      <Select.Option
        key={agv.robotId}
        value={agv.robotId}
        disabled={agv.agvStatus === AGVState.offline}
      >
        {agv.robotId}
      </Select.Option>
    ));
  }

  function renderFileOptions() {
    return LogFileTypes.map((type) => (
      <Select.Option key={type} value={type}>
        {type}
      </Select.Option>
    ));
  }

  function renderTotalTip(total) {
    return formatMessage({ id: 'app.common.tableRecord' }, { count: total });
  }

  return (
    <TablePageWrapper>
      <div>
        <Form form={formRef}>
          <Row gutter={15}>
            <Col style={{ width: '200px' }}>
              <Form.Item
                name={'robotId'}
                label={formatMessage({ id: 'app.agv.id' })}
                rules={[{ required: true }]}
              >
                <Select allowClear style={{ width: '100%' }}>
                  {renderAgvOptions()}
                </Select>
              </Form.Item>
            </Col>
            <Col style={{ width: '230px' }}>
              <Form.Item
                name={'fileName'}
                label={formatMessage({ id: 'app.logDownload.fileName' })}
                rules={[{ required: true }]}
              >
                <Select allowClear style={{ width: '100%' }}>
                  {renderFileOptions()}
                </Select>
              </Form.Item>
            </Col>
            <Col>
              <Button
                type="primary"
                onClick={startGeneratingLog}
                loading={createLoading}
                disabled={createLoading}
              >
                <FormattedMessage id="app.logDownload.generateLog" />
              </Button>
            </Col>
          </Row>
        </Form>
        <Divider style={{ margin: '0 0 15px 0' }} />
        <Row gutter={15}>
          <Col>
            <Button danger onClick={startGeneratingLog} disabled={selectedRow.length === 0}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
          </Col>
          <Col>
            <Button onClick={() => fetchFileList()} disabled={loading}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>
      <div className={commonStyles.divContent}>
        <Table
          loading={loading}
          columns={columns}
          dataSource={fileList}
          onChange={handleTableChange}
          pagination={{ pagination, showSizeChanger: true, showTotal: renderTotalTip }}
          rowKey={({ fileTaskId }) => fileTaskId}
          rowSelection={{
            selectedRowKeys,
            onChange: onRowSelectionChange,
          }}
        />
      </div>
    </TablePageWrapper>
  );
};
export default memo(LogDownLoadComponent);
