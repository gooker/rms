import React, { useState, memo, useEffect } from 'react';
import { connect } from '@/utils/RmsDva';
import { Button, Row, Col, message, Tooltip } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchAgvTaskLockList, batchDeleteAgvTaskLock } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import RobotLockSearch from './RobotLockSearch';
import commonStyles from '@/common.module.less';
import { dealResponse, isNull, isStrictNull, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';

const RobotLock = (props) => {
  const { dispatch } = props;

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
    const response = await fetchAgvTaskLockList();
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
    const { vehicleId, taskId } = formValues;
    if (!isStrictNull(vehicleId)) {
      result = result.filter((item) => {
        return item.vehicleId === vehicleId;
      });
    }
    if (!isStrictNull(taskId)) {
      result = result.filter((item) => item.taskId === taskId);
    }
    setCurrentRobottLockList(result);
    return;
  }

  function checkTaskDetail(taskId) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId },
    });
  }

  async function deleteRobotLock() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        const response = await batchDeleteAgvTaskLock(selectedRow);
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
        title: <FormattedMessage id="app.vehicle.id" />,
        dataIndex: 'vehicleId',
        align: 'center',
        fixed: 'left',
      },
      {
        title: <FormattedMessage id="app.agvType" />,
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
      //       return <FormattedMessage id="lockManage.vehicle.missingRobotLock" />;
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
      <TableWithPages
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
