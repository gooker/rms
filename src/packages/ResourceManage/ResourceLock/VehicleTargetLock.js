import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { connect } from '@/utils/RmsDva';
import { dealResponse, isNull, isStrictNull } from '@/utils/util';
import TableWithPages from '@/components/TableWithPages';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import VehicleTargetSearch from './components/VehicleTargetLockSearch';
import { fetchVehicleTargetLockList } from '@/services/commonService';
import commonStyles from '@/common.module.less';

const TaskTargetLock = (props) => {
  const [loading, setLoading] = useState(false);
  const [datasource, setDatasource] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id="app.map.cell" />,
      dataIndex: 'cellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.vehicleType" />,
      dataIndex: 'vehicleType',
      align: 'center',
    },
    {
      title: <FormattedMessage id="vehicle.code" />,
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.task.id" />,
      dataIndex: 'taskId',
      align: 'center',
      render: (text, record) => {
        if (!isNull(text)) {
          return (
            <Tooltip title={text}>
              <span
                className={commonStyles.textLinks}
                onClick={() => {
                  checkTaskDetail(text, record.vehicleType);
                }}
              >
                {text ? '*' + text.substr(text.length - 6, 6) : null}
              </span>
            </Tooltip>
          );
        }
      },
    },
  ];

  useEffect(() => {
    freshData();
  }, []);

  async function freshData(formValue = {}) {
    setLoading(true);
    const response = await fetchVehicleTargetLockList();
    if (!dealResponse(response)) {
      filterData(response, formValue);
    }
    setLoading(false);
  }

  function filterData(list, formValues) {
    let dataSource = [...list];
    const { taskId, cellId, vehicleType, vehicleCode } = formValues;
    if (!isStrictNull(taskId)) {
      dataSource = dataSource.filter((item) => item.taskId === taskId);
    }
    if (!isStrictNull(cellId)) {
      dataSource = dataSource.filter((item) => cellId === item.cellId);
    }
    if (!isStrictNull(vehicleType)) {
      dataSource = dataSource.filter((item) => item.vehicleType === vehicleType);
    }
    if (Array.isArray(vehicleCode)) {
      dataSource = dataSource.filter((item) => vehicleCode.includes(item.vehicleId));
    }
    setDatasource(dataSource);
  }

  function checkTaskDetail(taskId, vehicleType) {
    const { dispatch } = props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  }

  return (
    <TablePageWrapper>
      <VehicleTargetSearch onSearch={freshData} />
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={datasource}
        rowKey={({ vehicleUniqueId }) => vehicleUniqueId}
      />
    </TablePageWrapper>
  );
};

export default connect(() => ({}))(memo(TaskTargetLock));
