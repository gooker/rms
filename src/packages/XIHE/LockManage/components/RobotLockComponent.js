import React, { useState, memo, useEffect } from 'react';
import { connect } from '@/utils/RcsDva';
import { Button, Row, Col, message } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchAgvTaskLockList, fetchBatchDeleteTargetCellLock } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import RobotLockSearch from './RobotLockSearch';
import commonStyles from '@/common.module.less';
import { dealResponse, isNull, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';

const RobotLock = (props) => {
  const { getColumn, dispatch, agvType } = props;

  const [loading, setLoading] = useState(false);
  const [robotLockList, setRobotLockList] = useState([]);
  const [currentRobotLockList, setCurrentRobottLockList] = useState([]);
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
    const response = await fetchAgvTaskLockList(agvType);
    if (!dealResponse(response)) {
      setRobotLockList(response);
      filterData(response);
    }
    setLoading(false);
  }

  function filterData(list, formValues) {
    let result = [...list];
    if (isNull(formValues)) {
      setCurrentRobottLockList(result);
      return;
    }
    const { robotId, taskId } = formValues;
    if (!isNull(robotId)) {
      result = result.filter((item) => {
        return item.robotId === robotId;
      });
    }
    if (!isNull(taskId)) {
      result = result.filter((item) => item.taskId === taskId);
    }
    setCurrentRobottLockList(result);
    return;
  }

  function checkTaskDetail(taskId, agvType) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType: agvType },
    });
  }

  async function deleteRobotLock() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await fetchBatchDeleteTargetCellLock({
          agvTaskLockDTOList: selectedRow,
        });
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.tip.operationFinish' }));
          getData();
        } else {
          message.success(formatMessage({ id: 'app.tip.operateFailed' }));
        }
      },
    });
  }

  return (
    <TablePageWrapper>
      <div>
        <RobotLockSearch search={filterData} data={robotLockList} />
        <Row>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteRobotLock}>
              <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
            </Button>
            <Button onClick={getData}>
              <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
            </Button>
          </Col>
        </Row>
      </div>
      <TableWidthPages
        bordered
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={getColumn(checkTaskDetail)}
        dataSource={currentRobotLockList}
        rowKey={(record, index) => index}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </TablePageWrapper>
  );
};

export default connect(() => ({}))(memo(RobotLock));
