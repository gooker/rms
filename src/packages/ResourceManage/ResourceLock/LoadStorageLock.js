import React, { memo, useEffect, useState } from 'react';
import { Tooltip } from 'antd';
import { fetchLoadStorageLockList } from '@/services/commonService';
import FormattedMessage from '@/components/FormattedMessage';
import TablePageWrapper from '@/components/TablePageWrapper';
import TableWithPages from '@/components/TableWithPages';
import { dealResponse, isNull, isStrictNull } from '@/utils/util';
import commonStyles from '@/common.module.less';
import LoadStorageLockSearch from '@/packages/ResourceManage/ResourceLock/components/LoadStorageLockSearch';
import { fetchAllLoadType } from '@/services/resourceService';

const TaskStorageLock = (props) => {
  const [loading, setLoading] = useState(false);
  const [loadTypes, setLoadTypes] = useState({});
  const [datasource, setDatasource] = useState([]);

  const columns = [
    {
      title: <FormattedMessage id="app.map.cell" />,
      dataIndex: 'cellId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="resource.load.code" />,
      dataIndex: 'loadId',
      align: 'center',
    },
    {
      title: <FormattedMessage id="resource.load.type" />,
      dataIndex: 'loadType',
      align: 'center',
      render: (text) => loadTypes[text]?.name,
    },
    {
      title: <FormattedMessage id="resource.storage.code" />,
      dataIndex: 'storeCode',
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
                  checkTaskDetail(record);
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

  function freshData(formValues = {}) {
    setLoading(true);
    Promise.all([fetchLoadStorageLockList(), fetchAllLoadType()])
      .then((response) => {
        const [lock, loadType] = response;
        if (!dealResponse(lock)) {
          filterData(lock, formValues);
        }
        if (!dealResponse(loadType)) {
          const _loadTypes = {};
          loadType?.forEach((item) => {
            _loadTypes[item.code] = item;
          });
          setLoadTypes(_loadTypes);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function filterData(list, formValues) {
    let dataSource = [...list];
    const { taskId, cellId, loadType, loadCode, storageCode } = formValues;
    if (!isStrictNull(taskId)) {
      dataSource = dataSource.filter((item) => item.taskId === taskId);
    }
    if (!isStrictNull(cellId)) {
      dataSource = dataSource.filter((item) => cellId === item.cellId);
    }
    if (!isStrictNull(loadType)) {
      dataSource = dataSource.filter((item) => item.loadType === loadType);
    }
    if (!isStrictNull(loadCode)) {
      dataSource = dataSource.filter((item) => item.loadId === loadCode);
    }
    if (!isStrictNull(storageCode)) {
      dataSource = dataSource.filter((item) => item.storeCode === storageCode);
    }
    setDatasource(dataSource);
  }

  function checkTaskDetail({ taskId, loadType }) {
    const { dispatch } = props;
    dispatch({
      type: 'task/fetchTaskDetailByTaskId',
      payload: { taskId, loadType },
    });
  }

  return (
    <TablePageWrapper>
      <LoadStorageLockSearch onSearch={freshData} loadTypes={Object.values(loadTypes)} />
      <TableWithPages
        loading={loading}
        columns={columns}
        dataSource={datasource}
        rowKey={(record, index) => index}
      />
    </TablePageWrapper>
  );
};
export default memo(TaskStorageLock);
