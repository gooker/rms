import React, { useState, memo, useEffect } from 'react';
import { connect } from '@/utils/RmsDva';
import { Tooltip, Button, Row, Col, message } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchTargetCellLockList, fetchBatchDeleteTargetCellLock } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import TargetLockSearch from './components/TargetLockSearch';
import commonStyles from '@/common.module.less';
import { dealResponse, isNull, isStrictNull, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';

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
      sorter: (a, b) => a.cellId - b.cellId,
    },
    {
      title: <FormattedMessage id="app.agv" />,
      dataIndex: 'robotId',
      align: 'center',
      sorter: (a, b) => a.robotId - b.robotId,
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
                  checkTaskDetail(text, record.robotType);
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

  function checkTaskDetail(taskId, agvType) {
    const { dispatch } = props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType: agvType },
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
    if (!isStrictNull(robotId)) {
      result = result.filter((item) => {
        return item.robotId === robotId;
      });
    }
    if (!isStrictNull(cellId)) {
      result = result.filter((item) => item.cellId === Number(cellId));
    }
    setCurrentTargetLockList(result);
    return;
  }

  return (
    <TablePageWrapper>
      <div>
        <TargetLockSearch search={filterData} data={targetLockList} />
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
        columns={columns}
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
