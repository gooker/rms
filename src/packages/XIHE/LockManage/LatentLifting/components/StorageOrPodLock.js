import React, { useState, memo, useEffect } from 'react';
import { connect } from '@/utils/RcsDva';
import { Button, Row, Col, message } from 'antd';
import { DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import {
  fetchStorageLockList,
  batchDeleteStorageLock,
  fetchPodTaskLockList,
  batchDeletePodTaskLock,
} from '@/services/api';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWidthPages from '@/components/TableWidthPages';
import StorageOrPodLockSearch from './StorageOrPodLockSearch';
import { forIn } from 'lodash';
import commonStyles from '@/common.module.less';
import { dealResponse, isNull, isStrictNull, formatMessage } from '@/utils/util';
import RmsConfirm from '@/components/RmsConfirm';

const StorageOrPodLock = (props) => {
  const { getColumn, dispatch, type, deleteFlag } = props;

  const [loading, setLoading] = useState(false);
  const [dataList, setDataList] = useState([]);
  const [currentList, setCurrentList] = useState([]);
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
    let response = null;
    if (type === 'podlock') {
      // 货架锁
      response = await fetchPodTaskLockList();
    } else {
      // 存储点锁
      response = await fetchStorageLockList();
    }
    if (!dealResponse(response)) {
      setDataList(response);
      filterData(response);
    }
    setLoading(false);
  }

  function filterData(list, formValues) {
    let result = [...list];
    if (isNull(formValues)) {
      setCurrentList(result);
      return;
    }
    forIn(formValues, (value, key) => {
      if (!isStrictNull(value)) {
        result = result.filter((item) => {
          // eslint-disable-next-line eqeqeq
          return item[key] == value; // number/string
        });
      }
    });

    setCurrentList(result);
    return;
  }

  function checkTaskDetail(taskId, agvType) {
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, taskAgvType: agvType },
    });
  }

  async function deleteLock() {
    RmsConfirm({
      content: formatMessage({ id: 'app.message.batchDelete.confirm' }),
      onOk: async () => {
        let response = null;
        if (type === 'podlock') {
          // 货架锁
          response = await batchDeletePodTaskLock({
            lockPodValueList: selectedRow,
          });
        } else {
          // 存储点锁
          response = await batchDeleteStorageLock({
            lockStoreCellValueList: selectedRow,
          });
        }

        if (!dealResponse(response)) {
          message.success(formatMessage({ id: 'app.message.operateSuccess' }));
          getData();
        } else {
          message.success(formatMessage({ id: 'app.message.operateFailed' }));
        }
      },
    });
  }

  return (
    <TablePageWrapper>
      <div>
        <StorageOrPodLockSearch type={type} search={filterData} data={dataList} />
        <Row>
          <Col flex="auto" className={commonStyles.tableToolLeft}>
            {deleteFlag && (
              <Button danger disabled={selectedRowKeys.length === 0} onClick={deleteLock}>
                <DeleteOutlined /> <FormattedMessage id="app.button.delete" />
              </Button>
            )}
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
        dataSource={currentList}
        rowKey={(record, index) => index}
        rowSelection={{
          selectedRowKeys,
          onChange: onSelectChange,
        }}
      />
    </TablePageWrapper>
  );
};

export default connect(() => ({}))(memo(StorageOrPodLock));
