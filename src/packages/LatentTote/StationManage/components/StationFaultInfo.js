import React, { memo, useEffect, useState } from 'react';
import { Row, Col } from 'antd';
import { formatMessage, dealResponse, convertToUserTimezone } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import { fetchLatentToteFaultStations } from '@/services/latentToteService';
import TableWithPages from '@/components/TableWithPages';
import StationFaultSearch from './StationFaultSearch';

const StationFaultInfo = (props) => {
  const { record } = props;
  const [formValues, setFormValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState({ currentPage: 1, size: 10, totalElements: 0 });

  useEffect(() => {
    async function init() {
      getData();
    }
    init();
  }, []);

  const columns = [
    {
      title: <FormattedMessage id="latentTote.station.errorCode" />,
      dataIndex: 'errorCode',
      align: 'center',
    },
    {
      title: <FormattedMessage id="latentTote.station.errorLevel" />,
      dataIndex: 'errorLevel',
      align: 'center',
    },
    {
      title: <FormattedMessage id="latentTote.station.errorContent" />,
      dataIndex: 'errorMessage',
      align: 'center',
    },

    {
      title: formatMessage({ id: 'app.common.firstTime' }),
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => {
        if (!text) {
          return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
      },
    },
  ];

  const expandColumns = [
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'taskId',
    },
    {
      title: <FormattedMessage id="app.common.creator" />,
      dataIndex: 'createdByUser',
    },
    {
      title: formatMessage({ id: 'app.common.updater' }),
      dataIndex: 'updatedByUser',
    },
    {
      title: formatMessage({ id: 'app.common.updateTime' }),
      dataIndex: 'updateTime',
      render: (text) => {
        if (!text) {
          return <span>{convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss')}</span>;
        }
      },
    },
  ];

  function expandedRowRender(record) {
    return (
      <Row>
        {Object.keys(record?.errorDetail).length > 0 && (
          <>
            {Object.entries(record?.errorDetail).map(([key, value]) => (
              <Col key={key} flex="auto" style={{ marginRight: 20 }}>
                <span>{key}</span>
                <span>:</span>
                <span style={{ marginLeft: 5 }}>{value}</span>
              </Col>
            ))}
          </>
        )}

        {expandColumns.map(({ title, dataIndex, render }, index) => (
          <Col key={index} flex="auto" style={{ marginRight: 20 }}>
            <span>{title}</span>
            <span>:</span>
            <span style={{ marginLeft: 5 }}>
              {typeof render === 'function' ? render(record[dataIndex], record) : record[dataIndex]}
            </span>
          </Col>
        ))}
      </Row>
    );
  }

  /**
   * 查询方法
   * @param {*} values 查询条件
   * @param {*} firstPage 查询成功后是否跳转到第一页
   */
  async function getData(values, firstPage) {
    const { currentPage, size } = page;
    setLoading(true);
    let requestValues;
    if (values) {
      requestValues = { ...values };
      setFormValues(values);
    } else {
      requestValues = { ...formValues };
    }
    requestValues.hardwareId = record.id;
    const params = { current: !!firstPage ? 1 : currentPage, size, ...requestValues };
    const response = await fetchLatentToteFaultStations(params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      setDataSource(list ?? []);
      setPage(page);
    }
    setLoading(false);
  }

  function handleTableChange(pagination) {
    const page = { ...page, currentPage: pagination.current, size: pagination.pageSize };
    setPage(page);
    getData(null, false);
  }

  return (
    <>
      <StationFaultSearch search={getData} />
      <div>
        <TableWithPages
          loading={loading}
          scroll={{ x: 'max-content' }}
          rowKey={(record) => record.id}
          dataSource={dataSource}
          columns={columns}
          pagination={{
            current: page.currentPage,
            pageSize: page.size,
            total: page.totalElements || 0,
            showTotal: (total) => formatMessage({ id: 'app.common.tableRecord' }, { count: total }),
          }}
          onChange={handleTableChange}
          expandable={{
            expandedRowRender: (record) => expandedRowRender(record),
          }}
        />
      </div>
    </>
  );
};
export default memo(StationFaultInfo);
