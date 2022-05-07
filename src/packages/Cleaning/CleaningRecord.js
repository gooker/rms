import React, { memo, useEffect, useState } from 'react';
import { Row, message, Tag } from 'antd';
import { fetchCleaningTaskHistory } from '@/services/api';
import { dealResponse, convertToUserTimezone, formatMessage, isNull } from '@/utils/util';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import CleaningRecordSearch from './components/CleaningRecordSearch';

const CleaningRecord = () => {
  const [loading, setLoading] = useState(false);
  const [nowPage, setNowPage] = useState({ current: 1, size: 10, totalElements: 0 });
  const [searchParams, setSearchParams] = useState({});
  const [dataList, setDataList] = useState([]);

  const renderColumn = [
    {
      title: formatMessage({ id: 'app.map.cell' }),
      dataIndex: 'cellId',
      fixed: 'left',
    },

    {
      title: <FormattedMessage id="cleaninCenter.status" />,
      dataIndex: 'isSuccess',
      render: (text) => {
        if (text) {
          return (
            <Tag color="green">
              <FormattedMessage id="app.batchFirmwareUpgrade.success" />
            </Tag>
          );
        }
        return (
          <Tag color="#f50">
            <FormattedMessage id="app.activity.TaskError" />
          </Tag>
        );
      },
    },

    {
      title: <FormattedMessage id="cleaninCenter.isSkip" />,
      dataIndex: 'isSkip',
      render: (text) => {
        if (text) {
          return <FormattedMessage id="app.chargeManger.yes" />;
        }
        return <FormattedMessage id="app.chargeManger.no" />;
      },
    },
    {
      title: formatMessage({ id: 'cleaninCenter.isDropby' }),
      dataIndex: 'isPassCell',
      render: (text) => {
        if (text) {
          return <FormattedMessage id="app.chargeManger.yes" />;
        }
        return <FormattedMessage id="app.chargeManger.no" />;
      },
    },
    {
      title: formatMessage({ id: 'cleaningCenter.isCleanMissCode' }),
      dataIndex: 'isCleanMissCode',
      render: (text) => {
        if (text) {
          return <FormattedMessage id="app.chargeManger.yes" />;
        }
        return <FormattedMessage id="app.chargeManger.no" />;
      },
    },
    {
      title: formatMessage({ id: 'cleaninCenter.fail.reason' }),
      dataIndex: 'failReason',
    },
    {
      title: <FormattedMessage id="cleaninCenter.cleaningtime" />,
      dataIndex: 'cleaningTime',
      render: (text) => {
        if (text) {
          return convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss');
        }
      },
    },
  ];

  useEffect(() => {
    async function init() {
      getRenderData();
    }
    init();
  }, []);

  /**
   * 查询方法
   * @param {*} values 查询条件
   * @param {*} pages 当前页数
   */
  async function getRenderData(values, pages) {
    setLoading(true);

    const { current, size } = nowPage;
    let requestParams;
    if (values) {
      requestParams = { ...values };
      setSearchParams(values);
    } else {
      requestParams = { ...searchParams };
    }
    const currentPages = isNull(pages)
      ? { current, size }
      : { current: pages.current, size: pages.size };

    const params = { ...currentPages, ...requestParams };

    const resData = await fetchCleaningTaskHistory(params);

    if (resData && !dealResponse(resData)) {
      const { list, page } = resData;
      setDataList(list);
      setNowPage(page);
    } else {
      message.error(formatMessage({ id: 'cleaningCenter.history.fetchFailed' }));
    }
    setLoading(false);
  }

  function searchHandle(values) {
    const { cellId, cleaningDate } = values;
    let cleaningTimeStart = null;
    let cleaningTimeEnd = null;
    if (cleaningDate != null && cleaningDate[0] && cleaningDate[1]) {
      cleaningTimeStart = convertToUserTimezone(values.cleaningDate[0], 1).format(
        'YYYY-MM-DD HH:mm:ss',
      );
      cleaningTimeEnd = convertToUserTimezone(values.cleaningDate[1], 1).format(
        'YYYY-MM-DD HH:mm:ss',
      );
    }
    const searchParams = { cellId, cleaningTimeStart, cleaningTimeEnd };
    setSearchParams(searchParams);
  }

  function handleTableChange({ current, pageSize }) {
    const page = { ...nowPage, current, size: pageSize };
    setNowPage(page);
    getRenderData(null, page);
  }

  return (
    <TablePageWrapper>
      <Row style={{ marginBottom: 5, paddingTop: 5 }}>
        <CleaningRecordSearch searchData={getRenderData} searchHandle={searchHandle} />
      </Row>
      <TableWithPages
        dataSource={dataList}
        columns={renderColumn}
        scroll={{ x: 'max-content' }}
        loading={loading}
        rowKey={(record) => {
          return record.id;
        }}
        pagination={{
          showTotal: (total) =>
            `${formatMessage({ id: 'app.common.tableRowCount' }, { value: total })}`,
          current: nowPage?.current,
          total: nowPage?.totalElements,
        }}
        onChange={handleTableChange}
      />
    </TablePageWrapper>
  );
};
export default memo(CleaningRecord);
