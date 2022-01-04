import React, { useState, memo, useEffect } from 'react';
import { connect } from '@/utils/dva';
import { Button, Row, Col, message } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchTargetCellLockList, fetchBatchDeleteTargetCellLock } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import RobotLockSearch from './RobotLockSearch';
import commonStyles from '@/common.module.less';
import { dealResponse, isNull, formatMessage } from '@/utils/utils';
import RmsConfirm from '@/components/RmsConfirm';

const TargetLock = (props) => {
  const { getColumn, dispatch } = props;

  const [loading, setLoading] = useState(false);
  const [targetLockList, setTargetLockList] = useState([]);
  const [currentTargetLockList, setCurrentTargetLockList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  useEffect(() => {
    async function init() {
      await freshData();
    }
    init();
  }, []);

  function onSelectChange(selectedKeys, selectedRow) {
    setSelectedRowKeys(selectedKeys);
    setSelectedRow(selectedRow);
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
    const { robotId, cellId } = formValues;
    if (!isNull(robotId)) {
      result = result.filter((item) => {
        return item.robotId === robotId;
      });
    }
    if (!isNull(cellId)) {
      result = result.filter((item) => item.cellId === cellId);
    }
    setCurrentTargetLockList(result);
    return;
  }

  function checkTaskDetail(taskId, agvType) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType: agvType },
    });
  }

  async function deleteTargetLock() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await fetchBatchDeleteTargetCellLock({
          sectionId: window.localStorage.getItem('sectionId'),
          lockTargetCellValueList: selectedRow,
        });
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.tip.operationFinish' }));
          freshData();
        } else {
          message.success(formatMessage({ id: 'app.tip.operateFailed' }));
        }
      },
    });
  }

  return (
    <TablePageWrapper>
      <div>
        <RobotLockSearch search={filterData} data={targetLockList} />
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
      <TableWidthPages
        bordered
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={getColumn(checkTaskDetail)}
        dataSource={currentTargetLockList}
        rowKey={(record, index) => index}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </TablePageWrapper>
  );
};

export default connect(() => ({}))(memo(TargetLock));
