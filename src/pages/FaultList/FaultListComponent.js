import React, { memo, useEffect, useState } from 'react';
import { Popover } from 'antd';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import TablePageWrapper from '@/components/TablePageWrapper';
import { fetchVehicleErrorRecord } from '@/services/resourceService';
import FaultListSearchForm from '@/pages/FaultList/FaultListSearchForm';
import { connect } from '@/utils/RmsDva';
import TableWithPages from '@/components/TableWithPages';

const FaultListComponent = (props) => {
  const { dispatch } = props;

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1, total: 0 });

  const [faultList, setFaultList] = useState([]);

  useEffect(() => {
    async function init() {
      await fetchFaultList();
    }
    init();
  }, []);

  const columns = [
    {
      title: formatMessage({ id: 'vehicle.id' }),
      dataIndex: 'vehicleId',
      align: 'center',
      width: '100px',
    },
    {
      title: formatMessage({ id: 'app.fault.code' }),
      dataIndex: 'errorCode',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.name' }),
      dataIndex: 'errorName',
      align: 'center',
    },
    {
      title: formatMessage({ id: 'app.fault.name' }),
      dataIndex: 'errorContent',
      align: 'center',
      render: (text) => {
        if (text) {
          if (text.length > 15) {
            return (
              <Popover
                content={<span style={{ display: 'inline-block', maxWidth: '300px' }}>{text}</span>}
                trigger="hover"
              >
                <span style={{ cursor: 'pointer' }}>{text.substr(0, 10)}...</span>
              </Popover>
            );
          } else {
            return <span>{text}</span>;
          }
        }
      },
    },
    {
      title: formatMessage({ id: 'app.fault.firstReport' }),
      dataIndex: 'createTime',
      align: 'center',
      render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: formatMessage({ id: 'app.task.id' }),
      dataIndex: 'taskId',
      align: 'center',
      width: '100px',
      render: (text) => {
        return (
          <span
            onClick={() => {
              onDetail(text);
            }}
            style={{ color: '#1890ff' }}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: formatMessage({ id: 'app.fault.step' }),
      dataIndex: 'step',
      align: 'center',
      width: '100px',
    },
  ];

  function onDetail(taskId) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId },
    });
  }

  // 获取所有故障记录
  async function fetchFaultList(formValues) {
    setLoading(true);
    const requestParam = {
      ...formValues,
      current: pagination.current,
      size: pagination.pageSize,
    };
    const response = await fetchVehicleErrorRecord(requestParam);
    if (!dealResponse(response)) {
      const { list, page } = response;
      setFaultList(list);
      setPagination({ current: page.currentPage, pageSize: page.size, total: page.totalElements });
    }
    setLoading(false);
  }

  function handleTableChange({ current, pageSize }) {
    setPagination({ ...pagination, current, pageSize });
    fetchFaultList({ current, size: pageSize });
  }

  function renderTotalTip(total) {
    return formatMessage({ id: 'app.template.tableRecord' }, { count: total });
  }

  return (
    <TablePageWrapper>
      <FaultListSearchForm search={fetchFaultList} />
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={faultList}
        scroll={{ x: 'max-content' }}
        onChange={handleTableChange}
        pagination={{ pagination, showSizeChanger: true, showTotal: renderTotalTip }}
        rowKey={({ id }) => id}
      />
    </TablePageWrapper>
  );
};
export default connect()(memo(FaultListComponent));
