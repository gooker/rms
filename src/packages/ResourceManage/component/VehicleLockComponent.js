import React, { memo, useEffect, useState } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Col, message, Row, Tooltip } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { batchDeleteVehicleTaskLock, fetchVehicleTaskLockList } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import SearchTargetLock from '../ResourceLock/components/SearchTargetLock';
import commonStyles from '@/common.module.less';
import { dealResponse, formatMessage, isNull, isStrictNull } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';

const VehicleLock = (props) => {
  const { dispatch } = props;

  const [loading, setLoading] = useState(false);
  const [vehicleLockList, setVehicleLockList] = useState([]);
  const [currentVehicleLockList, setCurrentVehicletLockList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  useEffect(() => {
    async function init() {
      await getData();
    }
    init();
  }, []);

  function onSelectChange(selectedKeys, selectedRow) {
    setSelectedRowKeys(selectedKeys);
    setSelectedRow(selectedRow);
  }

  async function getData() {
    setLoading(true);
    const response = await fetchVehicleTaskLockList();
    if (!dealResponse(response)) {
      setVehicleLockList(response);
      filterData(response);
    }
    setLoading(false);
  }

  function filterData(list, formValues) {
    let result = [...list];
    if (isNull(formValues)) {
      setCurrentVehicletLockList(result);
      return;
    }
    const { vehicleId, vehicleType } = formValues;
    if (!isStrictNull(vehicleId)) {
      result = result.filter((item) => {
        return item.vehicleId === vehicleId;
      });
    }
    if (!isStrictNull(vehicleType)) {
      const currentVehicleType = [];
      vehicleType?.map((value) => {
        currentVehicleType.push(value.split('@')[1]);
      });

      result = result.filter((item) => currentVehicleType.includes(item.vehicleType));
    }
    setCurrentVehicletLockList(result);
    return;
  }

  function checkTaskDetail(taskId) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId },
    });
  }

  async function deleteVehicleLock() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await batchDeleteVehicleTaskLock(selectedRow);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          getData();
        } else {
          message.success(formatMessage({ id: 'app.tip.operateFailed' }));
        }
      },
    });
  }

  function getColumn(checkDetail) {
    return [
      {
        title: <FormattedMessage id="vehicle.id" />,
        dataIndex: 'vehicleId',
        align: 'center',
        fixed: 'left',
      },
      {
        title: <FormattedMessage id="app.vehicleType" />,
        dataIndex: 'vehicleType',
        align: 'center',
        fixed: 'left',
      },
      // {
      //   title: <FormattedMessage id="lockManage.vehicle.status" />,
      //   dataIndex: 'lockStatus',
      //   render: (text) => {
      //     if (text === 0) {
      //       return <FormattedMessage id="lockManage.vehicle.fullLock" />;
      //     }
      //     if (text === 1) {
      //       return <FormattedMessage id="lockManage.vehicle.missingTaskLock" />;
      //     }
      //     if (text === 2) {
      //       return <FormattedMessage id="lockManage.vehicle.missingVehicleLock" />;
      //     }
      //     return <FormattedMessage id="app.common.notAvailable" />;
      //   },
      // },
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
                    checkDetail(text);
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
  }

  return (
    <TablePageWrapper>
      <div>
        <SearchTargetLock search={filterData} data={vehicleLockList} taskIdHide={true} />
        <Row>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteVehicleLock}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
            <Button onClick={getData}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>
      <TableWithPages
        bordered
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={getColumn(checkTaskDetail)}
        dataSource={currentVehicleLockList}
        rowKey={(record, index) => index}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </TablePageWrapper>
  );
};

export default connect(() => ({}))(memo(VehicleLock));
