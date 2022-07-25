import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { connect } from '@/utils/RmsDva';
import FormattedMessage from '@/components/FormattedMessage';
import {
  convertToUserTimezone,
  dealResponse,
  formatMessage,
  isNull,
  isStrictNull,
} from '@/utils/util';
import { fetchLoadCirculationRecord } from '@/services/resourceService';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import SearchCirculationComponent from './component/SearchCirculationComponent';
import commonStyles from '@/common.module.less';

const LoadCirculation = (props) => {
  const { dispatch } = props;
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);

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

  function checkTaskDetail(taskId) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId },
    });
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
              <span
                className={commonStyles.textLinks}
                onClick={() => {
                  checkTaskDetail(text);
                }}
              >
                {text ? '*' + text.substr(text.length - 6, 6) : null}
              </span>
            </Tooltip>
          );
        }
      },
    },

    {
      title: <FormattedMessage id="resource.load" />,
      dataIndex: 'loadId',
      align: 'center',
      render: (text, record) => {
        if (isStrictNull(record.loadTypeName)) {
          return text;
        }
        return `${record.loadTypeName}: ${text}`;
      },
    },
    {
      title: <FormattedMessage id="resource.load.source.storage" />,
      dataIndex: 'sourceCode',
      align: 'center',
      render: (text, record) => {
        if (isStrictNull(record.sourceType)) {
          return text;
        }
        return `${record.sourceType}: ${text}`;
      },
    },
    {
      title: <FormattedMessage id="resource.load.target.storage" />,
      dataIndex: 'targetCode',
      align: 'center',
      render: (text, record) => {
        if (isStrictNull(record.targetType)) {
          return text;
        }
        return (
          <>
            <span>{`${record.targetType}`} : </span>
            <span>{text}</span>
          </>
        );
      },
    },
    {
      title: <FormattedMessage id="resource.load.changeTime" />,
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => {
        return convertToUserTimezone(text)?.format('YYYY-MM-DD HH:mm:ss');
      },
    },
    {
      title: <FormattedMessage id="resource.load.triggeror" />,
      dataIndex: 'createdByUser',
      align: 'center',
    },
  ];

  function handleTableChange(pagination) {
    const page = { currentPage: pagination.current, size: pagination.pageSize };
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
          showTotal: (total) => formatMessage({ id: 'app.template.tableRecord' }, { count: total }),
        }}
        onChange={handleTableChange}
      />
    </TablePageWrapper>
  );
};

export default connect()(memo(LoadCirculation));
