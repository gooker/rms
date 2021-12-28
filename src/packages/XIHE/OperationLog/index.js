import React, { memo, useEffect, useState } from 'react';
import TablePageWrapper from '@/components/TablePageWrapper';
import { Table, Tag, Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { fetchUserActionLogs } from '@/services/api';
import { dateFormat, dealResponse, formatMessage, isStrictNull } from '@/utils/utils';
import FormattedMessage from '@/components/FormattedMessage';
import RequestPayloadModal from './components/RequestPayloadModal';
import OperateSearchForm from '@/pages/FaultList/OperateSearchForm';
import commonStyles from '@/common.module.less';

const OperationLogComponent = (props) => {
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1, total: 0 });
  const [sorter, setSorter] = useState({});
  const [operateList, setOperateList] = useState([]);
  const [viewRequestPayload, setViewRequestPayload] = useState(null); // 请求参数

  useEffect(() => {
    async function init() {
      await fetchLogsList();
    }
    init();
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="sso.user.type.user" />,
      dataIndex: 'username',
      align: 'center',
      width: 200,
      fixed: 'left',
    },
    {
      title: <FormattedMessage id="app.activity.modelName" />,
      dataIndex: 'module',
      width: 200,
      align: 'center',
    },
    {
      title: <FormattedMessage id="operation.log.requestURl" />,
      dataIndex: 'url',
      width: 200,
      align: 'center',
    },
    {
      title: <FormattedMessage id="operation.log.requestMethod" />,
      dataIndex: 'type',
      width: 100,
      align: 'center',
      render: (type) => {
        return (
          <Tag color="green" key={type}>
            {type.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: <FormattedMessage id="operation.log.requestTime" />,
      dataIndex: 'time',
      align: 'center',
      width: 100,
      render: (text) => `${text}s`,
    },
    {
      title: <FormattedMessage id="app.common.status" />,
      dataIndex: 'status',
      width: 100,
      align: 'center',
      render: (status) => {
        const color = status === 'success' ? 'green' : 'red';
        return (
          <Tag color={color} key={status}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },

    {
      title: <FormattedMessage id="app.agv.ip" />,
      align: 'center',
      width: 200,
      dataIndex: 'ip',
    },
    {
      title: <FormattedMessage id="operation.log.userAgent" />,
      dataIndex: 'brower',
      align: 'center',
      width: 200,
      ellipsis: true,
    },
    {
      title: <FormattedMessage id="app.taskDetail.createTime" />,
      align: 'center',
      width: 200,
      sorter: true,
      dataIndex: 'createtime', // 时间戳
      render: (text) => dateFormat(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: <FormattedMessage id="operation.log.requestResponse" />,
      dataIndex: 'responseTx',
      align: 'center',
      width: 200,
      ellipsis: true,
      render: (reponseTx, record) => {
        if (record.status === 'error') {
          return reponseTx;
        }
      },
    },
    {
      title: <FormattedMessage id="operation.log.requestParam" />,
      align: 'center',
      width: 200,
      dataIndex: 'requestTx',
      render: (text, record) => (
        <Button type="link">
          <EyeOutlined
            onClick={() => {
              viewRequestBody(record);
            }}
          />
        </Button>
      ),
    },
    {
      title: <FormattedMessage id="operation.log.trackId" />,
      dataIndex: 'trackId',
      align: 'center',
      width: 250,
      fixed: 'right',
    },
  ];

  async function fetchLogsList(formValues) {
    setLoading(true);
    const requestParam = {
      current: pagination.current,
      size: pagination.pageSize,
      order: sorter?.order,
      ...formValues,
    };

    const response = await fetchUserActionLogs(requestParam);
    if (!dealResponse(response)) {
      const { list, page } = response;
      setOperateList(list);
      setPagination({ current: page.currentPage, pageSize: page.size, total: page.totalElements });
    }
    setLoading(false);
  }

  async function handleTableChange(page, _, sorter) {
    let sort = null;
    if (sorter?.order) {
      sort = sorter.order === 'ascend' ? 'ASC' : 'DESC';
      setSorter({ order: sort });
    }
    setPagination({ ...pagination, current: page?.current, pageSize: page?.pageSize });
    fetchLogsList({ current: page?.current, size: page?.pageSize, order: sort });
  }

  function viewRequestBody(record) {
    const _paramsView = JSON.parse(record.requestTx);
    setViewRequestPayload(_paramsView);
  }

  return (
    <TablePageWrapper>
      <OperateSearchForm search={fetchLogsList} data={operateList} />
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={operateList}
        onChange={handleTableChange}
        pagination={{ ...pagination, showSizeChanger: true }}
        rowKey={'id'}
      />

      {/* 请求参数结构预览 */}
      <RequestPayloadModal
        visible={!isStrictNull(viewRequestPayload)}
        data={viewRequestPayload}
        onCancel={() => {
          setViewRequestPayload(null);
        }}
      />
    </TablePageWrapper>
  );
};
export default memo(OperationLogComponent);
