import React, { memo, useEffect, useState } from 'react';
import TablePageWrapper from '@/components/TablePageWrapper';
import { message, Table } from 'antd';
import { fetchDefinedFaults, fetchVehicleErrorRecord } from '@/services/commonService';
import { convertToUserTimezone, dealResponse, formatMessage } from '@/utils/util';
import FaultListSearchForm from '@/pages/FaultList/FaultListSearchForm';
import FaultCodeContent from '@/components/FaultCodeContent';

const FaultListComponent = (props) => {
  const { vehicleType } = props;

  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ pageSize: 10, current: 1, total: 0 });

  const [faultList, setFaultList] = useState([]);
  const [definedFaults, setDefinedFaults] = useState({});

  useEffect(() => {
    async function init() {
      await fetchDefinedFaultList();
      await fetchFaultList();
    }
    init();
  }, []);

  const columns = [
    {
      title: formatMessage({ id: 'vehicle.id' }),
      dataIndex: 'vehicleId',
      align: 'center',
      width: 100,
    },
    {
      title: formatMessage({ id: 'app.fault.name' }),
      dataIndex: 'errorCode',
      align: 'center',
      width: 150,
      render: (errorCode) => (
        <FaultCodeContent code={errorCode} faultContent={definedFaults[errorCode]} />
      ),
    },
    {
      title: formatMessage({ id: 'app.fault.firstReport' }),
      dataIndex: 'createTime',
      align: 'center',
      width: 230,
      render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: formatMessage({ id: 'app.fault.lastReport' }),
      dataIndex: 'updateTime',
      align: 'center',
      width: 230,
      render: (text) => convertToUserTimezone(text).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: formatMessage({ id: 'app.task.id' }),
      dataIndex: 'taskId',
      align: 'center',
      width: 220,
      render: (text) => {
        return (
          <span
            onClick={() => {
              this.onDetail(text);
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
      width: 120,
    },
    {
      title: formatMessage({ id: 'app.fault.extraData1' }),
      dataIndex: 'preData',
      align: 'center',
      width: 150,
    },
    {
      title: formatMessage({ id: 'app.fault.extraData2' }),
      dataIndex: 'curData',
      align: 'center',
      width: 150,
    },
  ];

  // 获取所有错误信息
  async function fetchFaultList(formValues) {
    setLoading(true);
    const requestParam = {
      ...formValues,
      current: pagination.current,
      size: pagination.pageSize,
      type: 'All',
      vehicleErrorTypes: ['HARDWARE_ERROR'],
    };
    const response = await fetchVehicleErrorRecord(vehicleType, requestParam);
    if (!dealResponse(response)) {
      const { list, page } = response;
      setFaultList(list);
      setPagination({ current: page.currentPage, pageSize: page.size, total: page.totalElements });
    }
    setLoading(false);
  }

  // 获取已定义的故障数据
  async function fetchDefinedFaultList() {
    const response = await fetchDefinedFaults(vehicleType);
    if (!dealResponse(response)) {
      const _definedFaults = {};
      if (Array.isArray(response)) {
        response.forEach((fault) => {
          _definedFaults[fault.errorCode] = fault;
        });
      }
      setDefinedFaults(_definedFaults);
    } else {
      message.error(formatMessage({ id: 'app.fault.fetchDefinedFailed' }));
    }
  }

  function handleTableChange({ current, pageSize }) {
    setPagination({ ...pagination, current, pageSize });
    fetchFaultList({ current, size: pageSize });
  }

  function renderTotalTip(total) {
    return formatMessage({ id: 'app.common.tableRecord' }, { count: total });
  }

  return (
    <TablePageWrapper>
      <div>
        <FaultListSearchForm
          vehicleType={vehicleType}
          search={fetchFaultList}
          faults={definedFaults}
        />
      </div>
      <Table
        bordered
        loading={loading}
        columns={columns}
        dataSource={faultList}
        onChange={handleTableChange}
        pagination={{ pagination, showSizeChanger: true, showTotal: renderTotalTip }}
        rowKey={({ fileTaskId }) => fileTaskId}
      />
    </TablePageWrapper>
  );
};
export default memo(FaultListComponent);
