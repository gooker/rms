import React, { useState, memo, useEffect } from 'react';
import { Tooltip, Button, Row, Col } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import { fetchLoadTaskLockList, batchDeletePodTaskLock } from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import commonStyles from '@/common.module.less';
import { dealResponse, isNull, isStrictNull, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';
import SearchTargetLock from './components/SearchTargetLock';

const ContainerLock = (props) => {
  const [loading, setLoading] = useState(false);
  const [containerLockList, setContainerLockList] = useState([]);
  const [currentLockList, setCurrentLockList] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id="lock.container.id" />,
      dataIndex: 'loadId	',
      align: 'center',
    },
    {
      title: <FormattedMessage id="app.common.type" />,
      dataIndex: 'loadType',
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
      payload: { taskId, agvType },
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
        const response = await batchDeletePodTaskLock(selectedRow);
        if (!dealResponse(response, true)) {
          freshData();
        }
      },
    });
  }
  async function freshData() {
    setLoading(true);
    const response = await fetchLoadTaskLockList();
    if (!dealResponse(response)) {
      setContainerLockList(response);
      filterData(response);
    }
    setLoading(false);
  }

  function filterData(list,formValues) {
    let result = [...list];
    if (isNull(formValues)) {
      setCurrentLockList(result);
      return;
    }
    const { taskId, vehicleType: loadType } = formValues;
    if (!isStrictNull(taskId)) {
      result = result.filter((item) => {
        return item.taskId === taskId;
      });
    }
    if (!isStrictNull(loadType)) {
      result = result.filter((item) => loadType.includes(item.vehicleType));
    }

    setCurrentLockList(result);
  }

  return (
    <TablePageWrapper>
      <div>
        <SearchTargetLock
          search={filterData}
          data={containerLockList}
          verhicleHide={true}
          loadType={true}
        />
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
        dataSource={currentLockList}
        rowKey={(record) => record.vehicleUniqueId}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </TablePageWrapper>
  );
};
export default memo(ContainerLock);
