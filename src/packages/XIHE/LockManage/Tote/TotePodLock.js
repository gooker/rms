import React, { useState, memo, useEffect } from 'react';
import { connect } from '@/utils/RmsDva';
import { Tooltip, Button, Row, Col, message } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchToteLockList, batchDeleteToteLock } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import commonStyles from '@/common.module.less';
import { dealResponse, formatMessage, isNull } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';

const TargetLock = (props) => {
  const [loading, setLoading] = useState(false);
  const [lockList, setLockList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id="lockManage.toteCode" />,
      dataIndex: 'toteCode',
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

  async function deleteLock() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await batchDeleteToteLock(selectedRow);
        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          freshData();
        } else {
          message.success(formatMessage({ id: 'app.message.operateFailed' }));
        }
      },
    });
  }
  async function freshData() {
    setLoading(true);
    const response = await fetchToteLockList();
    if (!dealResponse(response)) {
      setLockList(response);
    }
    setLoading(false);
  }

  return (
    <TablePageWrapper>
      <Row>
        <Col flex="auto" className={commonStyles.tableToolLeft}>
          <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteLock}>
            <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
          </Button>
          <Button onClick={freshData}>
            <ReloadOutlined /> <FormattedMessage id="app.button.refresh" />
          </Button>
        </Col>
      </Row>
      <TableWidthPages
        bordered
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={lockList}
        rowKey={(_, index) => index}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </TablePageWrapper>
  );
};

export default connect(() => ({}))(memo(TargetLock));
