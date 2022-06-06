import React, { useState, memo, useEffect } from 'react';
import { connect } from '@/utils/RmsDva';
import { Tooltip, Button, Row, Col, message } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchTargetCellLockList, fetchBatchDeleteTargetCellLock } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import commonStyles from '@/common.module.less';
import { dealResponse, isNull, isStrictNull, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import SearchTargetLock from './components/SearchTargetLock';

const TargetLock = (props) => {
  const [loading, setLoading] = useState(false);
  const [targetLockList, setTargetLockList] = useState([]);
  const [currentTargetLockList, setCurrentTargetLockList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id="app.map.cell" />,
      dataIndex: 'cellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.vehicle" />,
      dataIndex: 'vehicleId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'vehicleType',
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
    async function init() {
      await freshData();
    }
    init();
  }, []);

  function checkTaskDetail(taskId, vehicleType) {
    const { dispatch } = props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, vehicleType },
    });
  }

  function onSelectChange(selectedKeys, selectedRow) {
    setSelectedRowKeys(selectedKeys);
    setSelectedRow(selectedRow);
  }

  async function deleteTargetLock() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await fetchBatchDeleteTargetCellLock(selectedRow);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          freshData();
        } else {
          message.success(formatMessage({ id: 'app.tip.operateFailed' }));
        }
      },
    });
  }
  async function freshData() {
    setLoading(true);
    const response = await fetchTargetCellLockList();
    if (!dealResponse(response)) {
      setTargetLockList(response);
      filterData(response);
    }
    setLoading(false);
  }

  function filterData(list, formValues) {
    let result = [...list];
    if (isNull(formValues)) {
      setCurrentTargetLockList(result);
      return;
    }
    const { vehicleId, vehicleType, taskId } = formValues;
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
    if (!isStrictNull(taskId)) {
      result = result.filter((item) => item.taskId === taskId);
    }
    setCurrentTargetLockList(result);
  }

  return (
    <TablePageWrapper>
      <div>
        <SearchTargetLock search={filterData} data={targetLockList} />
        <Row>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteTargetLock}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
            <Button onClick={freshData}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>
      <TableWithPages
        bordered
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={currentTargetLockList}
        rowKey={(record) => record.vehicleUniqueId}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </TablePageWrapper>
  );
};

export default connect(() => ({}))(memo(TargetLock));
