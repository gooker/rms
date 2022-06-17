import React, { memo, useState, useEffect } from 'react';
import { Tooltip } from 'antd';
import FormattedMessage from '@/components/FormattedMessage';
import { convertToUserTimezone, dealResponse, isNull } from '@/utils/util';
import { fetchLoadCirculationRecord } from '@/services/resourceService';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import SearchCirculationComponent from './component/SearchCirculationComponent';
import commonStyles from '@/common.module.less';

const LoadCirculation = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

  const [visible, setVisible] = useState(false);
  const [detailInfo, setDetailInfo] = useState(null);

  const [formValues, setFormValues] = useState({});
  const [page, setPage] = useState({ currentPage: 1, size: 10, totalElements: 0 });

  useEffect(() => {
    getData();
  }, []);

  /**
   * 查询方法
   * @param {*} values 查询条件
   * @param {*} firstPage 是否用传进来的page
   */
  async function getData(values, firstPage) {
    setLoading(true);

    let requestValues;
    if (values) {
      requestValues = { ...values };
      setFormValues(values);
    } else {
      requestValues = { ...formValues };
    }
    const currentPages = firstPage ? firstPage : page;
    const params = { current: currentPages.currentPage, size: currentPages.size, ...requestValues };
    const response = await fetchLoadCirculationRecord(params);
    if (!dealResponse(response)) {
      const { list, page } = response;
      setDataSource(list ?? []);
      setPage(page);
    }
    setLoading(false);
  }

  const columns = [
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'taskId',
      align: 'center',
      render: (text) => {
        if (!isNull(text)) {
          return (
            <Tooltip title={text}>
              <span className={commonStyles.textLinks}>
                {text ? '*' + text.substr(text.length - 6, 6) : null}
              </span>
            </Tooltip>
          );
        }
      },
    },
    {
      title: '小车ID',
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: '来源货位',
      dataIndex: 'fromCargoStorage',
      align: 'center',
    },
    {
      title: '目标货位',
      dataIndex: 'toCargoStorage',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.creationTime" />,
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => {
        return convertToUserTimezone(text)?.format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: <FormattedMessage id="app.common.creator" />,
      dataIndex: 'createdByUser',
      align: 'center',
    },
    {
      title: '修改时间',
      dataIndex: 'updateTime',
      align: 'center',
      render: (text) => {
        return convertToUserTimezone(text)?.format('YYYY-MM-DD HH:mm:ss');
      },
    },
  ];

  function handleTableChange(pagination) {
    const page = { ...page, currentPage: pagination.current, size: pagination.pageSize };
    setPage(page);
    getData(null, page);
  }

  return (
    <TablePageWrapper>
      <SearchCirculationComponent onSearch={getData} />

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
        }}
        onChange={handleTableChange}
      />
    </TablePageWrapper>
  );
};
export default memo(LoadCirculation);
